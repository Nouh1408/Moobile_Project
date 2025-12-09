import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

import {  useRouter } from "expo-router";

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
  category: string;
  title: string;
  description: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
};

const Browse = () => {
  const router = useRouter();
  const isFocused = useIsFocused();

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

  // reload when screen focused (so new reports created in FormLost appear)
  useEffect(() => {
    if (isFocused) loadItems();
  }, [isFocused, loadItems]);

  // basic filtering + search
  const filtered = items.filter((it) => {
    // filter by category
    if (activeFilter !== "all" && it.category.toLowerCase() !== activeFilter) {
      return false;
    }
    // search by title, description or contactName
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      it.title.toLowerCase().includes(q) ||
      it.description.toLowerCase().includes(q) ||
      it.contactName.toLowerCase().includes(q)
    );
  });

  const openDetails = (report: Report) => {
    // simple detail navigation — you can implement a detail screen later
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-4">
      {/* Header */}
      <View className="mb-3">
        <Text className="text-xl font-semibold text-slate-900">All Items</Text>
        <Text className="text-xs text-slate-500 mt-1">
          Browse lost & found items
        </Text>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-white rounded-2xl border border-slate-200 px-3 mb-3">
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          placeholder="Search items..."
          placeholderTextColor="#9CA3AF"
          clearButtonMode="always"
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 px-2 py-3 text-base text-slate-900"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View className="flex-row gap-2 flex-wrap mt-1 mb-3">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              className={`
                px-4 py-2 rounded-full flex-row items-center
                ${isActive ? "bg-blue-600" : "bg-slate-200"}
              `}
            >
              <Ionicons
                name={filter.icon}
                size={14}
                color={isActive ? "#FFF" : "#0F172A"}
              />
              <Text
                className={`
                  ml-2 text-sm font-semibold
                  ${isActive ? "text-white" : "text-slate-700"}
                `}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Items list */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        {loading ? (
          <View className="mt-6 items-center">
            <Text className="text-sm text-slate-500">Loading items…</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="mt-6 items-center">
            <MaterialIcons name="inventory-2" size={40} color="#9CA3AF" />
            <Text className="mt-2 text-sm text-slate-500">No items yet</Text>
            <Text className="text-xs text-slate-400 mt-1">
              Filter: {activeFilter}, Search: "{searchQuery}"
            </Text>
          </View>
        ) : (
          <View className="mt-2 space-y-3">
            {filtered.map((it) => (
              <TouchableOpacity
                key={it.id}
                onPress={() => openDetails(it)}
                className="bg-white rounded-2xl p-4 shadow"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-2">
                    <Text className="text-sm font-semibold text-slate-900">
                      {it.title}
                    </Text>
                    <Text className="text-xs text-slate-500 mt-1">
                      {it.description}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-2">
                      {it.contactName} • {it.contactPhone}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-xs text-slate-400">{it.category}</Text>
                    <Text className="text-xs text-slate-400 mt-2">
                      {formatDate(it.createdAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Browse;
