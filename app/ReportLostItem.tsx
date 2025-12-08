import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import CategoryType from "@/components/CategoryType";
import { useRouter } from "expo-router";

const ReportLostItem = () => {
  const router = useRouter();

  const goToForm = () => {
    router.push("/FormLost");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2">
        <View className="mt-1 mb-3">
          <Text className="font-bold text-2xl">
            Select the category that best matches what you lost.
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          <View className="gap-1">
            <Pressable className="w-full" onPress={goToForm}>
              <CategoryType
                iconName="mobile"
                title="Devices"
                description="Phones, tablets, laptops"
              />
            </Pressable>

            <Pressable className="w-full" onPress={goToForm}>
              <CategoryType
                iconName="wallet"
                title="Wallets"
                description="Cash, cards, small pouches"
              />
            </Pressable>

            <Pressable className="w-full" onPress={goToForm}>
              <CategoryType
                iconName="credit-card"
                title="IDs"
                description="ID cards, driver's licenses, badges"
              />
            </Pressable>

            <Pressable className="w-full" onPress={goToForm}>
              <CategoryType
                iconName="add-to-list"
                title="Other"
                description="Bags, accessories, and other items"
              />
            </Pressable>
          </View>
        </ScrollView>

        <View className="mb-20 px-1 mt-4">
          <View className="flex-row items-start bg-slate-100 rounded-3xl px-4 py-4">
            <Entypo name="light-bulb" size={22} color="#2563EB" />

            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-slate-900">Tip</Text>

              <Text className="text-sm text-slate-600 mt-1 leading-[18px]">
                Choose the closest category — you’ll be able to add a full
                description and upload photos in the next step.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReportLostItem;
