import React from "react";
import { View, Text } from "react-native";

interface ReportFTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

const ReportFTitle: React.FC<ReportFTitleProps> = ({
  badge = "CAMPUS REPORT",
  title,
  subtitle,
}) => {
  return (
    <View className="mb-4">
      <View className="bg-[#0066FF] px-2 py-0.5 rounded-[2px] self-start mb-1.5">
        <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
          {badge}
        </Text>
      </View>
      <Text className="text-xl font-bold text-[#1A1A1A] tracking-tight">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-xs text-[#71717A] mt-1 leading-4">
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default ReportFTitle;