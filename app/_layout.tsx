import { Stack } from "expo-router";
import { AuthProvider } from "../_providers/AuthProvider";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        initialRouteName="(auth)/Login"
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
    </AuthProvider>
  );
}
