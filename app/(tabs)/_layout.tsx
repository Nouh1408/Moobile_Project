import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const _layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor:"#09c"
      
    }}>
      <Tabs.Screen
        name="index"
        options={{ headerShown: false , tabBarLabel: "Home", tabBarIcon:()=> <Ionicons name="home" size={24} color="black" /> }}
      />
      
       <Tabs.Screen
        name="Profile"
        options={{ headerShown: false, tabBarLabel: "Profile", tabBarIcon: () => <Ionicons name="person" size={24} color="black" /> }}
        />
    </Tabs>
  );
};

export default _layout;
