import { Stack } from "expo-router";
import "./globals.css"

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false, headerTitle: "Home" }} />
    <Stack.Screen name="ReportFoundItem" options={{ headerShown: false, headerTitle: "Report Item" }} />
    <Stack.Screen name="ReportlostItem" options={{ headerShown: false, headerTitle: "Missing Items" }} />
    <Stack.Screen name="itemCategory" options={{ headerShown: false, headerTitle: "Category" }} />

  </Stack>;
}
