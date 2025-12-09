import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView as RNSafeAreaView,
  GestureResponderEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

type Msg = {
  id: string;
  text: string;
  fromMe: boolean;
  ts: string;
};

export default function Chat() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = (params?.id as string) || "unknown";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList<Msg> | null>(null);

  useEffect(() => {
    // seed with a welcome message referencing the report id
    setMessages([
      {
        id: "1",
        text: `This is a demo chat for report ${id}.`,
        fromMe: false,
        ts: new Date().toISOString(),
      },
    ]);
  }, [id]);

  const send = () => {
    if (!text.trim()) return;
    const m: Msg = {
      id: Date.now().toString(),
      text: text.trim(),
      fromMe: true,
      ts: new Date().toISOString(),
    };
    setMessages((s) => [...s, m]);
    setText("");

    // fake reply after 700ms
    setTimeout(() => {
      setMessages((s) => [
        ...s,
        {
          id: Date.now().toString() + "-r",
          text: "Demo reply — this is a UI-only chat.",
          fromMe: false,
          ts: new Date().toISOString(),
        },
      ]);
    }, 700);

    // scroll to end after a small delay (allow setState to update)
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const renderItem = ({ item }: { item: Msg }) => {
    const align = item.fromMe ? "items-end" : "items-start";
    const bg = item.fromMe ? "bg-blue-600" : "bg-slate-200";
    const color = item.fromMe ? "text-white" : "text-slate-900";

    return (
      <View className={`mb-3 ${align}`}>
        <View className={`px-3 py-2 rounded-2xl max-w-[80%] ${bg}`}>
          <Text className={`${color} text-sm`}>{item.text}</Text>
          <Text className={`${color} text-[10px] mt-1`}>
            {new Date(item.ts).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  // Dismiss keyboard when tapping outside
  const onTouchOutside = (e: GestureResponderEvent) => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* top bar */}
      <View className="px-4 py-3 border-b border-slate-200 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Chat</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-blue-600">Close</Text>
        </Pressable>
      </View>

      {/* KeyboardAvoidingView handles iOS keyboard correctly */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // adjust if you have a header
      >
        {/* Tap outside to dismiss */}
        <TouchableWithoutFeedback onPress={onTouchOutside}>
          <View style={{ flex: 1 }}>
            {/* Messages list */}
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(i) => i.id}
              renderItem={renderItem}
              contentContainerStyle={{
                padding: 16,
                paddingBottom: 140, // leave space for input bar
                flexGrow: 1,
                justifyContent: "flex-start", // ensure messages start at top
              }}
              // keep keyboard from hiding items when focused
              keyboardShouldPersistTaps="handled"
            />

            {/* Input bar anchored at bottom */}
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: "white",
                borderTopWidth: 1,
                borderTopColor: "#e6e6e6",
              }}
            >
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: Platform.OS === "ios" ? 10 : 8,
                    backgroundColor: "#ffffff",
                  }}
                  returnKeyType="send"
                  onSubmitEditing={send}
                />
                <Pressable
                  onPress={send}
                  style={{
                    backgroundColor: text.trim() ? "#2563eb" : "#c7d2fe",
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 999,
                  }}
                  disabled={!text.trim()}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Send</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
