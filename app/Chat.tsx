// app/Chat.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../_providers/AuthProvider";
import {
  ChatMessage,
  fetchChatMessages,
  sendChatMessage,
  subscribeToChat,
  markReportReturned,
} from "@/lib/chat";

const quickResponses = [
  "Is this item still available?",
  "I am at Main Library Reception.",
  "Meeting at Campus Security Gate 2.",
  "Can you verify the serial/lockscreen?",
  "When are you free to meet?",
];

export default function Chat() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const reportId = (params?.id as string) || "";
  const itemTitle = (params?.title as string) || "Campus Item";
  const itemLocation = (params?.location as string) || "Campus";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isReturned, setIsReturned] = useState(false);

  const listRef = useRef<FlatList<ChatMessage> | null>(null);

  // Derive sender display name
  const senderName = user?.email
    ? user.email.split("@")[0].replace(/\d+/g, "")
    : user?.phone || "Campus Member";

  // Load past messages on mount
  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!reportId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchChatMessages(reportId);
        if (isMounted) {
          setMessages(data);
        }
      } catch (err) {
        console.warn("Failed to load chat messages:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    // Subscribe to realtime incoming messages
    const channel = subscribeToChat(reportId, (newMsg) => {
      setMessages((prev) => {
        // Prevent duplicate if added optimistically
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 80);
    });

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, [reportId]);

  // Send message handler
  const handleSendMessage = useCallback(
    async (content?: string) => {
      const msgText = (content || text).trim();
      if (!msgText || sending || !user?.id) {
        if (!user?.id) {
          Alert.alert("Authentication", "Please log in to send messages.");
        }
        return;
      }

      setSending(true);
      if (!content) setText("");

      // Optimistic temporary message
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: ChatMessage = {
        id: tempId,
        report_id: reportId,
        sender_id: user.id,
        text: msgText,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 50);

      // Send to Supabase
      const res = await sendChatMessage(
        reportId,
        user.id,
        msgText
      );

      setSending(false);

      if (!res.success) {
        // Revert optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        Alert.alert(
          "Message Failed",
          res.error || "Could not deliver message to campus chat."
        );
      } else if (res.data) {
        // Replace tempId with actual server ID
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? res.data! : m))
        );
      }
    },
    [text, sending, user, reportId, senderName]
  );

  // Mark item as returned
  const handleMarkReturned = () => {
    Alert.alert(
      "Confirm Handover",
      `Are you sure you want to mark "${itemTitle}" as safely returned to its owner?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Handover",
          style: "default",
          onPress: async () => {
            const res = await markReportReturned(reportId);
            if (res.success) {
              setIsReturned(true);
              Alert.alert(
                "Handover Recorded",
                "Item status updated to Returned. Thank you for making the campus safer!"
              );
              // Send system notice into chat
              handleSendMessage(
                "🏁 Item handover complete. Marked as returned."
              );
            } else {
              Alert.alert("Error", res.error || "Could not update status.");
            }
          },
        },
      ]
    );
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "Now";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Now";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender_id === user?.id;
    return (
      <View className={`mb-3 ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && item.sender_name && (
          <Text className="text-[10px] text-[#71717A] font-semibold mb-1 ml-1 uppercase">
            {item.sender_name}
          </Text>
        )}
        <View
          className={`px-3.5 py-2.5 max-w-[82%] rounded-[2px] border ${
            isMe
              ? "bg-[#0066FF] border-[#0052CC]"
              : "bg-white border-[#E4E4E7]"
          }`}
        >
          <Text
            className={`text-xs leading-5 ${
              isMe ? "text-white" : "text-[#1A1A1A]"
            }`}
          >
            {item.text || item.content}
          </Text>
          <Text
            className={`text-[9px] mt-1 self-end ${
              isMe ? "text-white/80" : "text-[#71717A]"
            }`}
          >
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* ================= FLAT TOP BAR ================= */}
      <View className="px-5 py-3 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-9 h-9 border border-[#E4E4E7] rounded-[2px] bg-[#FAFAFA] items-center justify-center active:bg-[#E4E4E7]"
        >
          <Ionicons name="arrow-back" size={18} color="#1A1A1A" />
        </Pressable>

        <View className="items-center flex-1 mx-2">
          <Text
            className="text-xs font-bold text-[#1A1A1A] text-center"
            numberOfLines={1}
          >
            {itemTitle}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <View className="w-1.5 h-1.5 bg-[#16A34A] rounded-full mr-1" />
            <Text className="text-[10px] text-[#71717A] uppercase font-semibold">
              Live Campus Chat • {itemLocation}
            </Text>
          </View>
        </View>

        {/* Handover CTA */}
        <Pressable
          onPress={handleMarkReturned}
          hitSlop={6}
          disabled={isReturned}
          className={`px-2 py-1.5 rounded-[2px] border ${
            isReturned
              ? "bg-[#F0FDF4] border-[#86EFAC]"
              : "bg-[#1A1A1A] border-[#1A1A1A] active:bg-[#333333]"
          }`}
        >
          <Text
            className={`text-[9px] font-bold uppercase tracking-wider ${
              isReturned ? "text-[#16A34A]" : "text-white"
            }`}
          >
            {isReturned ? "Returned ✓" : "Resolved"}
          </Text>
        </Pressable>
      </View>

      {/* ================= PINNED HANDOVER SPOT BANNER ================= */}
      <View className="bg-[#F0FDF4] border-b border-[#86EFAC] px-4 py-2 flex-row items-center">
        <Ionicons name="shield-checkmark" size={15} color="#16A34A" />
        <Text className="text-[11px] text-[#166534] font-medium ml-2 flex-1">
          Safe Spot: Meet at Main Library Reception Desk or Security Gate 2.
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="small" color="#0066FF" />
                <Text className="text-xs text-[#71717A] mt-2 font-semibold uppercase tracking-wider">
                  Connecting to live chat…
                </Text>
              </View>
            ) : messages.length === 0 ? (
              /* Flat Empty State */
              <View className="flex-1 items-center justify-center p-6">
                <View className="w-12 h-12 bg-white border border-[#E4E4E7] rounded-[2px] items-center justify-center mb-3">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color="#0066FF"
                  />
                </View>
                <Text className="text-sm font-bold text-[#1A1A1A] text-center">
                  Start the conversation
                </Text>
                <Text className="text-xs text-[#71717A] text-center mt-1 max-w-xs leading-4">
                  Arrange a safe campus meetup or verify identifying details about this item.
                </Text>
              </View>
            ) : (
              /* Messages List */
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingTop: 16,
                  paddingBottom: 20,
                  flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() =>
                  listRef.current?.scrollToEnd({ animated: true })
                }
              />
            )}

            {/* Quick Suggestions Scroll */}
            <View className="bg-white border-t border-[#E4E4E7] py-2 px-3">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6 }}
              >
                {quickResponses.map((qr) => (
                  <Pressable
                    key={qr}
                    onPress={() => handleSendMessage(qr)}
                    disabled={sending}
                    className="border border-[#E4E4E7] bg-[#FAFAFA] active:bg-[#E4E4E7] px-2.5 py-1 rounded-[2px]"
                  >
                    <Text className="text-[10px] font-semibold text-[#4A4A4A]">
                      {qr}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Flat Message Input Bar */}
            <View className="bg-white border-t border-[#E4E4E7] p-3 flex-row items-center gap-2">
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type a message..."
                placeholderTextColor="#A1A1AA"
                className="flex-1 bg-[#FAFAFA] border border-[#E4E4E7] rounded-[2px] px-3 py-2.5 text-xs text-[#1A1A1A]"
                returnKeyType="send"
                onSubmitEditing={() => handleSendMessage()}
              />
              <Pressable
                onPress={() => handleSendMessage()}
                disabled={!text.trim() || sending}
                className={`w-10 h-10 rounded-[2px] items-center justify-center ${
                  text.trim() && !sending
                    ? "bg-[#0066FF] active:bg-[#0052CC]"
                    : "bg-[#E4E4E7]"
                }`}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name="send"
                    size={16}
                    color={text.trim() ? "#FFFFFF" : "#71717A"}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
