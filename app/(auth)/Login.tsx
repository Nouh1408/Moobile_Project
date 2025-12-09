// app/(auth)/Login.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../_providers/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation", "Email and password are required.");
      return;
    }
    const ok = await login(email.trim(), password);
    if (ok) {
      // replace stack so user can't go back to login
      router.replace("/");
    } else {
      Alert.alert("Login failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 px-4 py-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Welcome back</Text>

      <View className="mb-3">
        <Text className="font-semibold mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-200 rounded-md p-3"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          className="border border-gray-200 rounded-md p-3"
        />
      </View>

      <Pressable onPress={submit} className="bg-blue-600 rounded-lg p-3 items-center">
        <Text className="text-white font-semibold">Login</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(auth)/Register")}
        className="mt-3 items-center"
      >
        <Text className="text-sm text-blue-600">Don't have an account? Register</Text>
      </Pressable>
    </SafeAreaView>
  );
}
