
import { Stack } from "expo-router";
import { AuthProvider } from "../_providers/AuthProvider";
import './globals.css';

export default function RootLayout() {
  return (
    <AuthProvider>
    <Stack initialRouteName="(auth)/Login">
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
      <Stack.Screen
    name="(auth)/Login"
    options={{
      title:"Login"
    }}
    />
      <Stack.Screen
    name="(auth)/Register"
    options={{
      title:"Register"
    }}
    />
    </Stack>
    
    </AuthProvider>
  );
}
