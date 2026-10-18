// _providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  token: string | null;
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (identifier: string, password: string, isPhone?: boolean) => Promise<boolean>;
  register: (identifier: string, password: string, isPhone?: boolean) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    identifier: string,
    password: string,
    isPhone: boolean = false
  ): Promise<boolean> => {
    try {
      const cleanId = identifier.trim();
      const credentials = isPhone
        ? { phone: cleanId, password }
        : { email: cleanId, password };

      const { data, error } = await supabase.auth.signInWithPassword(credentials as any);

      if (error) {
        Alert.alert("Login Failed", error.message);
        return false;
      }

      setSession(data.session);
      setUser(data.user);
      return true;
    } catch (err: any) {
      Alert.alert("Login Error", err?.message || "Failed to sign in.");
      return false;
    }
  };

  const register = async (
    identifier: string,
    password: string,
    isPhone: boolean = false
  ): Promise<boolean> => {
    try {
      const cleanId = identifier.trim();
      const credentials = isPhone
        ? { phone: cleanId, password }
        : { email: cleanId, password };

      const { data, error } = await supabase.auth.signUp(credentials as any);

      if (error) {
        Alert.alert("Registration Failed", error.message);
        return false;
      }

      // If Supabase has email confirmation disabled, a session is created immediately
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      } else {
        Alert.alert(
          isPhone ? "Verification Sent" : "Check your email",
          isPhone
            ? "A verification code has been sent to your phone number."
            : "A verification link has been sent to your email to activate your account."
        );
      }

      return true;
    } catch (err: any) {
      Alert.alert("Registration Error", err?.message || "Failed to register.");
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        Alert.alert("Reset Failed", error.message);
        return false;
      }
      Alert.alert("Reset Link Sent", "Check your email inbox for password recovery instructions.");
      return true;
    } catch (err: any) {
      Alert.alert("Reset Error", err?.message || "Failed to send reset email.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (err) {
      console.warn("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: session?.access_token ?? null,
        user,
        session,
        loading,
        login,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
