import { ClerkProvider } from "@clerk/expo";
import * as SecureStore from "expo-secure-store";
import React from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

/**
 * Secure token storage for Clerk
 */
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Failed to get token from secure store:", err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Failed to save token to secure store:", err);
    }
  },
};

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  );
}
