// app/(tabs)/Profile.tsx
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "../../_providers/AuthProvider";
import {
  fetchUserReports,
  updateReportStatus,
  deleteReport,
  ReportItem,
} from "@/lib/reports";

type TabMode = "active" | "returned";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabMode>("active");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Derive user info
  const userIdentifier = user?.email
    ? user.email.split("@")[0].replace(/\d+/g, "")
    : user?.phone || "Campus Member";

  const userInitial = (userIdentifier.charAt(0) || "U").toUpperCase();
  const fullContact = user?.email || user?.phone || "Verified Campus Member";

  const loadMyReports = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const list = await fetchUserReports(user.id);
      setReports(list);
    } catch (err) {
      console.warn("Failed to load user reports:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadMyReports();
    }, [loadMyReports])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyReports();
    setRefreshing(false);
  };

  const handleToggleStatus = async (item: ReportItem) => {
    const isCurrentlyReturned = item.status === "returned";
    const nextStatus = isCurrentlyReturned ? "open" : "returned";
    const actionLabel = isCurrentlyReturned ? "re-open this report" : "mark this item as returned/resolved";

    Alert.alert(
      "Update Report Status",
      `Are you sure you want to ${actionLabel}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            setActionLoadingId(item.id);
            const res = await updateReportStatus(item.id, nextStatus);
            setActionLoadingId(null);
            if (res.success) {
              setReports((prev) =>
                prev.map((r) =>
                  r.id === item.id ? { ...r, status: nextStatus } : r
                )
              );
            } else {
              Alert.alert("Error", res.error || "Failed to update status.");
            }
          },
        },
      ]
    );
  };

  const handleDelete = (item: ReportItem) => {
    Alert.alert(
      "Delete Report",
      `Are you sure you want to permanently remove "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setActionLoadingId(item.id);
            const res = await deleteReport(item.id);
            setActionLoadingId(null);
            if (res.success) {
              setReports((prev) => prev.filter((r) => r.id !== item.id));
            } else {
              Alert.alert("Error", res.error || "Failed to delete report.");
            }
          },
        },
      ]
    );
  };

  const confirmLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your campus account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: logout },
      ]
    );
  };

  const activeReports = reports.filter((r) => r.status !== "returned");
  const returnedReports = reports.filter((r) => r.status === "returned");
  const displayedList = activeTab === "active" ? activeReports : returnedReports;

  const formatDate = (iso?: string) => {
    if (!iso) return "Recent";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      <StatusBar style="dark" />

      {/* ================= FLAT TOP BAR ================= */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
            CAMPUS MEMBER
          </Text>
          <Text className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            My Profile & Reports
          </Text>
        </View>

        <Pressable
          onPress={confirmLogout}
          hitSlop={8}
          className="w-9 h-9 border border-[#E4E4E7] rounded-[2px] bg-[#FAFAFA] items-center justify-center active:bg-[#E4E4E7]"
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0066FF"
          />
        }
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* ================= PROFILE IDENTITY CARD ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4">
          <View className="flex-row items-center">
            {/* Flat Monogram Avatar */}
            <View className="w-14 h-14 bg-[#1A1A1A] rounded-[2px] items-center justify-center mr-3.5">
              <Text className="text-white text-xl font-black tracking-tight">
                {userInitial}
              </Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center">
                <Text
                  className="text-base font-bold text-[#1A1A1A] mr-2"
                  numberOfLines={1}
                >
                  {userIdentifier}
                </Text>
                <View className="bg-[#F0FDF4] border border-[#86EFAC] px-1.5 py-0.5 rounded-[2px]">
                  <Text className="text-[9px] font-bold text-[#16A34A] uppercase">
                    Verified
                  </Text>
                </View>
              </View>

              <Text
                className="text-xs text-[#71717A] mt-0.5"
                numberOfLines={1}
              >
                {fullContact}
              </Text>
              <Text className="text-[10px] text-[#A1A1AA] mt-1 font-mono">
                UID: {user?.id ? `${user.id.slice(0, 8)}...` : "Local"}
              </Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View className="flex-row border-t border-[#F4F5F7] mt-4 pt-3">
            <View className="flex-1 items-center border-r border-[#F4F5F7]">
              <Text className="text-base font-bold text-[#1A1A1A]">
                {reports.length}
              </Text>
              <Text className="text-[10px] text-[#71717A] uppercase font-semibold mt-0.5">
                Total Posted
              </Text>
            </View>

            <View className="flex-1 items-center border-r border-[#F4F5F7]">
              <Text className="text-base font-bold text-[#0066FF]">
                {activeReports.length}
              </Text>
              <Text className="text-[10px] text-[#71717A] uppercase font-semibold mt-0.5">
                Active Open
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-base font-bold text-[#16A34A]">
                {returnedReports.length}
              </Text>
              <Text className="text-[10px] text-[#71717A] uppercase font-semibold mt-0.5">
                Returned
              </Text>
            </View>
          </View>
        </View>

        {/* ================= FAST ACTION BUTTONS ================= */}
        <View className="flex-row gap-2.5 mb-5">
          <Pressable
            onPress={() => router.push("/ReportLostItem")}
            className="flex-1 bg-[#1A1A1A] active:bg-[#333333] py-2.5 px-3 rounded-[2px] flex-row items-center justify-center border border-[#1A1A1A]"
          >
            <Ionicons name="search" size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold uppercase tracking-wider ml-1.5">
              Report Lost
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/ReportFoundItem")}
            className="flex-1 bg-[#0066FF] active:bg-[#0052CC] py-2.5 px-3 rounded-[2px] flex-row items-center justify-center border border-[#0066FF]"
          >
            <Ionicons name="cube-outline" size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold uppercase tracking-wider ml-1.5">
              Report Found
            </Text>
          </Pressable>
        </View>

        {/* ================= MY REPORTS SECTION ================= */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            My Submitted Reports
          </Text>
        </View>

        {/* Tab Switcher: Active vs Returned */}
        <View className="flex-row bg-[#F4F5F7] p-1 border border-[#E4E4E7] rounded-[2px] mb-3">
          <Pressable
            onPress={() => setActiveTab("active")}
            className={`flex-1 py-1.5 items-center justify-center rounded-[2px] ${
              activeTab === "active" ? "bg-[#1A1A1A]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[11px] font-bold uppercase tracking-wider ${
                activeTab === "active" ? "text-white" : "text-[#4A4A4A]"
              }`}
            >
              Active ({activeReports.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("returned")}
            className={`flex-1 py-1.5 items-center justify-center rounded-[2px] ${
              activeTab === "returned" ? "bg-[#1A1A1A]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[11px] font-bold uppercase tracking-wider ${
                activeTab === "returned" ? "text-white" : "text-[#4A4A4A]"
              }`}
            >
              Returned ({returnedReports.length})
            </Text>
          </Pressable>
        </View>

        {/* Reports List */}
        {loading && !refreshing ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="small" color="#0066FF" />
            <Text className="text-xs text-[#71717A] uppercase tracking-wider font-semibold mt-3">
              Loading your reports…
            </Text>
          </View>
        ) : displayedList.length === 0 ? (
          /* Empty State */
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-8 items-center justify-center">
            <View className="w-12 h-12 bg-[#F4F5F7] border border-[#E4E4E7] rounded-[2px] items-center justify-center mb-3">
              <Ionicons
                name={
                  activeTab === "active"
                    ? "file-tray-outline"
                    : "checkmark-circle-outline"
                }
                size={24}
                color="#71717A"
              />
            </View>
            <Text className="text-sm font-bold text-[#1A1A1A] text-center">
              {activeTab === "active"
                ? "No active reports"
                : "No returned items yet"}
            </Text>
            <Text className="text-xs text-[#71717A] text-center mt-1 max-w-xs leading-4">
              {activeTab === "active"
                ? "Items you report as lost or found will appear here for easy tracking."
                : "When you safely recover or hand over an item, mark it as returned."}
            </Text>

            {activeTab === "active" && (
              <Pressable
                onPress={() => router.push("/ReportLostItem")}
                className="mt-4 bg-[#1A1A1A] px-3.5 py-2 rounded-[2px]"
              >
                <Text className="text-white text-xs font-bold uppercase tracking-wider">
                  Post New Report
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View className="gap-3">
            {displayedList.map((item) => {
              const isFound = item.type === "found";
              const isItemReturned = item.status === "returned";
              const isProcessing = actionLoadingId === item.id;

              return (
                <View
                  key={item.id}
                  className="bg-white border border-[#E4E4E7] rounded-[2px] p-3.5"
                >
                  <View className="flex-row">
                    {/* Thumbnail */}
                    {item.image_url || item.imageUri ? (
                      <Image
                        source={{ uri: (item.image_url || item.imageUri)! }}
                        className="w-16 h-16 rounded-[2px] mr-3 border border-[#E4E4E7]"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-16 h-16 rounded-[2px] mr-3 bg-[#F4F5F7] border border-[#E4E4E7] items-center justify-center">
                        <Ionicons
                          name={isFound ? "cube-outline" : "search-outline"}
                          size={20}
                          color="#71717A"
                        />
                      </View>
                    )}

                    {/* Meta */}
                    <View className="flex-1 justify-between">
                      <View>
                        <View className="flex-row items-center justify-between mb-1">
                          <View className="flex-row gap-1.5 items-center">
                            {/* Type Badge */}
                            <View
                              className={`px-1.5 py-0.5 rounded-[2px] border ${
                                isFound
                                  ? "bg-[#F0FDF4] border-[#86EFAC]"
                                  : "bg-[#FEF2F2] border-[#FCA5A5]"
                              }`}
                            >
                              <Text
                                className={`text-[9px] font-bold uppercase ${
                                  isFound ? "text-[#16A34A]" : "text-[#DC2626]"
                                }`}
                              >
                                {isFound ? "Found" : "Lost"}
                              </Text>
                            </View>

                            {/* Status Badge */}
                            <View
                              className={`px-1.5 py-0.5 rounded-[2px] border ${
                                isItemReturned
                                  ? "bg-[#F0FDF4] border-[#86EFAC]"
                                  : "bg-[#EFF6FF] border-[#BFDBFE]"
                              }`}
                            >
                              <Text
                                className={`text-[9px] font-bold uppercase ${
                                  isItemReturned
                                    ? "text-[#16A34A]"
                                    : "text-[#0066FF]"
                                }`}
                              >
                                {isItemReturned ? "Returned ✓" : "Active"}
                              </Text>
                            </View>
                          </View>

                          <Text className="text-[10px] text-[#A1A1AA]">
                            {formatDate(item.created_at || item.createdAt)}
                          </Text>
                        </View>

                        <Text
                          className="text-xs font-bold text-[#1A1A1A]"
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text
                          className="text-[11px] text-[#71717A] mt-0.5"
                          numberOfLines={1}
                        >
                          {item.location || "Campus Grounds"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Actions Toolbar */}
                  <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-[#F4F5F7]">
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/ReportDetail",
                          params: { id: item.id },
                        } as any)
                      }
                      className="flex-row items-center py-1 px-2 border border-[#E4E4E7] rounded-[2px] bg-[#FAFAFA] active:bg-[#E4E4E7]"
                    >
                      <Ionicons
                        name="eye-outline"
                        size={12}
                        color="#1A1A1A"
                      />
                      <Text className="text-[10px] font-bold text-[#1A1A1A] uppercase ml-1">
                        View
                      </Text>
                    </Pressable>

                    <View className="flex-row gap-2">
                      {/* Toggle Resolved/Reopen */}
                      <Pressable
                        onPress={() => handleToggleStatus(item)}
                        disabled={isProcessing}
                        className={`flex-row items-center py-1 px-2 rounded-[2px] border ${
                          isItemReturned
                            ? "bg-[#FAFAFA] border-[#E4E4E7]"
                            : "bg-[#F0FDF4] border-[#86EFAC]"
                        }`}
                      >
                        {isProcessing ? (
                          <ActivityIndicator size="small" color="#0066FF" />
                        ) : (
                          <>
                            <Ionicons
                              name={
                                isItemReturned
                                  ? "arrow-undo-outline"
                                  : "checkmark-done-outline"
                              }
                              size={12}
                              color={isItemReturned ? "#71717A" : "#16A34A"}
                            />
                            <Text
                              className={`text-[10px] font-bold uppercase ml-1 ${
                                isItemReturned
                                  ? "text-[#71717A]"
                                  : "text-[#16A34A]"
                              }`}
                            >
                              {isItemReturned ? "Reopen" : "Mark Returned"}
                            </Text>
                          </>
                        )}
                      </Pressable>

                      {/* Delete */}
                      <Pressable
                        onPress={() => handleDelete(item)}
                        disabled={isProcessing}
                        className="flex-row items-center py-1 px-2 rounded-[2px] border border-[#FCA5A5] bg-[#FEF2F2] active:bg-[#FEE2E2]"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={12}
                          color="#DC2626"
                        />
                        <Text className="text-[10px] font-bold text-[#DC2626] uppercase ml-1">
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
