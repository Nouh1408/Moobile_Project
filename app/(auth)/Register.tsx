// app/(auth)/Register.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../_providers/AuthProvider";

export default function Register() {
  const { register, session, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && session) {
      router.replace("/(tabs)");
    }
  }, [session, authLoading, router]);

  // Tab state
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validations
  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const normalizeEgyptianPhone = (val: string): string => {
    let clean = val.replace(/[\s-]/g, "");
    if (clean.startsWith("+20")) return clean;
    if (clean.startsWith("0")) clean = clean.slice(1);
    return `+20${clean}`;
  };

  const isValidEgyptianPhone = (val: string): boolean => {
    const normalized = normalizeEgyptianPhone(val);
    return /^\+20(10|11|12|15)\d{8}$/.test(normalized);
  };

  const submit = async () => {
    if (authMethod === "email") {
      if (!email.trim()) {
        Alert.alert("Input Required", "Please enter your university email address.");
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address (e.g. name@uni.edu.eg).");
        return;
      }
    } else {
      if (!phone.trim()) {
        Alert.alert("Input Required", "Please enter your Egyptian mobile number.");
        return;
      }
      if (!isValidEgyptianPhone(phone)) {
        Alert.alert(
          "Invalid Phone",
          "Enter a valid 10-digit Egyptian mobile number (e.g. 10XXXXXXXX, 11XXXXXXXX, 12XXXXXXXX, 15XXXXXXXX)."
        );
        return;
      }
    }

    if (!password.trim()) {
      Alert.alert("Input Required", "Please enter a password.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "The passwords you entered do not match.");
      return;
    }

    setLoading(true);
    const identifier = authMethod === "email" ? email.trim() : normalizeEgyptianPhone(phone);
    const isPhone = authMethod === "phone";

    const ok = await register(identifier, password, isPhone);
    setLoading(false);

    if (ok) {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ================= TOP NAVIGATION BAR ================= */}
          <View className="px-5 py-3 flex-row items-center justify-between border-b border-[#E4E4E7] bg-white">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="w-9 h-9 border border-[#E4E4E7] rounded-[2px] items-center justify-center bg-[#FAFAFA] active:bg-[#E4E4E7]"
            >
              <Ionicons name="arrow-back" size={18} color="#1A1A1A" />
            </Pressable>
            <Text className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
              Registration
            </Text>
            <View className="w-9" />
          </View>

          {/* ================= PURE FLAT GEOMETRIC HEADER ================= */}
          <View className="bg-[#1A1A1A] border-b border-[#2D2D2D] px-5 pt-6 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-[#0066FF] px-2.5 py-1 rounded-[2px]">
                <Text className="text-white text-[10px] font-bold tracking-wider uppercase">
                  NEW MEMBER ACCOUNT
                </Text>
              </View>
              <View className="flex-row items-center bg-[#262626] px-2 py-1 rounded-[2px] border border-[#333333]">
                <Ionicons name="school" size={13} color="#0066FF" />
                <Text className="text-[#A1A1AA] text-[10px] font-semibold ml-1.5 uppercase tracking-wider">
                  Campus Verified
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-11 h-11 bg-[#0066FF] rounded-[2px] items-center justify-center mr-3.5">
                <Ionicons name="person-add" size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white tracking-tight">
                  Join Campus Recovery
                </Text>
                <Text className="text-xs text-[#A1A1AA] mt-0.5">
                  Connect with students & staff to return belongings
                </Text>
              </View>
            </View>
          </View>

          {/* ================= MAIN CONTAINER ================= */}
          <View className="px-5 pt-6 pb-8 flex-1">
            {/* Header Titles */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                Create Account
              </Text>
              <Text className="text-sm text-[#4A4A4A] mt-1">
                Join your university community to recover and return lost belongings.
              </Text>
            </View>

            {/* ================= FLAT 2D SEGMENTED TAB SWITCHER ================= */}
            <View className="flex-row bg-[#F4F5F7] p-1 border border-[#E4E4E7] rounded-[2px] mb-5">
              <Pressable
                onPress={() => setAuthMethod("email")}
                className={`flex-1 py-2.5 flex-row items-center justify-center rounded-[2px] ${
                  authMethod === "email" ? "bg-[#1A1A1A]" : "bg-transparent"
                }`}
              >
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color={authMethod === "email" ? "#FFFFFF" : "#4A4A4A"}
                />
                <Text
                  className={`ml-2 text-xs font-semibold ${
                    authMethod === "email" ? "text-white" : "text-[#4A4A4A]"
                  }`}
                >
                  University Email
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setAuthMethod("phone")}
                className={`flex-1 py-2.5 flex-row items-center justify-center rounded-[2px] ${
                  authMethod === "phone" ? "bg-[#1A1A1A]" : "bg-transparent"
                }`}
              >
                <Ionicons
                  name="call-outline"
                  size={16}
                  color={authMethod === "phone" ? "#FFFFFF" : "#4A4A4A"}
                />
                <Text
                  className={`ml-2 text-xs font-semibold ${
                    authMethod === "phone" ? "text-white" : "text-[#4A4A4A]"
                  }`}
                >
                  Egyptian Phone (+20)
                </Text>
              </Pressable>
            </View>

            {/* ================= FORM CONTROLS ================= */}
            <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-5">
              {/* Email Input */}
              {authMethod === "email" ? (
                <View className="mb-4">
                  <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                    University Email Address
                  </Text>
                  <View
                    className={`flex-row items-center bg-white border rounded-[2px] px-3.5 py-3 ${
                      focusedField === "email"
                        ? "border-[#0066FF] border-[2px]"
                        : "border-[#E4E4E7]"
                    }`}
                  >
                    <Ionicons name="mail-outline" size={18} color="#71717A" />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g. student@uni.edu.eg"
                      placeholderTextColor="#A1A1AA"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="flex-1 ml-2.5 text-sm text-[#1A1A1A]"
                    />
                    {email.length > 0 && isValidEmail(email) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#16A34A"
                      />
                    )}
                  </View>
                  <Text className="text-[11px] text-[#71717A] mt-1">
                    University email ensures verified access to campus listings.
                  </Text>
                </View>
              ) : (
                /* Egyptian Phone Input */
                <View className="mb-4">
                  <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                    Egyptian Mobile Number
                  </Text>
                  <View
                    className={`flex-row items-center bg-white border rounded-[2px] overflow-hidden ${
                      focusedField === "phone"
                        ? "border-[#0066FF] border-[2px]"
                        : "border-[#E4E4E7]"
                    }`}
                  >
                    <View className="bg-[#F4F5F7] px-3 py-3 border-r border-[#E4E4E7] flex-row items-center">
                      <Ionicons name="call-outline" size={16} color="#1A1A1A" />
                      <Text className="text-xs font-bold text-[#1A1A1A] ml-1.5">
                        +20
                      </Text>
                    </View>
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="1012345678"
                      placeholderTextColor="#A1A1AA"
                      keyboardType="phone-pad"
                      className="flex-1 px-3 py-3 text-sm text-[#1A1A1A]"
                    />
                    {phone.length > 0 && isValidEgyptianPhone(phone) && (
                      <View className="pr-3">
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#16A34A"
                        />
                      </View>
                    )}
                  </View>
                  <Text className="text-[11px] text-[#71717A] mt-1">
                    10-digit number without leading 0 (e.g. 10XXXXXXXX).
                  </Text>
                </View>
              )}

              {/* Password Input */}
              <View className="mb-4">
                <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  Choose Password
                </Text>
                <View
                  className={`flex-row items-center bg-white border rounded-[2px] px-3.5 py-3 ${
                    focusedField === "password"
                      ? "border-[#0066FF] border-[2px]"
                      : "border-[#E4E4E7]"
                  }`}
                >
                  <Ionicons name="lock-closed-outline" size={18} color="#71717A" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="At least 6 characters"
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showPassword}
                    className="flex-1 ml-2.5 text-sm text-[#1A1A1A]"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#71717A"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-5">
                <Text className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </Text>
                <View
                  className={`flex-row items-center bg-white border rounded-[2px] px-3.5 py-3 ${
                    focusedField === "confirmPassword"
                      ? "border-[#0066FF] border-[2px]"
                      : "border-[#E4E4E7]"
                  }`}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#71717A"
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 ml-2.5 text-sm text-[#1A1A1A]"
                  />
                  <Pressable
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#71717A"
                    />
                  </Pressable>
                </View>
                {confirmPassword.length > 0 &&
                  password !== confirmPassword && (
                    <Text className="text-[11px] text-[#DC2626] font-medium mt-1">
                      Passwords do not match.
                    </Text>
                  )}
              </View>

              {/* Submit Primary Button */}
              <Pressable
                onPress={submit}
                disabled={loading}
                className="bg-[#0066FF] active:bg-[#0052CC] rounded-[2px] py-3.5 items-center justify-center flex-row"
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
                    <Text className="text-white font-bold text-sm tracking-wide ml-2 uppercase">
                      Create Account
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* ================= COMMUNITY POLICY & LOGIN PROMPT ================= */}
            <View className="mt-5 px-1">
              <Text className="text-[11px] text-[#71717A] text-center leading-4">
                By creating an account, you agree to comply with campus lost &
                found policies and safe handover guidelines.
              </Text>
            </View>

            <View className="mt-6 border-t border-[#E4E4E7] pt-5">
              <View className="items-center mb-3">
                <Text className="text-xs text-[#71717A] uppercase tracking-wider font-semibold">
                  Already Registered?
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/(auth)/Login")}
                className="border border-[#1A1A1A] bg-white active:bg-gray-100 rounded-[2px] py-3 items-center justify-center flex-row"
              >
                <Ionicons name="log-in-outline" size={16} color="#1A1A1A" />
                <Text className="text-[#1A1A1A] font-bold text-xs uppercase tracking-wide ml-2">
                  Sign In To Your Account
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
