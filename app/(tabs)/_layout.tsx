// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Layout() {
  const router = useRouter();
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const openReportSelection = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Report Lost Item", "Report Found Item"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) router.push("/ReportLostItem");
          if (buttonIndex === 2) router.push("/ReportFoundItem");
        }
      );
    } else {
      setReportModalVisible(true);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#0066FF",
          tabBarInactiveTintColor: "#71717A",
          tabBarStyle: {
            height: 62,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E4E4E7",
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          },
        }}
      >
        {/* TAB 1: HOME */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={typeof color === "string" ? color : "#71717A"}
              />
            ),
          }}
        />

        {/* TAB 2: BROWSE (Feed) */}
        <Tabs.Screen
          name="Browse"
          options={{
            tabBarLabel: "Browse",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={22}
                color={typeof color === "string" ? color : "#71717A"}
              />
            ),
          }}
        />

        {/* TAB 3: CENTER REPORT ACTION BUTTON */}
        <Tabs.Screen
          name="ReportAction"
          options={{
            tabBarLabel: "Report",
            tabBarButton: () => (
              <Pressable
                onPress={openReportSelection}
                className="items-center justify-center -top-2 flex-1"
                hitSlop={10}
              >
                <View className="w-12 h-12 bg-[#1A1A1A] border border-[#2D2D2D] rounded-[2px] items-center justify-center shadow-none active:bg-[#0066FF]">
                  <Ionicons name="add" size={26} color="#FFFFFF" />
                </View>
                <Text className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider mt-0.5">
                  Report
                </Text>
              </Pressable>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openReportSelection();
            },
          }}
        />

        {/* TAB 4: MATCHES */}
        <Tabs.Screen
          name="Matches"
          options={{
            tabBarLabel: "Matches",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "git-compare" : "git-compare-outline"}
                size={22}
                color={typeof color === "string" ? color : "#71717A"}
              />
            ),
          }}
        />

        {/* TAB 5: PROFILE */}
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={typeof color === "string" ? color : "#71717A"}
              />
            ),
          }}
        />
      </Tabs>

      {/* MODAL PICKER FOR ANDROID / BACKUP: REPORT LOST VS FOUND */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 items-center justify-center px-6"
          onPress={() => setReportModalVisible(false)}
        >
          <Pressable
            className="w-full bg-white border border-[#E4E4E7] rounded-[2px] p-5"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between mb-4 border-b border-[#E4E4E7] pb-3">
              <View>
                <Text className="text-base font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Create Report
                </Text>
                <Text className="text-xs text-[#71717A] mt-0.5">
                  Select report type to continue
                </Text>
              </View>
              <Pressable
                onPress={() => setReportModalVisible(false)}
                className="w-8 h-8 rounded-[2px] border border-[#E4E4E7] bg-[#FAFAFA] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#1A1A1A" />
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setReportModalVisible(false);
                router.push("/ReportLostItem");
              }}
              className="bg-[#1A1A1A] border border-[#1A1A1A] rounded-[2px] p-4 flex-row items-center mb-3 active:opacity-90"
            >
              <View className="w-10 h-10 bg-[#DC2626] rounded-[2px] items-center justify-center mr-3.5">
                <Ionicons name="search" size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-white uppercase tracking-wider">
                  I Lost Something
                </Text>
                <Text className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Report missing phone, wallet, student ID, or keys
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                setReportModalVisible(false);
                router.push("/ReportFoundItem");
              }}
              className="bg-[#0066FF] border border-[#0066FF] rounded-[2px] p-4 flex-row items-center active:opacity-90"
            >
              <View className="w-10 h-10 bg-white rounded-[2px] items-center justify-center mr-3.5">
                <Ionicons name="cube-outline" size={20} color="#0066FF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-white uppercase tracking-wider">
                  I Found Something
                </Text>
                <Text className="text-[11px] text-[#E0E7FF] mt-0.5">
                  Help return an item to a fellow campus member
                </Text>
              </View>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
