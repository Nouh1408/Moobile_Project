// app/(tabs)/Browse.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../_providers/AuthProvider";
import { fetchReports, ReportItem } from "@/lib/reports";

const categoryFilters = [
  { key: "all", label: "All Categories", icon: "grid-outline" as const },
  { key: "device", label: "Devices", icon: "phone-portrait-outline" as const },
  { key: "money", label: "Wallets & Cash", icon: "wallet-outline" as const },
  { key: "id", label: "IDs & Cards", icon: "card-outline" as const },
  { key: "other", label: "Keys & Misc", icon: "apps-outline" as const },
] as const;

type CategoryKey = (typeof categoryFilters)[number]["key"];
type StatusKey = "all" | "lost" | "found";

type Report = ReportItem;

export default function Browse() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const list = await fetchReports();
      setItems(list);
    } catch (err) {
      console.error("Failed to load items from Supabase:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/(auth)/Login");
    }
  }, [authLoading, token, router]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const getCategoryKey = (
    category?: string | null,
    title?: string,
    description?: string
  ): CategoryKey => {
    const normalize = (s?: string | null) => (s || "").toLowerCase().trim();
    const c = normalize(category);
    const t = normalize(title);
    const d = normalize(description);
    const combined = `${c} ${t} ${d}`;

    if (
      c === "device" ||
      c === "devices" ||
      c === "phone" ||
      c === "phones"
    )
      return "device";
    if (c === "money" || c === "wallet" || c === "cash") return "money";
    if (c === "id" || c === "ids" || c === "identity") return "id";
    if (c === "other" || c === "misc") return "other";

    if (
      combined.includes("phone") ||
      combined.includes("iphone") ||
      combined.includes("mobile") ||
      combined.includes("tablet") ||
      combined.includes("laptop") ||
      combined.includes("macbook") ||
      combined.includes("airpods")
    ) {
      return "device";
    }
    if (
      combined.includes("wallet") ||
      combined.includes("cash") ||
      combined.includes("money") ||
      combined.includes("purse")
    ) {
      return "money";
    }
    if (
      combined.includes("id") ||
      combined.includes("license") ||
      combined.includes("passport") ||
      combined.includes("card")
    ) {
      return "id";
    }
    return "other";
  };

  const getItemStatus = (item: Report): "lost" | "found" => {
    if (item.type === "found") return "found";
    if (item.type === "lost") return "lost";
    const titleLower = (item.title || "").toLowerCase();
    if (titleLower.includes("found")) return "found";
    return "lost";
  };

  const filtered = items.filter((it) => {
    const itemStatus = getItemStatus(it);
    if (statusFilter !== "all" && itemStatus !== statusFilter) {
      return false;
    }

    const catKey = getCategoryKey(it.category, it.title, it.description);
    if (activeCategory !== "all" && catKey !== activeCategory) {
      return false;
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      it.title.toLowerCase().includes(q) ||
      (it.description || "").toLowerCase().includes(q) ||
      (it.location || "").toLowerCase().includes(q) ||
      (it.category || "").toLowerCase().includes(q)
    );
  });

  const openDetails = (report: Report) => {
    router.push({
      pathname: "/ReportDetail",
      params: { id: report.id },
    } as any);
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "Recent";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FAFAFA] items-center justify-center">
        <Text className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
          Checking campus session…
        </Text>
      </SafeAreaView>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      <StatusBar style="dark" />

      {/* ================= FLAT TOP BAR ================= */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
            CAMPUS DIRECTORY
          </Text>
          <Text className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            Browse Reports
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/ReportLostItem")}
          className="bg-[#0066FF] active:bg-[#0052CC] px-3 py-2 rounded-[2px] flex-row items-center"
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold uppercase tracking-wider ml-1">
            Report
          </Text>
        </Pressable>
      </View>

      {/* ================= SEARCH & FILTER CONTROLS ================= */}
      <View className="bg-white border-b border-[#E4E4E7] px-5 pt-3.5 pb-3">
        {/* Flat Search Bar (Fixes bug bg-red-100) */}
        <View
          className={`flex-row items-center bg-[#FAFAFA] border rounded-[2px] px-3 py-2.5 mb-3 ${
            isSearchFocused
              ? "border-[#0066FF] border-[2px]"
              : "border-[#E4E4E7]"
          }`}
        >
          <Ionicons name="search-outline" size={17} color="#71717A" />
          <TextInput
            placeholder="Search items, categories, or campus hall..."
            placeholderTextColor="#A1A1AA"
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="flex-1 px-2.5 text-xs text-[#1A1A1A]"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={17} color="#71717A" />
            </Pressable>
          )}
        </View>

        {/* Status Segment Switcher (All / Lost / Found) */}
        <View className="flex-row bg-[#F4F5F7] p-1 border border-[#E4E4E7] rounded-[2px] mb-3">
          <Pressable
            onPress={() => setStatusFilter("all")}
            className={`flex-1 py-1.5 items-center justify-center rounded-[2px] ${
              statusFilter === "all" ? "bg-[#1A1A1A]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[11px] font-bold uppercase tracking-wider ${
                statusFilter === "all" ? "text-white" : "text-[#4A4A4A]"
              }`}
            >
              All ({items.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setStatusFilter("lost")}
            className={`flex-1 py-1.5 items-center justify-center rounded-[2px] ${
              statusFilter === "lost" ? "bg-[#1A1A1A]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[11px] font-bold uppercase tracking-wider ${
                statusFilter === "lost" ? "text-white" : "text-[#4A4A4A]"
              }`}
            >
              Lost
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setStatusFilter("found")}
            className={`flex-1 py-1.5 items-center justify-center rounded-[2px] ${
              statusFilter === "found" ? "bg-[#1A1A1A]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[11px] font-bold uppercase tracking-wider ${
                statusFilter === "found" ? "text-white" : "text-[#4A4A4A]"
              }`}
            >
              Found
            </Text>
          </Pressable>
        </View>

        {/* Horizontal Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        >
          {categoryFilters.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() =>
                  setActiveCategory(isActive && cat.key !== "all" ? "all" : cat.key)
                }
                className={`px-3 py-1.5 rounded-[2px] flex-row items-center border ${
                  isActive
                    ? "bg-[#1A1A1A] border-[#1A1A1A]"
                    : "bg-white border-[#E4E4E7]"
                }`}
              >
                <Ionicons
                  name={cat.icon}
                  size={13}
                  color={isActive ? "#FFFFFF" : "#71717A"}
                />
                <Text
                  className={`ml-1.5 text-[11px] font-bold uppercase tracking-wider ${
                    isActive ? "text-white" : "text-[#4A4A4A]"
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ================= ITEMS FEED LIST ================= */}
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
        {loading && !refreshing ? (
          <View className="py-12 items-center justify-center">
            <Text className="text-xs text-[#71717A] uppercase tracking-wider font-semibold">
              Loading campus listings…
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          /* Flat Empty State */
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-8 items-center justify-center mt-4">
            <View className="w-12 h-12 bg-[#F4F5F7] border border-[#E4E4E7] rounded-[2px] items-center justify-center mb-3">
              <Ionicons name="search" size={24} color="#71717A" />
            </View>
            <Text className="text-sm font-bold text-[#1A1A1A] text-center">
              No matching campus reports
            </Text>
            <Text className="text-xs text-[#71717A] text-center mt-1 max-w-xs leading-4">
              Try adjusting your search terms or clearing the selected category filters.
            </Text>

            <View className="flex-row gap-2 mt-4">
              <Pressable
                onPress={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setStatusFilter("all");
                }}
                className="border border-[#E4E4E7] bg-white px-3 py-2 rounded-[2px]"
              >
                <Text className="text-xs font-semibold text-[#4A4A4A]">
                  Reset Filters
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/ReportLostItem")}
                className="bg-[#0066FF] px-3.5 py-2 rounded-[2px]"
              >
                <Text className="text-xs font-bold text-white uppercase tracking-wider">
                  Post Report
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* Flat 2D Report Cards */
          <View className="gap-3">
            <View className="flex-row items-center justify-between pb-1">
              <Text className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
                Showing {filtered.length} report{filtered.length === 1 ? "" : "s"}
              </Text>
            </View>

            {filtered.map((item) => {
              const status = getItemStatus(item);
              const catKey = getCategoryKey(
                item.category,
                item.title,
                item.description
              );

              return (
                <Pressable
                  key={item.id}
                  onPress={() => openDetails(item)}
                  className="bg-white border border-[#E4E4E7] rounded-[2px] p-3.5 active:bg-[#F4F5F7]"
                >
                  <View className="flex-row">
                    {/* Thumbnail Image */}
                    {item.image_url || item.imageUri ? (
                      <Image
                        source={{ uri: (item.image_url || item.imageUri)! }}
                        className="w-20 h-20 rounded-[2px] mr-3 border border-[#E4E4E7]"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-20 h-20 rounded-[2px] mr-3 bg-[#F4F5F7] border border-[#E4E4E7] items-center justify-center">
                        <Ionicons
                          name={
                            catKey === "device"
                              ? "phone-portrait-outline"
                              : catKey === "money"
                              ? "wallet-outline"
                              : catKey === "id"
                              ? "card-outline"
                              : "cube-outline"
                          }
                          size={24}
                          color="#71717A"
                        />
                      </View>
                    )}

                    {/* Card Content */}
                    <View className="flex-1 justify-between">
                      {/* Top Badges */}
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row gap-1.5 items-center">
                          {/* Status Badge */}
                          <View
                            className={`px-1.5 py-0.5 rounded-[2px] border ${
                              status === "lost"
                                ? "bg-[#FEF2F2] border-[#FCA5A5]"
                                : "bg-[#F0FDF4] border-[#86EFAC]"
                            }`}
                          >
                            <Text
                              className={`text-[9px] font-bold uppercase tracking-wider ${
                                status === "lost"
                                  ? "text-[#DC2626]"
                                  : "text-[#16A34A]"
                              }`}
                            >
                              {status}
                            </Text>
                          </View>

                          {/* Category Badge */}
                          <View className="bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.5 rounded-[2px]">
                            <Text className="text-[9px] font-bold text-[#0066FF] uppercase tracking-wider">
                              {catKey}
                            </Text>
                          </View>
                        </View>

                        <Text className="text-[10px] text-[#A1A1AA] font-medium">
                          {formatDate(item.created_at || item.createdAt)}
                        </Text>
                      </View>

                      {/* Title & Description */}
                      <View className="my-1">
                        <Text
                          className="text-sm font-bold text-[#1A1A1A]"
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text
                          className="text-xs text-[#4A4A4A] mt-0.5"
                          numberOfLines={2}
                        >
                          {item.description || "No additional description provided."}
                        </Text>
                      </View>

                      {/* Location & Action */}
                      <View className="flex-row items-center justify-between pt-1 border-t border-[#F4F5F7]">
                        <View className="flex-row items-center flex-1 mr-2">
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color="#71717A"
                          />
                          <Text
                            className="text-[11px] text-[#71717A] ml-1"
                            numberOfLines={1}
                          >
                            {item.location || "Campus Grounds"}
                          </Text>
                        </View>

                        <View className="flex-row items-center">
                          <Text className="text-[11px] font-bold text-[#0066FF] mr-0.5">
                            Details
                          </Text>
                          <Ionicons
                            name="chevron-forward"
                            size={12}
                            color="#0066FF"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
