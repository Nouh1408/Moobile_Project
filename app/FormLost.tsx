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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useLocation from "@/hooks/UseLocation";

export default function FormLost() {
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [locationFound, setLocationFound] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const [note, setNote] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);

  
  const { latitude, longitude, errorMsg } = useLocation();

  const isValidPhone = (s: string) =>
    s.trim().length >= 7 && /^[0-9+\-\s()]+$/.test(s.trim());

  const canSubmit =
    itemName.trim().length >= 1 &&
    locationFound.trim().length >= 2 &&
    contactName.trim().length >= 2 &&
    isValidPhone(contactPhone);

  const onUseCurrentLocation = () => {
    if (errorMsg) {
      Alert.alert("Location Error", errorMsg);
      return;
    }

    if (latitude && longitude) {
      setLocationFound(`${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`);
    } else {
      Alert.alert("Location Unavailable", "Unable to get your position yet.");
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Incomplete", "Please fill all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 900));

      setLoading(false);
      Alert.alert(
        "Report submitted",
        "Thank you — your found-item report has been submitted.",
        [{ text: "OK", onPress: () => router.back() }]
      );

      setItemName("");
      setLocationFound("");
      setFoundDate("");
      setNote("");
      setContactName("");
      setContactPhone("");
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
              Tell us what you lost and how we can contact you.
            </Text>
          </View>

          <View className="space-y-4">
            {/* Item */}
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
              <Text className="font-semibold mb-2">Location Found</Text>

              
              <Pressable
                onPress={onUseCurrentLocation}
                className="rounded-md bg-blue-600 p-3 items-center mb-2"
              >
                <Text className="text-white font-semibold">
                  Use my current location
                </Text>
              </Pressable>

              
              {latitude && longitude && (
                <Text className="text-xs text-gray-500 mb-1">
                  setLocationFound(`${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`);

                </Text>
              )}

              <TextInput
                value={locationFound}
                onChangeText={setLocationFound}
                placeholder="Where did you find it? (e.g., Cairo Mall, Gate 2)"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            {/* Date */}
            <View>
              <Text className="font-semibold mb-2">
                Date / Time Found (optional)
              </Text>
              <TextInput
                value={foundDate}
                onChangeText={setFoundDate}
                placeholder="e.g., 2025-11-28 14:30 or Yesterday evening"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            {/* Note */}
            <View>
              <Text className="font-semibold mb-2">Short Note (optional)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Any quick note (e.g., found near cashier)"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            <View className="h-px bg-gray-200 my-4" />

            {/* Contact Name */}
            <View>
              <Text className="font-semibold mb-2">Your Name</Text>
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                placeholder="Your full name"
                className="border border-gray-300 rounded-md p-3 text-base bg-white"
              />
            </View>

            {/* Contact Phone */}
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

            {/* Submit */}
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
                  {loading ? "Submitting..." : "Submit Found Report"}
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
