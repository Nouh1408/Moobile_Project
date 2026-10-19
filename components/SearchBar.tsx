import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search campus items, location, or name...",
  onClear,
}) => {
  return (
    <View className="flex-row items-center bg-[#FAFAFA] border border-[#E4E4E7] rounded-[2px] px-3 py-2.5">
      <Ionicons name="search-outline" size={17} color="#71717A" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A1A1AA"
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 px-2.5 text-xs text-[#1A1A1A]"
      />
      {value.length > 0 && onClear && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={17} color="#71717A" />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;
