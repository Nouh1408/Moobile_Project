// app/(tabs)/ReportAction.tsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../_providers/AuthProvider";
import { createReport } from "@/lib/reports";

const categoryOptions = [
  { key: "device", label: "Devices", icon: "phone-portrait-outline" as const },
  { key: "money", label: "Wallets", icon: "wallet-outline" as const },
  { key: "id", label: "IDs/Cards", icon: "card-outline" as const },
  { key: "other", label: "Other", icon: "cube-outline" as const },
];

const campusPresets = [
  "Main Library",
  "Engineering Hall A",
  "Student Center",
  "Cafeteria / Food Court",
  "Sports Complex",
  "Campus Security Gate 2",
];

export default function ReportAction() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ mode?: "lost" | "found" }>();

  // Mode: "lost" vs "found"
  const [reportType, setReportType] = useState<"lost" | "found">(
    params.mode === "found" ? "found" : "lost"
  );

  React.useEffect(() => {
    if (params.mode === "lost" || params.mode === "found") {
      setReportType(params.mode);
    }
  }, [params.mode]);

  const [category, setCategory] = useState<string>("device");
  const [itemName, setItemName] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValidPhone = (s: string) =>
    s.trim().length >= 7 && /^[0-9+\-\s()]+$/.test(s.trim());

  const canSubmit =
    itemName.trim().length >= 2 &&
    location.trim().length >= 2 &&
    contactName.trim().length >= 2 &&
    isValidPhone(contactPhone);

  const pickImage = async (source: "camera" | "library") => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
        base64: true,
      };

      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission", "Camera permission is required.");
          return;
        }
        const result = await ImagePicker.launchCameraAsync(options);
        if (!result.canceled && result.assets?.length) {
          const asset = result.assets[0];
          setImageUri(
            asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri
          );
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission", "Photo library permission is required.");
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync(options);
        if (!result.canceled && result.assets?.length) {
          const asset = result.assets[0];
          setImageUri(
            asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri
          );
        }
      }
    } catch {
      Alert.alert("Error", "Could not process image.");
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(
        "Missing Information",
        "Please provide item title, campus location, your name, and a valid phone number."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user?.id || null,
        type: reportType,
        category,
        title: itemName.trim(),
        description: description.trim()
          ? `${description.trim()}${dateTime ? `\nDate/Time: ${dateTime}` : ""}`
          : dateTime
          ? `Date/Time: ${dateTime}`
          : "",
        location: location.trim(),
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        image_url: imageUri,
        status: "open",
      };

      const res = await createReport(payload);
      setLoading(false);

      if (res.success) {
        Alert.alert(
          "Report Submitted",
          reportType === "lost"
            ? "Your lost item has been registered in the campus directory."
            : "Thank you! The found item has been logged for recovery.",
          [
            {
              text: "View in Feed",
              onPress: () => router.replace("/(tabs)/Browse"),
            },
          ]
        );
      } else {
        Alert.alert("Error", res.error || "Failed to create report.");
      }
    } catch {
      setLoading(false);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            Create Report
          </Text>
          <Text className="text-xs text-[#71717A] mt-0.5">
            Report a lost or found item on campus
          </Text>
        </View>

        <View
          className={`px-2.5 py-1 rounded-[2px] ${
            reportType === "lost" ? "bg-[#FEE2E2]" : "bg-[#DCFCE7]"
          }`}
        >
          <Text
            className={`text-[10px] font-bold uppercase tracking-wider ${
              reportType === "lost" ? "text-[#DC2626]" : "text-[#16A34A]"
            }`}
          >
            {reportType === "lost" ? "Lost Item" : "Found Item"}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ================= 1. LOST / FOUND TOGGLE ================= */}
          <View className="bg-[#F4F5F7] p-1 border border-[#E4E4E7] rounded-[2px] flex-row mb-5">
            <Pressable
              onPress={() => setReportType("lost")}
              className={`flex-1 py-2.5 items-center justify-center rounded-[2px] ${
                reportType === "lost" ? "bg-[#DC2626]" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${
                  reportType === "lost" ? "text-white" : "text-[#71717A]"
                }`}
              >
                I Lost Something
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setReportType("found")}
              className={`flex-1 py-2.5 items-center justify-center rounded-[2px] ${
                reportType === "found" ? "bg-[#0066FF]" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${
                  reportType === "found" ? "text-white" : "text-[#71717A]"
                }`}
              >
                I Found Something
              </Text>
            </Pressable>
          </View>

          {/* ================= 2. PHOTO PICKER ================= */}
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4">
            <Text className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Item Photo
            </Text>

            {imageUri ? (
              <View className="relative">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-44 rounded-[2px] border border-[#E4E4E7]"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => setImageUri(null)}
                  className="absolute top-2 right-2 bg-black/70 px-2.5 py-1 rounded-[2px] flex-row items-center"
                >
                  <Ionicons name="trash-outline" size={14} color="#FFFFFF" />
                  <Text className="text-white text-[10px] font-bold ml-1 uppercase">
                    Remove
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => pickImage("camera")}
                  className="flex-1 py-4 border border-[#E4E4E7] bg-[#FAFAFA] rounded-[2px] items-center justify-center active:bg-[#E4E4E7]"
                >
                  <Ionicons name="camera-outline" size={22} color="#1A1A1A" />
                  <Text className="text-xs font-bold text-[#1A1A1A] mt-1.5 uppercase tracking-wider">
                    Take Photo
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => pickImage("library")}
                  className="flex-1 py-4 border border-[#E4E4E7] bg-[#FAFAFA] rounded-[2px] items-center justify-center active:bg-[#E4E4E7]"
                >
                  <Ionicons name="images-outline" size={22} color="#1A1A1A" />
                  <Text className="text-xs font-bold text-[#1A1A1A] mt-1.5 uppercase tracking-wider">
                    Upload
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* ================= 3. CATEGORY ================= */}
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4">
            <Text className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2.5">
              Category
            </Text>
            <View className="flex-row gap-2">
              {categoryOptions.map((opt) => {
                const isSelected = category === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setCategory(opt.key)}
                    className={`flex-1 py-2.5 px-2 border rounded-[2px] items-center justify-center ${
                      isSelected
                        ? "bg-[#1A1A1A] border-[#1A1A1A]"
                        : "bg-[#FAFAFA] border-[#E4E4E7] active:bg-[#F4F5F7]"
                    }`}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isSelected ? "#FFFFFF" : "#71717A"}
                    />
                    <Text
                      className={`text-[10px] font-bold mt-1 uppercase ${
                        isSelected ? "text-white" : "text-[#71717A]"
                      }`}
                      numberOfLines={1}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ================= 4. ITEM DETAILS ================= */}
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-4">
            <Text className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
              Item Details
            </Text>

            {/* Title */}
            <View className="mb-3">
              <Text className="text-[11px] font-bold text-[#4A4A4A] uppercase mb-1">
                Item Title *
              </Text>
              <TextInput
                value={itemName}
                onChangeText={setItemName}
                placeholder="e.g. Silver iPad Air, Blue Wallet, Student Card"
                placeholderTextColor="#A1A1AA"
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className={`border bg-[#FAFAFA] px-3.5 py-2.5 rounded-[2px] text-xs text-[#1A1A1A] ${
                  focusedField === "name"
                    ? "border-[#0066FF]"
                    : "border-[#E4E4E7]"
                }`}
              />
            </View>

            {/* Location */}
            <View className="mb-3">
              <Text className="text-[11px] font-bold text-[#4A4A4A] uppercase mb-1">
                {reportType === "lost" ? "Location Lost *" : "Location Found *"}
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. Main Library Floor 2, Lecture Hall 3"
                placeholderTextColor="#A1A1AA"
                onFocus={() => setFocusedField("loc")}
                onBlur={() => setFocusedField(null)}
                className={`border bg-[#FAFAFA] px-3.5 py-2.5 rounded-[2px] text-xs text-[#1A1A1A] ${
                  focusedField === "loc"
                    ? "border-[#0066FF]"
                    : "border-[#E4E4E7]"
                }`}
              />

              {/* Campus presets */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-2"
              >
                <View className="flex-row gap-1.5">
                  {campusPresets.map((preset) => (
                    <Pressable
                      key={preset}
                      onPress={() => setLocation(preset)}
                      className="bg-[#F4F5F7] border border-[#E4E4E7] px-2.5 py-1 rounded-[2px]"
                    >
                      <Text className="text-[10px] font-semibold text-[#4A4A4A]">
                        {preset}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Date / Time */}
            <View className="mb-3">
              <Text className="text-[11px] font-bold text-[#4A4A4A] uppercase mb-1">
                Date & Approximate Time
              </Text>
              <TextInput
                value={dateTime}
                onChangeText={setDateTime}
                placeholder="e.g. Today around 11:30 AM"
                placeholderTextColor="#A1A1AA"
                className="border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5 rounded-[2px] text-xs text-[#1A1A1A]"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-[11px] font-bold text-[#4A4A4A] uppercase mb-1">
                Description / Identifying Marks
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Distinctive scratches, stickers, case color, or contents..."
                placeholderTextColor="#A1A1AA"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5 rounded-[2px] text-xs text-[#1A1A1A] min-h-[70px]"
              />
            </View>
          </View>

          {/* ================= 5. CONTACT INFO ================= */}
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-4 mb-5">
            <Text className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
              Contact Information
            </Text>

            <View className="mb-3">
              <Text className="text-[11px] font-bold text-[#4A4A4A] uppercase mb-1">
                Your Name *
              </Text>
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                placeholder="e.g. Ahmed Mostafa"
                placeholderTextColor="#A1A1AA"
                className="border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5 rounded-[2px] text-xs text-[#1A1A1A]"
              />
            </View>

            <View>
              <Text className="text-[11px] font-bold text-[#4A4A4A] uppercase mb-1">
                Phone Number *
              </Text>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="e.g. 01012345678"
                placeholderTextColor="#A1A1AA"
                keyboardType="phone-pad"
                className="border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5 rounded-[2px] text-xs text-[#1A1A1A]"
              />
            </View>
          </View>

          {/* ================= SUBMIT BUTTON ================= */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            className={`py-3.5 rounded-[2px] items-center justify-center ${
              loading
                ? "bg-[#71717A]"
                : reportType === "lost"
                ? "bg-[#DC2626] active:bg-[#B91C1C]"
                : "bg-[#0066FF] active:bg-[#0052CC]"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                {reportType === "lost" ? "Submit Lost Report" : "Submit Found Report"}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
