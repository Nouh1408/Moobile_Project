// app/FormLost.tsx
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
import { useAuth } from "../_providers/AuthProvider";
import { createReport } from "@/lib/reports";

const categoryOptions = [
  { key: "devices", label: "Devices", icon: "phone-portrait-outline" as const },
  { key: "money", label: "Wallets", icon: "wallet-outline" as const },
  { key: "id", label: "IDs/Keys", icon: "card-outline" as const },
  { key: "other", label: "Other", icon: "cube-outline" as const },
];

const campusLocationPresets = [
  "Main Library",
  "Engineering Hall",
  "Student Center",
  "Food Court",
  "Sports Complex",
  "Lecture Hall A",
];

export default function FormLost() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const initialCategory = (params?.category as string) || "devices";

  const [category, setCategory] = useState<string>(initialCategory);
  const [itemName, setItemName] = useState("");
  const [locationLost, setLocationLost] = useState("");
  const [lostDate, setLostDate] = useState("");
  const [note, setNote] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValidPhone = (s: string) =>
    s.trim().length >= 7 && /^[0-9+\-\s()]+$/.test(s.trim());

  const canSubmit =
    itemName.trim().length >= 2 &&
    locationLost.trim().length >= 2 &&
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
          const uri = asset.base64
            ? `data:image/jpeg;base64,${asset.base64}`
            : asset.uri;
          setImageUri(uri);
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
          const uri = asset.base64
            ? `data:image/jpeg;base64,${asset.base64}`
            : asset.uri;
          setImageUri(uri);
        }
      }
    } catch {
      Alert.alert("Error", "Could not access image picker.");
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Incomplete", "Please fill in all required fields marked with *.");
      return;
    }

    setLoading(true);
    const result = await createReport({
      user_id: user?.id || null,
      type: "lost",
      category: category.toLowerCase(),
      title: itemName.trim(),
      description: note.trim()
        ? `${note.trim()}${lostDate ? ` • Lost: ${lostDate.trim()}` : ""}`
        : (lostDate ? `Lost: ${lostDate.trim()}` : "No additional description provided."),
      location: locationLost.trim(),
      contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(),
      image_url: imageUri || null,
      status: "open",
    });

    setLoading(false);

    if (!result.success) {
      Alert.alert(
        "Submission Failed",
        result.error || "Could not publish report to Supabase."
      );
      return;
    }

    Alert.alert(
      "Report Published",
      "Your lost item report has been saved to the campus directory.",
      [
        {
          text: "View Feed",
          onPress: () => router.replace("/(tabs)/Browse"),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* ================= FLAT TOP BAR ================= */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-9 h-9 border border-[#E4E4E7] rounded-[2px] bg-[#FAFAFA] items-center justify-center active:bg-[#E4E4E7]"
        >
          <Ionicons name="arrow-back" size={18} color="#1A1A1A" />
        </Pressable>

        <View className="items-center">
          <Text className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
            CAMPUS RECOVERY
          </Text>
          <Text className="text-sm font-bold text-[#1A1A1A]">
            Report Lost Item
          </Text>
        </View>

        <View className="w-9" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Category Chip Selector */}
          <View className="mb-5">
            <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Item Category
            </Text>
            <View className="flex-row gap-2">
              {categoryOptions.map((opt) => {
                const isSelected = category.toLowerCase() === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setCategory(opt.key)}
                    className={`flex-1 py-2 rounded-[2px] border items-center justify-center ${
                      isSelected
                        ? "bg-[#1A1A1A] border-[#1A1A1A]"
                        : "bg-white border-[#E4E4E7]"
                    }`}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={15}
                      color={isSelected ? "#FFFFFF" : "#71717A"}
                    />
                    <Text
                      className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        isSelected ? "text-white" : "text-[#4A4A4A]"
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Form Card */}
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-5 mb-5">
            {/* Title */}
            <View className="mb-4">
              <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Item Title *
              </Text>
              <View
                className={`bg-white border rounded-[2px] px-3.5 py-3 ${
                  focusedField === "title"
                    ? "border-[#0066FF] border-[2px]"
                    : "border-[#E4E4E7]"
                }`}
              >
                <TextInput
                  value={itemName}
                  onChangeText={setItemName}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. Blue Dell XPS 15 Laptop"
                  placeholderTextColor="#A1A1AA"
                  className="text-xs text-[#1A1A1A]"
                />
              </View>
            </View>

            {/* Location */}
            <View className="mb-4">
              <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Last Seen Campus Location *
              </Text>

              {/* Quick preset chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6, marginBottom: 8 }}
              >
                {campusLocationPresets.map((loc) => (
                  <Pressable
                    key={loc}
                    onPress={() => setLocationLost(loc)}
                    className={`px-2.5 py-1 rounded-[2px] border ${
                      locationLost === loc
                        ? "bg-[#0066FF] border-[#0066FF]"
                        : "bg-[#F4F5F7] border-[#E4E4E7]"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        locationLost === loc ? "text-white" : "text-[#4A4A4A]"
                      }`}
                    >
                      {loc}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View
                className={`flex-row items-center bg-white border rounded-[2px] px-3.5 py-3 ${
                  focusedField === "location"
                    ? "border-[#0066FF] border-[2px]"
                    : "border-[#E4E4E7]"
                }`}
              >
                <Ionicons name="location-outline" size={16} color="#71717A" />
                <TextInput
                  value={locationLost}
                  onChangeText={setLocationLost}
                  onFocus={() => setFocusedField("location")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. 2nd Floor Study Room, Desk 14"
                  placeholderTextColor="#A1A1AA"
                  className="flex-1 ml-2 text-xs text-[#1A1A1A]"
                />
              </View>
            </View>

            {/* Date */}
            <View className="mb-4">
              <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Date / Time Lost
              </Text>
              <View
                className={`flex-row items-center bg-white border rounded-[2px] px-3.5 py-3 ${
                  focusedField === "date"
                    ? "border-[#0066FF] border-[2px]"
                    : "border-[#E4E4E7]"
                }`}
              >
                <Ionicons name="calendar-outline" size={16} color="#71717A" />
                <TextInput
                  value={lostDate}
                  onChangeText={setLostDate}
                  onFocus={() => setFocusedField("date")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. Today around 11:30 AM"
                  placeholderTextColor="#A1A1AA"
                  className="flex-1 ml-2 text-xs text-[#1A1A1A]"
                />
              </View>
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Identifying Description
              </Text>
              <View
                className={`bg-white border rounded-[2px] p-3 ${
                  focusedField === "note"
                    ? "border-[#0066FF] border-[2px]"
                    : "border-[#E4E4E7]"
                }`}
              >
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  onFocus={() => setFocusedField("note")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Include identifying marks (stickers, scratches, brand, color)..."
                  placeholderTextColor="#A1A1AA"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="text-xs text-[#1A1A1A] min-h-[70px]"
                />
              </View>
            </View>

            {/* Photo Section */}
            <View className="mb-2">
              <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Item Photo (Optional)
              </Text>

              {imageUri ? (
                <View className="relative border border-[#E4E4E7] rounded-[2px] overflow-hidden mb-3">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-44"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => setImageUri(null)}
                    className="absolute top-2 right-2 bg-[#DC2626] px-2 py-1 rounded-[2px] flex-row items-center"
                  >
                    <Ionicons name="trash-outline" size={13} color="#FFFFFF" />
                    <Text className="text-white text-[10px] font-bold ml-1 uppercase">
                      Remove
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => pickImage("camera")}
                  className="flex-1 border border-[#1A1A1A] bg-white py-2.5 rounded-[2px] flex-row items-center justify-center active:bg-[#F4F5F7]"
                >
                  <Ionicons name="camera-outline" size={16} color="#1A1A1A" />
                  <Text className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider ml-1.5">
                    Take Photo
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => pickImage("library")}
                  className="flex-1 border border-[#E4E4E7] bg-[#FAFAFA] py-2.5 rounded-[2px] flex-row items-center justify-center active:bg-[#E4E4E7]"
                >
                  <Ionicons name="images-outline" size={16} color="#4A4A4A" />
                  <Text className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider ml-1.5">
                    Gallery
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Contact Details Card */}
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-5 mb-5">
            <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
              Reporter Contact Information
            </Text>

            <View className="mb-4">
              <Text className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">
                Full Name *
              </Text>
              <View
                className={`bg-white border rounded-[2px] px-3.5 py-3 ${
                  focusedField === "name"
                    ? "border-[#0066FF] border-[2px]"
                    : "border-[#E4E4E7]"
                }`}
              >
                <TextInput
                  value={contactName}
                  onChangeText={setContactName}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your full name"
                  placeholderTextColor="#A1A1AA"
                  className="text-xs text-[#1A1A1A]"
                />
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-1.5">
                Contact Phone / WhatsApp *
              </Text>
              <View
                className={`bg-white border rounded-[2px] px-3.5 py-3 ${
                  focusedField === "phone"
                    ? "border-[#0066FF] border-[2px]"
                    : "border-[#E4E4E7]"
                }`}
              >
                <TextInput
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. +201012345678"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="phone-pad"
                  className="text-xs text-[#1A1A1A]"
                />
              </View>
            </View>
          </View>

          {/* Submit Action */}
          <Pressable
            onPress={onSubmit}
            disabled={loading}
            className={`py-3.5 rounded-[2px] flex-row items-center justify-center ${
              canSubmit ? "bg-[#0066FF] active:bg-[#0052CC]" : "bg-[#A1A1AA]"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text className="text-white text-xs font-bold uppercase tracking-wider ml-2">
                  Publish Lost Item Report
                </Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
