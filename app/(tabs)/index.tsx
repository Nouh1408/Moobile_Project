import HIW from "@/components/HIW";
import { image } from "@/constants/images";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../_providers/AuthProvider";

export default function Index() {
  const router = useRouter();
  const { logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      
      <View className="px-4 pt-4 pb-3 flex-row justify-between items-center border-b border-gray-200">
        <View>
          <Text className="text-sm text-gray-500">
            Welcome back
          </Text>
          <Text className="text-2xl font-bold text-gray-900">
            Home
          </Text>
        </View>

        <Pressable
          onPress={confirmLogout}
          className="p-2 rounded-full bg-gray-100"
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#374151"
          />
        </Pressable>
      </View>

      
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
      >
        
        <View className="w-full items-center mb-10">
          <Image
            source={image.hero}
            className="w-full h-56"
            resizeMode="contain"
          />
        </View>

        
        <View className="flex-row gap-4 mb-12">
          <Pressable
            onPress={() => router.push("/ReportLostItem")}
            className="flex-1 bg-orange-600 py-4 rounded-2xl flex-row justify-center items-center active:opacity-80"
          >
            <SimpleLineIcons
              name="magnifier"
              size={22}
              color="white"
            />
            <Text className="text-white font-semibold ml-2">
              Report Lost
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/ReportFoundItem")}
            className="flex-1 bg-green-600 py-4 rounded-2xl flex-row justify-center items-center active:opacity-80"
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="white"
            />
            <Text className="text-white font-semibold ml-2">
              Report Found
            </Text>
          </Pressable>
        </View>

        
        <View className="mb-10">
          <Text className="text-2xl font-bold text-center text-gray-900 mb-6">
            How It Works
          </Text>

          <HIW
            title="1. Report Your Item"
            description="Lost something? Create a detailed report describing your lost item."
            bg="#f9ede3"
          />

          <HIW
            title="2. Help Others"
            description="Found something? Report it to help the owner find it."
            bg="#e2f1e8"
          />

          <HIW
            title="3. Verify & Recover"
            description="Answer security questions to prove ownership and recover your item."
            bg="#e6eefa"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
 