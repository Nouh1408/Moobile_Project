import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HIWProps {
  step: string;
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const HIW: React.FC<HIWProps> = ({
  step,
  title,
  description,
  iconName = "checkmark-circle-outline",
}) => {
  return (
    <View className="mb-3 p-4 bg-white border border-[#E4E4E7] rounded-[2px] flex-row items-start">
      <View className="w-8 h-8 bg-[#1A1A1A] rounded-[2px] items-center justify-center mr-3 mt-0.5">
        <Text className="text-white text-xs font-bold">{step}</Text>
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-[#1A1A1A]">{title}</Text>
          <Ionicons name={iconName} size={16} color="#0066FF" />
        </View>
        <Text className="mt-1 text-xs text-[#4A4A4A] leading-5">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default HIW;