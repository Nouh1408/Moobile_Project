import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import ReportFTitle from "@/components/ReportFTitle";

const FormFound = () => {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const isValidPhone = (s: string) =>
    s.trim().length >= 7 && /^[0-9+\-\s()]+$/.test(s.trim());

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!contactName.trim()) return Alert.alert("Validation", "Please enter your name");
    if (!isValidPhone(contactPhone))
      return Alert.alert("Validation", "Please enter a valid phone number");
    if (!imageUri)
      return Alert.alert("Validation", "Please add a picture of the item");

    Alert.alert(
      "Submitted",
      `Name: ${contactName}\nPhone: ${contactPhone}`
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <SafeAreaView className="flex-1">
        <ReportFTitle text="Report — I found a device" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="bg-white rounded-xl p-4 shadow-md">
            {/* Name */}
            <View className="mb-4">
              <Text className="font-semibold mb-2 text-gray-700">
                Your Name
              </Text>
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                placeholder="Your full name"
                className="border border-gray-200 rounded-md p-3 text-base bg-white"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="font-semibold mb-2 text-gray-700">
                Contact Phone
              </Text>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="Phone or WhatsApp number"
                keyboardType="phone-pad"
                className="border border-gray-200 rounded-md p-3 text-base bg-white"
                placeholderTextColor="#9CA3AF"
              />
              {!isValidPhone(contactPhone) && contactPhone.length > 0 && (
                <Text className="text-xs text-red-500 mt-1">
                  Please enter a valid phone number.
                </Text>
              )}
            </View>

            {/* Image Picker */}
            <View className="mb-4">
              <Text className="font-semibold mb-2 text-gray-700">
                Item Photo
              </Text>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={takePhoto}
                  className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                >
                  <Text className="font-semibold text-gray-700">
                    Take Photo
                  </Text>
                </Pressable>

                <Pressable
                  onPress={pickFromGallery}
                  className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                >
                  <Text className="font-semibold text-gray-700">
                    Choose from Gallery
                  </Text>
                </Pressable>
              </View>

              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-48 rounded-lg mt-3"
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Submit */}
            <Pressable
              onPress={handleSubmit}
              className={`mt-6 py-3 rounded-lg items-center justify-center ${
                isValidPhone(contactPhone) &&
                contactName.trim() &&
                imageUri
                  ? "bg-blue-600"
                  : "bg-gray-400"
              }`}
              disabled={
                !(
                  isValidPhone(contactPhone) &&
                  contactName.trim() &&
                  imageUri
                )
              }
            >
              <Text className="text-white font-semibold">
                Submit Report
              </Text>
            </Pressable>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-sm text-gray-500">
              We will contact you to verify ownership.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default FormFound;
