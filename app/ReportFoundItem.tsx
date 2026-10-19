// app/ReportFoundItem.tsx
import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CategoryType from "@/components/CategoryType";

const categories = [
  {
    key: "devices",
    title: "Electronics & Devices",
    description: "Phones, tablets, laptops, headphones, USB drives",
    icon: "phone-portrait-outline" as const,
  },
  {
    key: "money",
    title: "Wallets & Cards",
    description: "Wallets, credit/debit cards, cash, coin purses",
    icon: "wallet-outline" as const,
  },
  {
    key: "id",
    title: "Student IDs & Keys",
    description: "University badges, room keys, car keys, lanyards",
    icon: "card-outline" as const,
  },
  {
    key: "other",
    title: "Bags, Clothes & Other",
    description: "Jackets, water bottles, textbooks, sunglasses",
    icon: "cube-outline" as const,
  },
];

export default function ReportFoundItem() {
  const router = useRouter();

  const handleSelectCategory = (catKey: string) => {
    router.push({
      pathname: "/FormFound",
      params: { category: catKey },
    });
  };

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

        <View className="items-center">
          <Text className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider">
            FOUND ITEM • STEP 1 OF 2
          </Text>
          <Text className="text-sm font-bold text-[#1A1A1A]">
            Select Category
          </Text>
        </View>

        <View className="w-9" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5">
          <Text className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            What did you find?
          </Text>
          <Text className="text-xs text-[#71717A] mt-1 leading-5">
            Thank you for helping our university community! Choose the item
            category to start the recovery form.
          </Text>
        </View>

        {/* Categories List */}
        <View className="mb-6">
          {categories.map((cat) => (
            <CategoryType
              key={cat.key}
              iconName={cat.icon}
              title={cat.title}
              description={cat.description}
              onPress={() => handleSelectCategory(cat.key)}
            />
          ))}
        </View>

        {/* Handover Notice Flat Box */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 flex-row items-start">
          <View className="w-7 h-7 bg-[#F0FDF4] border border-[#86EFAC] rounded-[2px] items-center justify-center mr-3 mt-0.5">
            <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              Safe Campus Handover
            </Text>
            <Text className="text-xs text-[#4A4A4A] mt-1 leading-5">
              Found high-value items (wallets, laptops, phones) can also be
              deposited directly at the Main Library Reception or Central
              Campus Security (Gate 2).
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}