import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@lost_reports_v1";

export default function FormLost() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = (params?.category as string) || "other";

  const [itemName, setItemName] = useState("");
  const [locationLost, setLocationLost] = useState("");
  const [lostDate, setLostDate] = useState("");
  const [note, setNote] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const isValidPhone = (s: string) =>
    s.trim().length >= 7 && /^[0-9+\-\s()]+$/.test(s.trim());

  const canSubmit =
    itemName.trim().length >= 1 &&
    locationLost.trim().length >= 2 &&
    contactName.trim().length >= 2 &&
    isValidPhone(contactPhone);

  
  const pickImage = async (source: "camera" | "library") => {
    try {
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Camera Permission",
            "Camera access is required to take a photo."
          );
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        if (!result.canceled && result.assets?.length) {
          setImageUri(result.assets[0].uri);
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Photos Permission",
            "Photo library access is required to choose a picture."
          );
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        if (!result.canceled && result.assets?.length) {
          setImageUri(result.assets[0].uri);
        }
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not open camera or gallery.");
    }
  };

  
  const saveReportToStorage = async (report: any) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(report); 
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      console.error("Save error:", err);
      return false;
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Incomplete", "Please fill all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const report = {
        id: Date.now().toString(),
        category: category.toLowerCase(),
        title: itemName.trim(),
        description: note.trim() || "",
        location: locationLost.trim(),
        lostDate: lostDate.trim() || "",
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        imageUri: imageUri || null,
        createdAt: new Date().toISOString(),
      };

      const ok = await saveReportToStorage(report);
      setLoading(false);

      if (!ok) {
        Alert.alert("Error", "Could not save the report. Try again.");
        return;
      }

      Alert.alert(
        "Report submitted",
        "Thank you — your lost-item report has been saved.",
        [{ text: "OK", onPress: () => router.back() }]
      );

      
      setItemName("");
      setLocationLost("");
      setLostDate("");
      setNote("");
      setContactName("");
      setContactPhone("");
      setImageUri(null);
    } catch (e) {
      console.error(e);
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-4">
            <Text className="text-2xl font-bold">Report Lost Item</Text>
            <Text className="text-sm text-slate-500 mt-1">
              Tell us what you lost, where, and how we can contact you.
            </Text>
          </View>

          <View className="space-y-4">
            
            <View>
              <Text className="font-semibold mb-2">What is the item?</Text>
              <TextInput
                value={itemName}
                onChangeText={setItemName}
                placeholder="e.g., Black iPhone, Red Wallet"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            
            <View>
              <Text className="font-semibold mb-2">
                Photo of the item (optional)
              </Text>

              {imageUri ? (
                <View className="flex-row items-center mb-3">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-20 h-20 rounded-md mr-3"
                  />
                  <Pressable
                    onPress={() => setImageUri(null)}
                    className="px-3 py-2 rounded-md bg-red-100"
                  >
                    <Text className="text-xs font-semibold text-red-600">
                      Remove photo
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Text className="text-xs text-slate-500 mb-2">
                  Adding a photo helps others recognize your item faster.
                </Text>
              )}

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => pickImage("camera")}
                  className="flex-1 rounded-md bg-blue-600 p-3 items-center"
                >
                  <Text className="text-white font-semibold text-sm">
                    Take a photo
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => pickImage("library")}
                  className="flex-1 rounded-md bg-slate-100 p-3 items-center"
                >
                  <Text className="text-slate-800 font-semibold text-sm">
                    Choose from gallery
                  </Text>
                </Pressable>
              </View>
            </View>

            
            <View>
              <Text className="font-semibold mb-2">Where did you lose it?</Text>
              <TextInput
                value={locationLost}
                onChangeText={setLocationLost}
                placeholder="e.g., Cairo Mall, Metro station, Gate 2"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

           
            <View>
              <Text className="font-semibold mb-2">
                Date / Time Lost (optional)
              </Text>
              <TextInput
                value={lostDate}
                onChangeText={setLostDate}
                placeholder="e.g., 2025-11-28 14:30 or Yesterday evening"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            
            <View>
              <Text className="font-semibold mb-2">Short Note (optional)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Any quick note (e.g., left on the bench)"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            <View className="h-px bg-gray-200 my-4" />

            
            <View>
              <Text className="font-semibold mb-2">Your Name</Text>
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                placeholder="Your full name"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            {/* Contact phone */}
            <View>
              <Text className="font-semibold mb-2">Contact Phone</Text>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="Phone or WhatsApp number"
                keyboardType="phone-pad"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
              {!isValidPhone(contactPhone) && contactPhone.length > 0 && (
                <Text className="text-xs text-red-500 mt-1">
                  Please enter a valid phone number.
                </Text>
              )}
            </View>

            {/* Actions */}
            <View className="mt-6">
              <Pressable
                onPress={onSubmit}
                disabled={!canSubmit || loading}
                className={`rounded-lg p-4 items-center ${
                  canSubmit && !loading ? "bg-green-600" : "bg-green-200"
                }`}
                style={{ opacity: loading ? 0.9 : 1 }}
              >
                <Text className="text-white font-semibold">
                  {loading ? "Submitting..." : "Submit Report"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                className="mt-3 rounded-lg p-3 items-center border border-gray-200"
              >
                <Text className="text-gray-700">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
