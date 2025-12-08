import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const FormFound = () => {
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const isValidPhone = (s: string) =>
    s.trim().length >= 7 && /^[0-9+\-\s()]+$/.test(s.trim());
  return (
    <ScrollView>
      <SafeAreaView>
        
          <Text className='text-2xl font-bold'>Report — I found a device</Text>
          <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  className="flex-1"
                >
                  <View>
                          <Text className="font-semibold mb-2">Your Name</Text>
                          <TextInput
                                  value={contactName}
                                  onChangeText={setContactName}
                                  placeholder="Your full name"
                                  className="border border-gray-300 rounded-md p-3 text-base bg-white"
                                />
                        </View>
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
                </KeyboardAvoidingView>
        
      </SafeAreaView>
    </ScrollView>
  )
}

export default FormFound