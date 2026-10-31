// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export default function Layout() {
  return (
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

      {/* TAB 3: CENTER REPORT ACTION TAB */}
      <Tabs.Screen
        name="ReportAction"
        options={{
          tabBarLabel: "Report",
          tabBarIcon: ({ focused }) => (
            <View
              className={`w-11 h-11 border rounded-[2px] items-center justify-center -top-1.5 ${
                focused
                  ? "bg-[#0066FF] border-[#0066FF]"
                  : "bg-[#1A1A1A] border-[#2D2D2D]"
              }`}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </View>
          ),
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
  );
}
