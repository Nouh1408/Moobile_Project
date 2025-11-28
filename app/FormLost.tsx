import React from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FormLost = () => {
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="mt-4 mb-6">
        <Text className="font-bold text-2xl">Report Lost Item</Text>
        <View className="mt-3">
          <Text className="font-bold">Item Description</Text>
          <TextInput placeholder="Describe your Lost item in detail"
            className="border border-gray-300 rounded-md p-1 mt-1 py-5"
          />
        </View>
        <View className="mt-3">
          <Text className="font-bold">Last Known Location</Text>
          <TextInput placeholder="Describe where you last saw your lost item"
            className="border border-gray-300 rounded-md p-2 mt-1"
          />
        </View>
        <View className="border mt-5 border-gray-300 rounded-md "/> 
        <View className="mt-3">
          <Text className="font-bold">Security Verification</Text>
          <Text>Create a security question to verify ownership when someone claims to have found your item.</Text>
        </View>
        <View className="mt-3">
          <Text className="font-bold">Security Question</Text>
          <TextInput placeholder="E.g., What is the wallpaper"
            className="border border-gray-300 rounded-md p-1 mt-1 py-5"
          />
        </View>
        <View className="mt-3">
          <Text className="font-bold">Answer</Text>
          <TextInput placeholder="your answer"
            className="border border-gray-300 rounded-md p-1 mt-1 py-5"
          />
        </View>

      </View>
    </SafeAreaView>
  );
};

export default FormLost;
