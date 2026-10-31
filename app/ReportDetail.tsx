// app/ReportDetail.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../_providers/AuthProvider";
import {
  fetchReportById,
  deleteReport as deleteSupabaseReport,
  updateReportStatus,
  ReportItem,
} from "@/lib/reports";

export default function ReportDetail() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const id = (params?.id as string) || "";

  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Verification challenge claim modal
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [claimProof, setClaimProof] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        if (!id) {
          setReport(null);
          return;
        }
        const found = await fetchReportById(id);
        setReport(found);
      } catch {
        Alert.alert("Error", "Could not load report details.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const isOwner = !!(user?.id && report?.user_id && user.id === report.user_id);
  const isReturned = report?.status === "returned";
  const isFound =
    report?.type === "found" ||
    (report?.title || "").toLowerCase().includes("found");

  const deleteReport = async () => {
    if (!report?.id) return;
    Alert.alert(
      "Remove Report",
      "Are you sure you want to remove this report from the campus directory? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(true);
              const res = await deleteSupabaseReport(report.id);
              setActionLoading(false);
              if (res.success) {
                router.replace("/(tabs)/Browse");
              } else {
                Alert.alert("Error", res.error || "Failed to delete report.");
              }
            } catch {
              setActionLoading(false);
              Alert.alert("Error", "Failed to delete report.");
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async () => {
    if (!report?.id) return;
    const nextStatus = isReturned ? "open" : "returned";
    const label = isReturned
      ? "re-open this report"
      : "mark this item as returned/recovered";

    Alert.alert("Update Item Status", `Are you sure you want to ${label}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "default",
        onPress: async () => {
          try {
            setActionLoading(true);
            const res = await updateReportStatus(report.id, nextStatus);
            setActionLoading(false);
            if (res.success) {
              setReport((prev) => (prev ? { ...prev, status: nextStatus } : prev));
            } else {
              Alert.alert("Error", res.error || "Failed to update status.");
            }
          } catch {
            setActionLoading(false);
            Alert.alert("Error", "Failed to update status.");
          }
        },
      },
    ]);
  };

  const contactPhone = report?.contact_phone || report?.contactPhone;
  const contactName = report?.contact_name || report?.contactName;
  const imageUrl = report?.image_url || report?.imageUri;
  const createdAtDate = report?.created_at || report?.createdAt;

  const handleCall = () => {
    if (!contactPhone) return;
    const cleanNumber = contactPhone.replace(/\s+/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert("Contact Reporter", `Phone number: ${contactPhone}`);
    });
  };

  const handleClaimItem = () => {
    if (isFound) {
      // Finder requires answering a verification challenge
      setClaimProof("");
      setClaimModalVisible(true);
    } else {
      // Lost item: open chat directly
      router.push({
        pathname: "/Chat",
        params: {
          id: report!.id,
          title: report!.title,
          location: report!.location || "",
          type: report!.type || "",
        },
      } as any);
    }
  };

  const handleConfirmClaimProof = () => {
    if (!claimProof.trim()) {
      Alert.alert(
        "Verification Required",
        "Please provide some identifying details to help the finder confirm you are the rightful owner."
      );
      return;
    }
    setClaimModalVisible(false);
    router.push({
      pathname: "/Chat",
      params: {
        id: report!.id,
        title: report!.title,
        location: report!.location || "",
        type: report!.type || "",
        claimProof: claimProof.trim(),
      },
    } as any);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FAFAFA] items-center justify-center">
        <ActivityIndicator size="small" color="#0066FF" />
        <Text className="text-xs text-[#71717A] uppercase tracking-wider font-semibold mt-3">
          Loading report details…
        </Text>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-[#FAFAFA] items-center justify-center px-6">
        <View className="w-14 h-14 bg-white border border-[#E4E4E7] rounded-[2px] items-center justify-center mb-3">
          <Ionicons name="document-text-outline" size={28} color="#71717A" />
        </View>
        <Text className="text-base font-bold text-[#1A1A1A]">
          Report Not Found
        </Text>
        <Text className="text-xs text-[#71717A] text-center mt-1">
          This listing may have been recovered or removed by its reporter.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 bg-[#1A1A1A] px-4 py-2.5 rounded-[2px]"
        >
          <Text className="text-white text-xs font-bold uppercase tracking-wider">
            Back to Directory
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const formattedDate = createdAtDate
    ? new Date(createdAtDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently reported";

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* ================= TOP NAVIGATION BAR ================= */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-9 h-9 border border-[#E4E4E7] rounded-[2px] bg-[#FAFAFA] items-center justify-center active:bg-[#E4E4E7]"
        >
          <Ionicons name="arrow-back" size={18} color="#1A1A1A" />
        </Pressable>

        <View className="flex-row items-center">
          {/* Status Badge */}
          <View
            className={`px-2 py-0.5 rounded-[2px] border mr-2 ${
              isReturned
                ? "bg-[#F4F5F7] border-[#D4D4D8]"
                : isFound
                ? "bg-[#F0FDF4] border-[#86EFAC]"
                : "bg-[#FEF2F2] border-[#FCA5A5]"
            }`}
          >
            <Text
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isReturned
                  ? "text-[#71717A]"
                  : isFound
                  ? "text-[#16A34A]"
                  : "text-[#DC2626]"
              }`}
            >
              {isReturned ? "RETURNED" : isFound ? "FOUND ITEM" : "LOST ITEM"}
            </Text>
          </View>
        </View>

        {/* Delete button: ONLY visible to the report owner */}
        {isOwner ? (
          <Pressable
            onPress={deleteReport}
            hitSlop={8}
            className="w-9 h-9 border border-[#FCA5A5] rounded-[2px] bg-[#FEF2F2] items-center justify-center active:bg-[#FEE2E2]"
          >
            <Ionicons name="trash-outline" size={17} color="#DC2626" />
          </Pressable>
        ) : (
          <View className="w-9" />
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= IMAGE SHOWCASE ================= */}
        <View className="border border-[#E4E4E7] rounded-[2px] bg-white overflow-hidden mb-4">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-64"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-44 bg-[#F4F5F7] items-center justify-center">
              <Ionicons name="cube-outline" size={36} color="#A1A1AA" />
              <Text className="text-xs text-[#71717A] mt-2 font-medium">
                No photographic record attached
              </Text>
            </View>
          )}
        </View>

        {/* ================= TITLE & BADGES CARD ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <View className="bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-[2px]">
                <Text className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
                  {report.category || "General"}
                </Text>
              </View>

              {isOwner && (
                <View className="bg-[#1A1A1A] px-2 py-0.5 rounded-[2px]">
                  <Text className="text-white text-[9px] font-bold uppercase tracking-wider">
                    Your Post
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-[11px] text-[#71717A]">{formattedDate}</Text>
          </View>

          <Text className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            {report.title}
          </Text>
        </View>

        {/* ================= LOCATION CARD ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4 flex-row items-start">
          <View className="w-8 h-8 bg-[#F4F5F7] border border-[#E4E4E7] rounded-[2px] items-center justify-center mr-3 mt-0.5">
            <Ionicons name="location-outline" size={18} color="#0066FF" />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">
              {isFound ? "Location Found On Campus" : "Last Seen Campus Spot"}
            </Text>
            <Text className="text-xs font-semibold text-[#4A4A4A] mt-0.5">
              {report.location || "General Campus Grounds"}
            </Text>
          </View>
        </View>

        {/* ================= SAFE HANDOVER DESK RECOMMENDATION ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4 flex-row items-start">
          <View className="w-8 h-8 bg-[#F0FDF4] border border-[#86EFAC] rounded-[2px] items-center justify-center mr-3 mt-0.5">
            <Ionicons name="shield-checkmark" size={17} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">
              Safe Handover Recommendation
            </Text>
            <Text className="text-xs text-[#4A4A4A] mt-0.5 leading-5">
              {report.handoverSpot ||
                "Arrange handover at Main Library Reception Desk or Campus Security (Gate 2)."}
            </Text>
          </View>
        </View>

        {/* ================= DESCRIPTION CARD ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4">
          <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
            Description & Notes
          </Text>
          <Text className="text-xs text-[#4A4A4A] leading-5">
            {report.description || "No specific marks or details provided."}
          </Text>
        </View>

        {/* ================= REPORTER INFORMATION ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-6">
          <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
            Reporter Information
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="person-circle-outline" size={20} color="#71717A" />
              <Text className="text-xs font-bold text-[#1A1A1A] ml-2">
                {isOwner ? "You (Author)" : contactName || "Campus Member"}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={14} color="#71717A" />
              <Text className="text-xs text-[#71717A] ml-1.5">
                {contactPhone || "Hidden"}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= DYNAMIC CONTEXTUAL ACTION BUTTONS ================= */}
        <View className="gap-2.5">
          {isOwner ? (
            /* OWNER CONTROLS */
            <>
              <Pressable
                onPress={handleToggleStatus}
                disabled={actionLoading}
                className={`py-3.5 rounded-[2px] flex-row items-center justify-center ${
                  isReturned
                    ? "bg-[#1A1A1A] active:bg-[#333333]"
                    : "bg-[#16A34A] active:bg-[#15803D]"
                }`}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons
                      name={isReturned ? "refresh-outline" : "checkmark-done-outline"}
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text className="text-white text-xs font-bold uppercase tracking-wider ml-2">
                      {isReturned ? "Re-open Report" : "Mark as Returned / Resolved"}
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={deleteReport}
                disabled={actionLoading}
                className="border border-[#DC2626] bg-[#FEF2F2] active:bg-[#FEE2E2] py-3 rounded-[2px] flex-row items-center justify-center"
              >
                <Ionicons name="trash-outline" size={16} color="#DC2626" />
                <Text className="text-[#DC2626] text-xs font-bold uppercase tracking-wider ml-2">
                  Delete Report
                </Text>
              </Pressable>
            </>
          ) : (
            /* VISITOR / OTHER CAMPUS MEMBER CONTROLS */
            <>
              {/* Primary Context-Aware Action Button (project.md §6.4 & §7) */}
              <Pressable
                onPress={handleClaimItem}
                className={`py-3.5 rounded-[2px] flex-row items-center justify-center ${
                  isFound
                    ? "bg-[#0066FF] active:bg-[#0052CC]"
                    : "bg-[#16A34A] active:bg-[#15803D]"
                }`}
              >
                <Ionicons
                  name={isFound ? "hand-right-outline" : "chatbubble-ellipses-outline"}
                  size={18}
                  color="#FFFFFF"
                />
                <Text className="text-white text-xs font-bold uppercase tracking-wider ml-2">
                  {isFound ? "This is Mine (Claim Item)" : "I Found This (Chat with Owner)"}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleCall}
                className="border border-[#1A1A1A] bg-white active:bg-[#F4F5F7] py-3 rounded-[2px] flex-row items-center justify-center"
              >
                <Ionicons name="call-outline" size={16} color="#1A1A1A" />
                <Text className="text-[#1A1A1A] text-xs font-bold uppercase tracking-wider ml-2">
                  Direct Call / Contact
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      {/* ================= OWNERSHIP VERIFICATION CHALLENGE MODAL (project.md §7) ================= */}
      <Modal
        visible={claimModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setClaimModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/60 items-center justify-center px-6"
            onPress={() => setClaimModalVisible(false)}
          >
            <Pressable
              className="w-full bg-white border border-[#E4E4E7] rounded-[2px] p-5"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row items-center justify-between mb-3 border-b border-[#E4E4E7] pb-3">
                <View className="flex-row items-center">
                  <View className="w-7 h-7 bg-[#EFF6FF] rounded-[2px] items-center justify-center mr-2 border border-[#BFDBFE]">
                    <Ionicons name="shield-checkmark" size={15} color="#0066FF" />
                  </View>
                  <Text className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Verify Ownership
                  </Text>
                </View>

                <Pressable
                  onPress={() => setClaimModalVisible(false)}
                  hitSlop={8}
                  className="w-7 h-7 rounded-[2px] bg-[#FAFAFA] border border-[#E4E4E7] items-center justify-center"
                >
                  <Ionicons name="close" size={16} color="#71717A" />
                </Pressable>
              </View>

              <Text className="text-xs text-[#4A4A4A] leading-5 mb-3">
                To protect found property on campus, describe unique details only the rightful owner would know (e.g. lockscreen wallpaper, stickers, case color, or contents):
              </Text>

              <TextInput
                value={claimProof}
                onChangeText={setClaimProof}
                placeholder="e.g. The phone has a transparent case with a green cat sticker and a blue wallpaper..."
                placeholderTextColor="#A1A1AA"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-[2px] p-3 text-xs text-[#1A1A1A] min-h-[85px] mb-4"
              />

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setClaimModalVisible(false)}
                  className="flex-1 py-3 border border-[#E4E4E7] rounded-[2px] items-center justify-center active:bg-[#F4F5F7]"
                >
                  <Text className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleConfirmClaimProof}
                  className="flex-1 py-3 bg-[#0066FF] active:bg-[#0052CC] rounded-[2px] items-center justify-center"
                >
                  <Text className="text-xs font-bold text-white uppercase tracking-wider">
                    Submit & Chat
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
