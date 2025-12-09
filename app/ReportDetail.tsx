import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const STORAGE_KEY = "@lost_reports_v1";

type Report = {
  id: string;
  category?: string | null;
  title: string;
  description?: string;
  location?: string;
  contactName?: string;
  contactPhone?: string;
  imageUri?: string | null;
  createdAt?: string;
};

export default function ReportDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = (params?.id as string) || "";

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const list: Report[] = raw ? JSON.parse(raw) : [];
        const found = list.find((r) => r.id === id) || null;
        setReport(found);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Could not load report.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading…</Text>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-4">
        <Text className="text-center text-gray-600">Report not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 bg-blue-600 px-4 py-2 rounded-lg">
          <Text className="text-white">Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {report.imageUri ? (
          <Image source={{ uri: report.imageUri }} className="w-full h-56 rounded-2xl mb-4" />
        ) : (
          <View className="w-full h-56 rounded-2xl mb-4 bg-slate-100 items-center justify-center">
            <Text className="text-slate-400">No image</Text>
          </View>
        )}

        <Text className="text-2xl font-semibold text-slate-900">{report.title}</Text>
        {report.category ? <Text className="text-sm text-slate-500 mt-1">{report.category}</Text> : null}

        <View className="mt-4">
          <Text className="font-semibold mb-2">Description</Text>
          <Text className="text-sm text-slate-700">{report.description || "No description provided."}</Text>
        </View>

        {report.location ? (
          <View className="mt-4">
            <Text className="font-semibold mb-2">Location</Text>
            <Text className="text-sm text-slate-700">{report.location}</Text>
          </View>
        ) : null}

        <View className="mt-4">
          <Text className="font-semibold mb-2">Contact</Text>
          <Text className="text-sm text-slate-700">{report.contactName || "-"}</Text>
          <Text className="text-sm text-slate-700">{report.contactPhone || "-"}</Text>
        </View>

        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={() => router.push({ pathname: "/Chat", params: { id: report.id } } as any)}
            className="flex-1 bg-blue-600 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Chat</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              // simple "call" behavior — you can hook Linking.openURL('tel:...') if desired
              Alert.alert("Contact", `Call or message: ${report.contactPhone || "N/A"}`);
            }}
            className="flex-1 bg-green-600 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Contact Owner</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} className="mt-4 items-center">
          <Text className="text-sm text-slate-600">Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
