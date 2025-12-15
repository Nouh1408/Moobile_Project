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
      router.replace("/");
    } else {
      Alert.alert("Login failed", "Invalid email or password");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 justify-center">
      
      <View className="mb-10">
        <Text className="text-3xl font-extrabold text-gray-900">
          Welcome back
        </Text>
        <Text className="text-gray-500 mt-2">
          Login to continue
        </Text>
      </View>

      
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-600 mb-1">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
          />
        </View>

        
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-600 mb-1">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
          />
        </View>

        {/* Login Button */}
        <Pressable
          onPress={submit}
          className="bg-blue-600 rounded-xl py-3 items-center active:opacity-80"
        >
          <Text className="text-white font-semibold text-base">
            Login
          </Text>
        </Pressable>
      </View>

      {/* Register */}
      <Pressable
        onPress={() => router.push("/(auth)/Register")}
        className="mt-6 items-center"
      >
        <Text className="text-gray-500">
          Don’t have an account?{" "}
          <Text className="text-blue-600 font-semibold">
            Register
          </Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
