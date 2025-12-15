// app/(auth)/Register.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../_providers/AuthProvider";

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isEgyptianPhone = (value: string) =>
    /^\+20\d{10}$/.test(value);

  const submit = async () => {
    const id = identifier.trim();

    if (!id || !password.trim()) {
      Alert.alert("Validation", "All fields are required.");
      return;
    }

    if (!isEmail(id) && !isEgyptianPhone(id)) {
      Alert.alert(
        "Invalid input",
        "Enter a valid email or Egyptian phone number (+20)"
      );
      return;
    }

    const ok = await register(id, password);

    if (ok) {
      router.replace("/");
    } else {
      Alert.alert("Registration failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 justify-center">
      
      <View className="mb-10">
        <Text className="text-3xl font-extrabold text-gray-900">
          Create account
        </Text>
        <Text className="text-gray-500 mt-2">
          Use email or Egyptian phone number
        </Text>
      </View>

      
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-600 mb-1">
            Email or Phone (+20)
          </Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="email@example.com or +20"
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
            placeholder="Choose a strong password"
            secureTextEntry
            className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
          />
        </View>

        
        <Pressable
          onPress={submit}
          className="bg-green-600 rounded-xl py-3 items-center active:opacity-80"
        >
          <Text className="text-white font-semibold text-base">
            Register
          </Text>
        </Pressable>
      </View>

      
      <Pressable
        onPress={() => router.push("/(auth)/Login")}
        className="mt-6 items-center"
      >
        <Text className="text-gray-500">
          Already have an account?{" "}
          <Text className="text-blue-600 font-semibold">
            Login
          </Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
