import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CategoryTypeProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  selected?: boolean;
  onPress?: () => void;
}

const CategoryType: React.FC<CategoryTypeProps> = ({
  iconName,
  title,
  description,
  selected = false,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`w-full p-4 mb-3 border rounded-[2px] flex-row items-center justify-between active:bg-[#F4F5F7] ${
        selected
          ? "bg-[#EFF6FF] border-[#0066FF]"
          : "bg-white border-[#E4E4E7]"
      }`}
    >
      <View className="flex-row items-center flex-1 mr-3">
        <View
          className={`w-11 h-11 rounded-[2px] items-center justify-center mr-3.5 border ${
            selected
              ? "bg-[#0066FF] border-[#0066FF]"
              : "bg-[#F4F5F7] border-[#E4E4E7]"
          }`}
        >
          <Ionicons
            name={iconName}
            size={22}
            color={selected ? "#FFFFFF" : "#1A1A1A"}
          />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-bold text-[#1A1A1A]">{title}</Text>
          <Text className="text-xs text-[#71717A] mt-0.5 leading-4">
            {description}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={selected ? "#0066FF" : "#A1A1AA"}
      />
    </Pressable>
  );
};

export default CategoryType;
