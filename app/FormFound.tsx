import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReportFTitle from '@/components/ReportFTitle';

const FormFound = () => {
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const isValidPhone = (s: string) =>
    s.trim().length >= 7 && /^[0-9+\-\s()]+$/.test(s.trim());

  const handleSubmit = () => {
    // keep behavior minimal — you can replace with navigation or API call
    if (!contactName.trim()) return alert('Please enter your name');
    if (!isValidPhone(contactPhone)) return alert('Please enter a valid phone number');
    alert(`Submitted\nName: ${contactName}\nPhone: ${contactPhone}`);
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
            <View className="mb-4">
              <Text className="font-semibold mb-2 text-gray-700">Your Name</Text>
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                placeholder="Your full name"
                className="border border-gray-200 rounded-md p-3 text-base bg-white"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-2">
              <Text className="font-semibold mb-2 text-gray-700">Contact Phone</Text>
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

            <Pressable
              onPress={handleSubmit}
              className={`mt-6 py-3 rounded-lg items-center justify-center ${
                isValidPhone(contactPhone) && contactName.trim() ? 'bg-blue-600' : 'bg-gray-400'
              }`}
              disabled={!(isValidPhone(contactPhone) && contactName.trim())}
            >
              <Text className="text-white font-semibold">Submit Report</Text>
            </Pressable>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-sm text-gray-500">We will contact you to verify ownership.</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  )
}

export default FormFound
