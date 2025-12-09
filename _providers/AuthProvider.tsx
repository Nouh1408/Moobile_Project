// app/_providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@auth_token_v1";

type AuthContextType = {
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem(TOKEN_KEY);
        if (t) setToken(t);
      } catch (e) {
        console.warn("Auth load error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // NOTE: these are mocked client-side implementations.
  // Replace with API calls to your backend and store returned tokens.
  const login = async (email: string, password: string) => {
    // rudimentary validation
    if (!email || !password) return false;
    const fakeToken = `token:${email}:${Date.now()}`;
    await AsyncStorage.setItem(TOKEN_KEY, fakeToken);
    setToken(fakeToken);
    return true;
  };

  const register = async (email: string, password: string) => {
    // In real app, call /register then store token from server
    // We just call login for demo
    return await login(email, password);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
