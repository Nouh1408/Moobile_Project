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
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const list: Report[] = raw ? JSON.parse(raw) : [];
        setReport(list.find((r) => r.id === id) || null);
      } catch (e) {
        Alert.alert("Error", "Could not load report.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-4 bg-white">
        <Text className="text-center text-gray-600">Report not found.</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      {/* ================= HERO IMAGE ================= */}
      <View className="w-full h-72 bg-slate-200">
        {report.imageUri ? (
          <Image
            source={{ uri: report.imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-400">No image available</Text>
          </View>
        )}

        {/* Back button overlay */}
        <Pressable
          onPress={() => router.back()}
          className="absolute top-4 left-4 bg-black/50 px-3 py-2 rounded-full"
        >
          <Text className="text-white">Back</Text>
        </Pressable>
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        className="flex-1 -mt-6"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="bg-white rounded-t-3xl px-4 pt-6 pb-8">
          <Text className="text-2xl font-bold text-slate-900">
            {report.title}
          </Text>

          {report.category && (
            <Text className="text-sm text-slate-500 mt-1">
              {report.category}
            </Text>
          )}

          {/* Description */}
          <View className="mt-5">
            <Text className="font-semibold mb-1 text-slate-900">
              Description
            </Text>
            <Text className="text-sm text-slate-700">
              {report.description || "No description provided."}
            </Text>
          </View>

          {/* Location */}
          {report.location && (
            <View className="mt-4">
              <Text className="font-semibold mb-1 text-slate-900">
                Location
              </Text>
              <Text className="text-sm text-slate-700">
                {report.location}
              </Text>
            </View>
          )}

          {/* Contact */}
          <View className="mt-4">
            <Text className="font-semibold mb-1 text-slate-900">
              Contact
            </Text>
            <Text className="text-sm text-slate-700">
              {report.contactName || "-"}
            </Text>
            <Text className="text-sm text-slate-700">
              {report.contactPhone || "-"}
            </Text>
          </View>

          {/* Actions */}
          <View className="mt-8 flex-row gap-3">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/Chat",
                  params: { id: report.id },
                } as any)
              }
              className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">
                Chat
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Alert.alert(
                  "Contact",
                  `Call or message: ${report.contactPhone || "N/A"}`
                )
              }
              className="flex-1 bg-green-600 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">
                Contact Owner
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
