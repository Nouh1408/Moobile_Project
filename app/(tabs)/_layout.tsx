import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#0CA5A0",     // soft teal
        tabBarInactiveTintColor: "#94A3B8",   // cool gray
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderTopWidth: 0,
          elevation: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Browse"
        options={{
          tabBarLabel: "Browse",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
