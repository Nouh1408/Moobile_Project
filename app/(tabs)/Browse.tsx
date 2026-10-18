import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../_providers/AuthProvider"; // <- auth hook

const STORAGE_KEY = "@lost_reports_v1";

const filters = [
  { key: "all", label: "All", icon: "grid-outline" as const },
  { key: "device", label: "Devices", icon: "phone-portrait-outline" as const },
  { key: "money", label: "Money", icon: "cash-outline" as const },
  { key: "id", label: "IDs", icon: "card-outline" as const },
  { key: "other", label: "Other", icon: "apps-outline" as const },
] as const;

type FilterKey = (typeof filters)[number]["key"];

type Report = {
  id: string;
  category?: string | null;
  title: string;
  description: string;
  location?: string;
  contactName: string;
  contactPhone: string;
  imageUri?: string | null;
  createdAt: string;
};

const Browse = () => {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth(); // <-- authentication state

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: Report[] = raw ? JSON.parse(raw) : [];
      setItems(list);
    } catch (err) {
      console.error("Failed to load items:", err);
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

  // Improved normalization:
  // 1) try explicit category field (map to a key)
  // 2) otherwise infer from title/description
  const getCategoryKey = (category?: string | null, title?: string, description?: string): FilterKey => {
    const normalize = (s?: string | null) => (s || "").toLowerCase().trim();

    const c = normalize(category);
    const t = normalize(title);
    const d = normalize(description);
    const combined = `${c} ${t} ${d}`;

    // direct matches / keys
    if (c === "device" || c === "devices" || c === "phone" || c === "phones") return "device";
    if (c === "money" || c === "wallet" || c === "cash") return "money";
    if (c === "id" || c === "ids" || c === "identity") return "id";
    if (c === "other" || c === "misc") return "other";

    // infer from combined text
    if (combined.includes("phone") || combined.includes("iphone") || combined.includes("mobile") || combined.includes("tablet") || combined.includes("laptop")) {
      return "device";
    }
    if (combined.includes("wallet") || combined.includes("cash") || combined.includes("money") || combined.includes("purse")) {
      return "money";
    }
    if (combined.includes("id") || combined.includes("license") || combined.includes("passport") || combined.includes("driver")) {
      return "id";
    }
    // fallback
    return "other";
  };

  // Filtering: use normalized key for each item
  const filtered = items.filter((it) => {
    const catKey = getCategoryKey(it.category, it.title, it.description);

    if (activeFilter !== "all" && catKey !== activeFilter) {
      return false;
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      it.title.toLowerCase().includes(q) ||
      (it.description || "").toLowerCase().includes(q) ||
      (it.contactName || "").toLowerCase().includes(q) ||
      (it.location || "").toLowerCase().includes(q)
    );
  });

  const openDetails = (report: Report) => {
    router.push({
      pathname: "/ReportDetail",
      params: { id: report.id },
    } as any);
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  // toggle filter: tapping an active pill resets to "all"
  const handleFilterPress = (key: FilterKey) => {
    setActiveFilter((cur) => (cur === key ? "all" : key));
  };

  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-4">
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-slate-500">Checking session…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* HEADER */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-semibold text-slate-900 px-1">All Items</Text>
          <Text className="text-xs text-slate-500 px-1">Browse lost & found items</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => router.push("/FormLost")}
            className="bg-blue-600 px-3 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">+ New</Text>
          </Pressable>
        </View>
      </View>

      <View className="px-4 ">
        
        <View className="flex-row items-center bg-red-100 rounded-2xl border border-slate-200 px-3 mb-3">
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search items, location or name..."
            placeholderTextColor="#9CA3AF"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
            className="flex-1 px-2 py-3 text-base text-slate-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 8, paddingVertical: 6 }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <Pressable
                key={filter.key}
                onPress={() => handleFilterPress(filter.key)}
                className={`px-4 py-2 rounded-full flex-row items-center ${isActive ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <Ionicons name={filter.icon} size={14} color={isActive ? "#FFF" : "#0F172A"} />
                <Text className={`ml-2 text-sm font-semibold ${isActive ? "text-white" : "text-slate-700"}`}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 48 }}>
        {loading ? (
          <View className="mt-6 items-center">
            <Text className="text-sm text-slate-500">Loading items…</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="mt-6 items-center">
            <MaterialIcons name="inventory-2" size={48} color="#9CA3AF" />
            <Text className="mt-2 text-sm text-slate-500">No items yet</Text>
            <Text className="text-xs text-slate-400 mt-2">
              Try adding a new report or clear filters.
            </Text>

            <Pressable onPress={() => router.push("/FormLost")} className="mt-4 bg-blue-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-semibold">Create Report</Text>
            </Pressable>
          </View>
        ) : (
          <View className="mt-2 space-y-3 gap-4">
            {filtered.map((it) => {
              const catKey = getCategoryKey(it.category, it.title, it.description);
              return (
                <TouchableOpacity key={it.id} onPress={() => openDetails(it)} className="bg-white rounded-2xl p-4 shadow flex-row">
                  {it.imageUri ? (
                    <Image source={{ uri: it.imageUri }} className="w-20 h-20 rounded-md mr-3" />
                  ) : (
                    <View className="w-20 h-20 rounded-md mr-3 bg-slate-100 items-center justify-center">
                      <Ionicons name="image" size={24} color="#9CA3AF" />
                    </View>
                  )}

                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-900">{it.title}</Text>
                    <Text className="text-xs text-slate-500 mt-1" numberOfLines={2}>
                      {it.description || it.location}
                    </Text>

                    <View className="flex-row items-center justify-between mt-3">
                      <View>
                        <Text className="text-xs text-slate-400">{it.contactName} • {it.contactPhone}</Text>
                        <Text className="text-xs text-slate-400 mt-1">{formatDate(it.createdAt)}</Text>
                      </View>

                      <View className="items-end">
                        <View className={`px-2 py-1 rounded-full ${catKey === "device" ? "bg-blue-100" : catKey === "money" ? "bg-yellow-100" : catKey === "id" ? "bg-green-100" : "bg-slate-100"}`}>
                          <Text className="text-xs font-semibold text-slate-800">{catKey.toUpperCase()}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Browse;
