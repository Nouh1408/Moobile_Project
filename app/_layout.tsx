
import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
  name="ReportLostItem"
  options={{
    title: "Report Lost Item", // <-- change text here
    headerShown: true,
    
  }}
/>
<Stack.Screen
  name="ReportFoundItem"
  options={{
    title: "Report Found Item", // <-- change text here
    headerShown: true,
    
  }}
/>

      <Stack.Screen
        name="FormLost"
        options={{
          title: "Report Lost Item",
          
        }}
      />

      <Stack.Screen
        name="FormFound"
        options={{
          title: "Report Found Item",
        }}
      />
    </Stack>
  );
}
