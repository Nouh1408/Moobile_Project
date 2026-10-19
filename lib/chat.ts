// lib/chat.ts
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export type ChatMessage = {
  id: string;
  report_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  // compatibility aliases
  content?: string;
  sender_name?: string | null;
};

/**
 * Fetch past messages for a specific report
 */
export async function fetchChatMessages(
  reportId: string
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("report_id", reportId)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("fetchChatMessages error:", error.message);
      return [];
    }
    return (data as ChatMessage[]) || [];
  } catch (err) {
    console.warn("fetchChatMessages error:", err);
    return [];
  }
}

/**
 * Send a new message to the report chat
 */
export async function sendChatMessage(
  reportId: string,
  senderId: string,
  messageText: string
): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
  try {
    const payload = {
      report_id: reportId,
      sender_id: senderId,
      text: messageText.trim(),
    };

    const { data, error } = await supabase
      .from("messages")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data as ChatMessage };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to send message" };
  }
}

/**
 * Subscribe to realtime incoming messages for this report
 */
export function subscribeToChat(
  reportId: string,
  onNewMessage: (msg: ChatMessage) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`chat_${reportId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `report_id=eq.${reportId}`,
      },
      (payload) => {
        if (payload.new) {
          onNewMessage(payload.new as ChatMessage);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Update report status to 'returned' in Supabase
 */
export async function markReportReturned(
  reportId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("reports")
      .update({ status: "returned" })
      .eq("id", reportId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update status" };
  }
}
