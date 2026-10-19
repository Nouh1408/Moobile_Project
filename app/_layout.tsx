import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../_providers/AuthProvider";
import "./globals.css";

function RootNavigation() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // User is not signed in and trying to access main app -> redirect to Login
      router.replace("/(auth)/Login");
    } else if (session && inAuthGroup) {
      // User is signed in and on Login or Register -> redirect to Home tabs
      router.replace("/(tabs)");
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="small" color="#0066FF" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ReportLostItem" options={{ headerShown: false }} />
      <Stack.Screen name="ReportFoundItem" options={{ headerShown: false }} />
      <Stack.Screen name="ReportDetail" options={{ headerShown: false }} />
      <Stack.Screen name="FormLost" options={{ headerShown: false }} />
      <Stack.Screen name="FormFound" options={{ headerShown: false }} />
      <Stack.Screen name="Chat" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/Register" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
