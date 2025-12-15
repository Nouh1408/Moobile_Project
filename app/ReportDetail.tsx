import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
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
    const loadReport = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const list: Report[] = raw ? JSON.parse(raw) : [];
        const found = list.find((r) => r.id === id) || null;
        setReport(found);
      } catch (e) {
        Alert.alert("Error", "Could not load report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const deleteReport = async () => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const raw = await AsyncStorage.getItem(STORAGE_KEY);
              const list: Report[] = raw ? JSON.parse(raw) : [];

              const updated = list.filter((r) => r.id !== report?.id);
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updated)
              );

              router.replace("/"); 
            } catch (e) {
              Alert.alert("Error", "Failed to delete report.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Loading…</Text>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-gray-600">Report not found.</Text>
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

        
        <Pressable
          onPress={() => router.back()}
          className="absolute top-4 left-4 bg-black/50 px-3 py-2 rounded-full"
        >
          <Text className="text-white">Back</Text>
        </Pressable>

        
        <Pressable
          onPress={deleteReport}
          className="absolute top-4 right-4 bg-red-600/80 px-3 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">Delete</Text>
        </Pressable>
      </View>

      
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

          
          <View className="mt-5">
            <Text className="font-semibold text-slate-900 mb-1">
              Description
            </Text>
            <Text className="text-sm text-slate-700">
              {report.description || "No description provided."}
            </Text>
          </View>

          
          {report.location && (
            <View className="mt-4">
              <Text className="font-semibold text-slate-900 mb-1">
                Location
              </Text>
              <Text className="text-sm text-slate-700">
                {report.location}
              </Text>
            </View>
          )}

          
          <View className="mt-4">
            <Text className="font-semibold text-slate-900 mb-1">
              Contact
            </Text>
            <Text className="text-sm text-slate-700">
              {report.contactName || "-"}
            </Text>
            <Text className="text-sm text-slate-700">
              {report.contactPhone || "-"}
            </Text>
          </View>

          
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
