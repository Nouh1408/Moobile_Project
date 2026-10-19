// app/(tabs)/index.tsx
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../_providers/AuthProvider";
import { image } from "@/constants/images";
import HIW from "@/components/HIW";

const STORAGE_KEY = "@lost_reports_v1";

type Report = {
  id: string;
  category?: string | null;
  title: string;
  description: string;
  location?: string;
  contactName: string;
  contactPhone: string;
  imageUri?: string | null;
  createdAt: string;
};

export default function Index() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [recentItems, setRecentItems] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecentItems = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: Report[] = raw ? JSON.parse(raw) : [];
      // Take up to 3 most recent items
      setRecentItems(list.slice(0, 3));
    } catch {
      setRecentItems([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentItems();
    }, [loadRecentItems])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentItems();
    setRefreshing(false);
  };

  const confirmLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: logout },
      ]
    );
  };

  // Derive display name from email or user identity
  const userIdentifier = user?.email
    ? user.email.split("@")[0].replace(/\d+/g, "")
    : user?.phone || "Campus Member";

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      <StatusBar style="dark" />

      {/* ================= FLAT TOP BAR ================= */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-0.5">
            <View className="w-2 h-2 bg-[#16A34A] rounded-full mr-1.5" />
            <Text className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
              CAMPUS RECOVERY NETWORK
            </Text>
          </View>
          <Text className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            Hello, {userIdentifier}
          </Text>
        </View>

        <Pressable
          onPress={confirmLogout}
          hitSlop={8}
          className="w-9 h-9 border border-[#E4E4E7] rounded-[2px] bg-[#FAFAFA] items-center justify-center active:bg-[#E4E4E7]"
        >
          <Ionicons name="log-out-outline" size={18} color="#1A1A1A" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0066FF"
          />
        }
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
      >
        {/* ================= SEARCH QUICK-LINK ================= */}
        <Pressable
          onPress={() => router.push("/(tabs)/Browse")}
          className="bg-white border border-[#E4E4E7] rounded-[2px] px-3.5 py-3 flex-row items-center justify-between mb-5 active:bg-[#F4F5F7]"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <Ionicons name="search-outline" size={18} color="#71717A" />
            <Text className="text-xs text-[#71717A] ml-2.5" numberOfLines={1}>
              Search lost devices, wallets, IDs, or keys...
            </Text>
          </View>
          <View className="bg-[#1A1A1A] px-2.5 py-1 rounded-[2px]">
            <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
              Browse
            </Text>
          </View>
        </Pressable>

        {/* ================= HERO FLAT BANNER ================= */}
        <View className="border border-[#E4E4E7] bg-white rounded-[2px] overflow-hidden mb-5">
          <View className="h-32 w-full bg-[#1A1A1A] relative justify-end p-4">
            <Image
              source={image.hero}
              className="absolute inset-0 w-full h-full opacity-40"
              resizeMode="cover"
            />
            <View className="bg-[#0066FF] px-2 py-0.5 rounded-[2px] self-start mb-1">
              <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                Official Directory
              </Text>
            </View>
            <Text className="text-base font-bold text-white tracking-tight">
              Report & Recover in Minutes
            </Text>
          </View>
          <View className="p-3.5 bg-white">
            <Text className="text-xs text-[#4A4A4A] leading-5">
              Lost something during lectures or found an item on campus?
              Connect directly with verified students and campus staff.
            </Text>
          </View>
        </View>

        {/* ================= PRIMARY ACTION CARDS ================= */}
        <View className="flex-row gap-3 mb-5">
          {/* Report Lost Card */}
          <Pressable
            onPress={() => router.push("/ReportLostItem")}
            className="flex-1 bg-[#1A1A1A] border border-[#1A1A1A] rounded-[2px] p-4 justify-between active:opacity-90"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="w-8 h-8 bg-[#DC2626] rounded-[2px] items-center justify-center">
                <Ionicons name="search" size={16} color="#FFFFFF" />
              </View>
              <View className="bg-[#2D2D2D] px-1.5 py-0.5 rounded-[2px]">
                <Text className="text-[9px] font-bold text-[#FCA5A5] uppercase tracking-wider">
                  LOST
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-sm font-bold text-white mb-1">
                I Lost Something
              </Text>
              <Text className="text-[11px] text-[#A1A1AA] leading-4">
                Post details, photo & last seen campus spot
              </Text>
            </View>
          </Pressable>

          {/* Report Found Card */}
          <Pressable
            onPress={() => router.push("/ReportFoundItem")}
            className="flex-1 bg-[#0066FF] border border-[#0066FF] rounded-[2px] p-4 justify-between active:opacity-90"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="w-8 h-8 bg-white rounded-[2px] items-center justify-center">
                <Ionicons name="cube-outline" size={16} color="#0066FF" />
              </View>
              <View className="bg-[#0052CC] px-1.5 py-0.5 rounded-[2px]">
                <Text className="text-[9px] font-bold text-white uppercase tracking-wider">
                  FOUND
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-sm font-bold text-white mb-1">
                I Found Something
              </Text>
              <Text className="text-[11px] text-[#E0E7FF] leading-4">
                Help return an item to its verified owner
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ================= DESIGNATED SAFE HANDOVER NOTICE ================= */}
        <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-3.5 flex-row items-center mb-6">
          <View className="w-7 h-7 bg-[#F4F5F7] rounded-[2px] items-center justify-center mr-3 border border-[#E4E4E7]">
            <Ionicons name="shield-checkmark" size={15} color="#0066FF" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-[#1A1A1A]">
              Official Handover Locations
            </Text>
            <Text className="text-[11px] text-[#71717A] mt-0.5">
              Main Library Reception Desk • Campus Security (Gate 2)
            </Text>
          </View>
        </View>

        {/* ================= RECENT CAMPUS REPORTS ================= */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
              Recent Reports
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/Browse")}
              hitSlop={8}
            >
              <Text className="text-xs font-bold text-[#0066FF]">
                View All ({recentItems.length})
              </Text>
            </Pressable>
          </View>

          {recentItems.length === 0 ? (
            <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-5 items-center justify-center">
              <Ionicons name="file-tray-outline" size={28} color="#A1A1AA" />
              <Text className="text-xs font-bold text-[#1A1A1A] mt-2">
                No active reports yet
              </Text>
              <Text className="text-[11px] text-[#71717A] text-center mt-1">
                Be the first to report a lost or found item.
              </Text>
              <Pressable
                onPress={() => router.push("/ReportLostItem")}
                className="mt-3 bg-[#1A1A1A] px-3.5 py-2 rounded-[2px]"
              >
                <Text className="text-white text-xs font-bold uppercase tracking-wider">
                  Create First Report
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-2.5">
              {recentItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    router.push({
                      pathname: "/ReportDetail",
                      params: { id: item.id },
                    } as any)
                  }
                  className="bg-white border border-[#E4E4E7] rounded-[2px] p-3 flex-row items-center active:bg-[#F4F5F7]"
                >
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      className="w-12 h-12 rounded-[2px] mr-3 border border-[#E4E4E7]"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-[2px] mr-3 bg-[#F4F5F7] border border-[#E4E4E7] items-center justify-center">
                      <Ionicons name="cube-outline" size={18} color="#71717A" />
                    </View>
                  )}

                  <View className="flex-1 mr-2">
                    <Text
                      className="text-xs font-bold text-[#1A1A1A]"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className="text-[11px] text-[#71717A] mt-0.5"
                      numberOfLines={1}
                    >
                      {item.location || "Campus Grounds"}
                    </Text>
                  </View>

                  <View className="bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-1 rounded-[2px]">
                    <Text className="text-[10px] font-bold text-[#0066FF] uppercase">
                      {item.category || "Item"}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ================= HOW IT WORKS SECTION ================= */}
        <View className="mt-2">
          <View className="mb-3">
            <Text className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
              How It Works
            </Text>
            <Text className="text-xs text-[#71717A] mt-0.5">
              Three simple steps to safe recovery on campus.
            </Text>
          </View>

          <HIW
            step="1"
            title="Report in 60 Seconds"
            description="Take a photo, choose category, and indicate the campus building or lecture hall."
            iconName="camera-outline"
          />

          <HIW
            step="2"
            title="Instant Campus Matching"
            description="Browse verified reports and get notified when matching items are submitted."
            iconName="git-compare-outline"
          />

          <HIW
            step="3"
            title="Safe Desk Handover"
            description="Verify unique ownership details and meet safely at designated security or library desks."
            iconName="shield-checkmark-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}