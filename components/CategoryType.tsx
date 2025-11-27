import { View, Text, Pressable } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

interface CategoryTypeProps {
  iconName: React.ComponentProps<typeof Entypo>["name"]; 
  title: string;
  description: string;
}

const CategoryType = ({ iconName, title, description }: CategoryTypeProps) => {
  return (
    <View className="w-full bg-slate-100 rounded-xl p-4 mb-4 items-center">
      <Entypo name={iconName} size={40} color="#1f2937" />
      <Text className="font-semibold mt-2">{title}</Text>
      <Text className="text-sm text-slate-600 text-center mt-1">
        {description}
      </Text>
    </View>
  );
};

export default CategoryType;
