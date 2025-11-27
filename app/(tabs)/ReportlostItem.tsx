import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import CategoryType from "@/components/CategoryType";
import { useRouter } from "expo-router";

const ReportLostItem = () => {
  const route = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      
      
      <View className="mt-4 mb-6">
        <Text className="font-bold text-4xl">Report Lost Item2</Text>
        <Text className="text-sm text-slate-600 mt-2">
          Select the category of your lost item
        </Text>
      </View>

      
      <View className="flex-row flex-wrap justify-between">
        
        
        <Pressable
  className="w-full"
  onPress={() => {
    console.log("Pressed");
    route.push("/FormLost");   // <-- correct path for app/FormLost.tsx
  }}
>
  <CategoryType iconName="mobile" title="Devices" description="Phones, tablets, laptops" />
</Pressable>

        <Pressable className='w-full' onPress={()=> route.push('/FormLost')}>
          <CategoryType iconName="wallet" title="Wallets" description="Credit cards, cash, IDs" />
        </Pressable>
        <Pressable className='w-full' onPress={()=> route.push('/FormLost')}>
          <CategoryType iconName="credit-card" title="Ids" description="Identification cards, driver's licenses" />
        </Pressable>
        

      </View>
    </SafeAreaView>
  );
};

export default ReportLostItem;
