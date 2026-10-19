// app/Chat.tsx
import React, { useState, useRef, useCallback } from "react";
import {
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

type Msg = {
  id: string;
  text: string;
  fromMe: boolean;
  timeStr: string;
};

const quickResponses = [
  "Is this item still available?",
  "I am at Main Library Reception.",
  "Meeting at Campus Security Gate 2.",
  "Can you verify the serial/lockscreen?",
];

export default function Chat() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = (params?.id as string) || "Campus Item";
  const itemTitle = (params?.title as string) || "Lost / Found Item";

  const messageCounter = useRef(1);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "init-1",
      text: `Hello! This is a secure chat regarding "${itemTitle}". For your safety, only arrange handovers at verified campus desks.`,
      fromMe: false,
      timeStr: "12:00 PM",
    },
  ]);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList<Msg> | null>(null);

  const handleSendMessage = useCallback(
    (content?: string) => {
      const msgText = (content || text).trim();
      if (!msgText) return;

      const currentCount = ++messageCounter.current;
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMsg: Msg = {
        id: `msg-${currentCount}`,
        text: msgText,
        fromMe: true,
        timeStr: timeString,
      };

      setMessages((prev) => [...prev, newMsg]);
      if (!content) setText("");

      // Simulate reply after 700ms
      setTimeout(() => {
        const replyCount = ++messageCounter.current;
        const replyTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${replyCount}`,
            text: "Thanks for reaching out! Let's meet at the campus desk to verify and hand over the item.",
            fromMe: false,
            timeStr: replyTime,
          },
        ]);
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 700);

      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    [text]
  );

  const renderItem = ({ item }: { item: Msg }) => {
    const isMe = item.fromMe;
    return (
      <View className={`mb-3 ${isMe ? "items-end" : "items-start"}`}>
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
            {item.text}
          </Text>
          <Text
            className={`text-[9px] mt-1 self-end ${
              isMe ? "text-white/80" : "text-[#71717A]"
            }`}
          >
            {item.timeStr}
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
            {itemTitle} • #{id.slice(-5)}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <View className="w-1.5 h-1.5 bg-[#16A34A] rounded-full mr-1" />
            <Text className="text-[10px] text-[#71717A] uppercase font-semibold">
              Verified Campus Chat
            </Text>
          </View>
        </View>

        <View className="w-9 items-end">
          <View className="bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.5 rounded-[2px]">
            <Text className="text-[9px] font-bold text-[#0066FF] uppercase">
              SECURE
            </Text>
          </View>
        </View>
      </View>

      {/* ================= PINNED HANDOVER SPOT BANNER ================= */}
      <View className="bg-[#F0FDF4] border-b border-[#86EFAC] px-4 py-2 flex-row items-center">
        <Ionicons name="shield-checkmark" size={15} color="#16A34A" />
        <Text className="text-[11px] text-[#166534] font-medium ml-2 flex-1">
          Safe Spot: Meet at Main Library Desk or Campus Security (Gate 2).
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {/* Messages List */}
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 24,
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() =>
                listRef.current?.scrollToEnd({ animated: true })
              }
            />

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
                disabled={!text.trim()}
                className={`w-10 h-10 rounded-[2px] items-center justify-center ${
                  text.trim() ? "bg-[#0066FF] active:bg-[#0052CC]" : "bg-[#E4E4E7]"
                }`}
              >
                <Ionicons
                  name="send"
                  size={16}
                  color={text.trim() ? "#FFFFFF" : "#71717A"}
                />
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
