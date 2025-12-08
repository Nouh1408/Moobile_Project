import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const filters = [
  { key: "all", label: "All", icon: "grid-outline" as const },
  { key: "device", label: "Devices", icon: "phone-portrait-outline" as const },
  { key: "money", label: "Money", icon: "cash-outline" as const },
  { key: "id", label: "IDs", icon: "card-outline" as const },
  { key: "other", label: "Other", icon: "apps-outline" as const },
] as const;

type FilterKey = (typeof filters)[number]["key"];

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
          onChangeText={handleSearch}
        />
      </View>

      
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

      
      <ScrollView className="flex-1">
        <View className="mt-2 items-center justify-center">
          <MaterialIcons name="inventory-2" size={40} color="#9CA3AF" />
          <Text className="mt-2 text-sm text-slate-500">
            Items list will go here…
          </Text>
          <Text className="text-xs text-slate-400 mt-1">
            Filter: {activeFilter}, Search: "{searchQuery}"
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Browse;
