// lib/reports.ts
import { supabase } from "@/lib/supabase";

export type ReportItem = {
  id: string;
  user_id?: string | null;
  type: "lost" | "found" | string;
  category: string;
  title: string;
  description: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  image_url?: string | null;
  status?: string;
  created_at: string;
  // Compatibility fields
  imageUri?: string | null;
  createdAt?: string;
  contactName?: string;
  contactPhone?: string;
  handoverSpot?: string;
};

export type NewReportPayload = {
  user_id?: string | null;
  type: "lost" | "found";
  category: string;
  title: string;
  description: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  image_url?: string | null;
  status?: string;
};

export async function fetchReports(): Promise<ReportItem[]> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchReports error:", error.message);
      return [];
    }
    return (data as ReportItem[]) || [];
  } catch (err) {
    console.warn("fetchReports error:", err);
    return [];
  }
}

export async function fetchReportById(id: string): Promise<ReportItem | null> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.warn("fetchReportById error:", error.message);
      return null;
    }
    return (data as ReportItem) || null;
  } catch (err) {
    console.warn("fetchReportById error:", err);
    return null;
  }
}

export function sanitizeCategory(cat?: string | null): "device" | "money" | "id" | "other" {
  const c = (cat || "").toLowerCase().trim();
  if (c === "devices" || c === "device" || c === "electronics" || c === "phone") return "device";
  if (c === "money" || c === "wallet" || c === "wallets" || c === "cash") return "money";
  if (c === "id" || c === "ids" || c === "card" || c === "cards" || c === "keys") return "id";
  return "other";
}

export async function createReport(
  payload: NewReportPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const safeCategory = sanitizeCategory(payload.category);

    const { error } = await supabase.from("reports").insert([
      {
        user_id: payload.user_id,
        type: payload.type,
        category: safeCategory,
        title: payload.title,
        description: payload.description,
        location: payload.location,
        contact_name: payload.contact_name,
        contact_phone: payload.contact_phone,
        image_url: payload.image_url,
        status: payload.status || "open",
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create report" };
  }
}

export async function deleteReport(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete report" };
  }
}

/**
 * Fetch all reports submitted by a specific user
 */
export async function fetchUserReports(
  userId: string
): Promise<ReportItem[]> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchUserReports error:", error.message);
      return [];
    }
    return (data as ReportItem[]) || [];
  } catch (err) {
    console.warn("fetchUserReports error:", err);
    return [];
  }
}

/**
 * Update the status of a report (e.g. 'open' vs 'returned')
 */
export async function updateReportStatus(
  id: string,
  status: "open" | "returned" | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update report status" };
  }
}
