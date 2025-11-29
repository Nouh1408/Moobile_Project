import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ headerShown: false , tabBarLabel: "Home", tabBarIcon:()=> <Ionicons name="home" size={24} color="black" /> }}
      />
      <Tabs.Screen
        name="ReportLostItem"
        options={{ headerShown: false, tabBarLabel  : "Report Items" }}
      />
      <Tabs.Screen
        name="ReportFoundItem"
        options={{ headerShown: false, tabBarLabel: "Found Items" }}
      />
    </Tabs>
  );
};

export default _layout;
