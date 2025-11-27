import { Stack } from "expo-router";
import "./globals.css"

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false, headerTitle: "Home" }} />
    <Stack.Screen name="ReportFoundItem" options={{ headerShown: false, headerTitle: "Report Item" }} />
    <Stack.Screen name="ReportLostItem" options={{ headerShown: false, headerTitle: "Missing Items" }} />   
    {/* <Stack.Screen name="FormLost" options={{ headerShown: false, headerTitle: "Lost Item Form" }} /> */}

  </Stack>;
}
