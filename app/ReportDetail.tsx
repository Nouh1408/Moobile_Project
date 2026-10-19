// app/ReportDetail.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchReportById, deleteReport as deleteSupabaseReport, ReportItem } from "@/lib/reports";

export default function ReportDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = (params?.id as string) || "";

  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);

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

  const deleteReport = async () => {
    if (!report?.id) return;
    Alert.alert(
      "Remove Report",
      "Are you sure you want to remove this report from the campus directory?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteSupabaseReport(report.id);
              if (res.success) {
                router.replace("/(tabs)/Browse");
              } else {
                Alert.alert("Error", res.error || "Failed to delete report.");
              }
            } catch {
              Alert.alert("Error", "Failed to delete report.");
            }
          },
        },
      ]
    );
  };

  const contactPhone = report?.contact_phone || report?.contactPhone;
  const contactName = report?.contact_name || report?.contactName;
  const imageUrl = report?.image_url || report?.imageUri;
  const createdAtDate = report?.created_at || report?.createdAt;

  const handleCall = () => {
    if (!contactPhone) return;
    const cleanNumber = contactPhone.replace(/\s+/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert(
        "Contact Reporter",
        `Phone number: ${contactPhone}`
      );
    });
  };

  const isFound =
    report?.type === "found" ||
    (report?.title || "").toLowerCase().includes("found");

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

      {/* ================= FLAT TOP BAR ================= */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-9 h-9 border border-[#E4E4E7] rounded-[2px] bg-[#FAFAFA] items-center justify-center active:bg-[#E4E4E7]"
        >
          <Ionicons name="arrow-back" size={18} color="#1A1A1A" />
        </Pressable>

        <View className="flex-row items-center">
          <View
            className={`px-2 py-0.5 rounded-[2px] border mr-2 ${
              isFound
                ? "bg-[#F0FDF4] border-[#86EFAC]"
                : "bg-[#FEF2F2] border-[#FCA5A5]"
            }`}
          >
            <Text
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isFound ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}
            >
              {isFound ? "FOUND ITEM" : "LOST ITEM"}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={deleteReport}
          hitSlop={8}
          className="w-9 h-9 border border-[#FCA5A5] rounded-[2px] bg-[#FEF2F2] items-center justify-center active:bg-[#FEE2E2]"
        >
          <Ionicons name="trash-outline" size={17} color="#DC2626" />
        </Pressable>
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
            <View className="bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-[2px]">
              <Text className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
                {report.category || "General"}
              </Text>
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

        {/* ================= CONTACT INFO CARD ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-6">
          <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
            Reporter Information
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="person-circle-outline" size={20} color="#71717A" />
              <Text className="text-xs font-bold text-[#1A1A1A] ml-2">
                {contactName || "Campus Member"}
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

        {/* ================= ACTION BUTTONS ================= */}
        <View className="gap-2.5">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/Chat",
                params: {
                  id: report.id,
                  title: report.title,
                  location: report.location || "",
                  type: report.type || "",
                },
              } as any)
            }
            className="bg-[#0066FF] active:bg-[#0052CC] py-3.5 rounded-[2px] flex-row items-center justify-center"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold uppercase tracking-wider ml-2">
              Start Secure Chat
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCall}
            className="border border-[#1A1A1A] bg-white active:bg-[#F4F5F7] py-3 rounded-[2px] flex-row items-center justify-center"
          >
            <Ionicons name="call-outline" size={16} color="#1A1A1A" />
            <Text className="text-[#1A1A1A] text-xs font-bold uppercase tracking-wider ml-2">
              Direct Contact
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
