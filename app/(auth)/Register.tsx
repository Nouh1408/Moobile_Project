// app/(auth)/Register.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../_providers/AuthProvider";

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation", "Email and password are required.");
      return;
    }
    const ok = await register(email.trim(), password);
    if (ok) {
      router.replace("/");
    } else {
      Alert.alert("Registration failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 px-4 py-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Create account</Text>

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
          placeholder="Choose a password"
          secureTextEntry
          className="border border-gray-200 rounded-md p-3"
        />
      </View>

      <Pressable onPress={submit} className="bg-green-600 rounded-lg p-3 items-center">
        <Text className="text-white font-semibold">Register</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(auth)/Login")}
        className="mt-3 items-center"
      >
        <Text className="text-sm text-blue-600">Already have an account? Login</Text>
      </Pressable>
    </SafeAreaView>
  );
}
