import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
  action: () => void;
  destructive?: boolean;
}

const Settings = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: async () => {
          try {
            setIsLoggingOut(true);
            await signOut();
            // Redirect to sign-in after logout
            router.replace("/(auth)/sign-in");
          } catch (error) {
            console.error("Sign out error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
            setIsLoggingOut(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  /**
   * Handle edit profile navigation
   */
  const handleEditProfile = () => {
    // TODO: Implement edit profile screen
    Alert.alert("Edit Profile", "Edit profile feature coming soon!");
  };

  /**
   * Handle change password
   */
  const handleChangePassword = () => {
    // TODO: Implement change password
    Alert.alert("Change Password", "Change password feature coming soon!");
  };

  /**
   * Handle notification settings
   */
  const handleNotificationSettings = () => {
    // TODO: Implement notification settings
    Alert.alert("Notifications", "Notification settings coming soon!");
  };

  /**
   * Handle privacy settings
   */
  const handlePrivacySettings = () => {
    // TODO: Implement privacy settings
    Alert.alert("Privacy", "Privacy settings coming soon!");
  };

  // Loading state
  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ea7a53" />
      </SafeAreaView>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground text-lg font-semibold mb-4">
          Not signed in
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-in")}
          className="px-6 py-3 bg-accent rounded-2xl"
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const settingsSections: SettingsSection[] = [
    {
      id: "profile",
      title: "Edit Profile",
      icon: "👤",
      action: handleEditProfile,
    },
    {
      id: "password",
      title: "Change Password",
      icon: "🔑",
      action: handleChangePassword,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "🔔",
      action: handleNotificationSettings,
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: "🔒",
      action: handlePrivacySettings,
    },
    {
      id: "logout",
      title: "Sign Out",
      icon: "👋",
      action: handleLogout,
      destructive: true,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-extrabold text-foreground mb-1">
            Settings
          </Text>
          <Text className="text-mutedForeground text-sm">
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Section */}
        <View className="mb-8 bg-card rounded-3xl p-6 border border-muted">
          <View className="flex-row items-center mb-4">
            {/* Avatar */}
            <View className="w-16 h-16 rounded-full bg-muted items-center justify-center mr-4 border-2 border-accent overflow-hidden">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-2xl font-bold text-accent">
                  {user?.firstName?.charAt(0)}
                </Text>
              )}
            </View>

            {/* User Info */}
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text className="text-mutedForeground text-sm mt-1">
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
              <Text className="text-mutedForeground text-xs mt-1">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Recently"}
              </Text>
            </View>
          </View>

          {/* Account Status */}
          <View className="mt-4 pt-4 border-t border-muted">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-mutedForeground text-sm">
                Account Status
              </Text>
              <View className="bg-success/20 rounded-full px-3 py-1">
                <Text className="text-success text-xs font-semibold">
                  Active
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-mutedForeground text-sm">
                Email Verified
              </Text>
              <View className="bg-success/20 rounded-full px-3 py-1">
                <Text className="text-success text-xs font-semibold">
                  {user?.primaryEmailAddress?.verification?.status ===
                  "verified"
                    ? "✓ Verified"
                    : "Pending"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-foreground mb-3 uppercase opacity-60">
            Account Settings
          </Text>

          {settingsSections.map((section, index) => (
            <TouchableOpacity
              key={section.id}
              onPress={section.action}
              disabled={isLoggingOut && section.id === "logout"}
              className={`flex-row items-center justify-between p-4 mb-2 rounded-2xl border border-muted ${
                section.destructive ? "bg-destructive/5" : "bg-card"
              } active:opacity-80`}
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">{section.icon}</Text>
                <Text
                  className={`text-base font-semibold ${
                    section.destructive ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {section.title}
                </Text>
              </View>

              {isLoggingOut && section.id === "logout" ? (
                <ActivityIndicator size="small" color="#ea7a53" />
              ) : (
                <Text className="text-mutedForeground text-lg">→</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View className="bg-muted/50 rounded-2xl p-4 mt-8">
          <Text className="text-xs text-mutedForeground text-center mb-3">
            Recurrly v1.0.0
          </Text>
          <View className="flex-row items-center justify-around mb-3">
            <TouchableOpacity>
              <Text className="text-xs text-accent font-semibold underline">
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text className="text-mutedForeground">•</Text>
            <TouchableOpacity>
              <Text className="text-xs text-accent font-semibold underline">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text className="text-mutedForeground">•</Text>
            <TouchableOpacity>
              <Text className="text-xs text-accent font-semibold underline">
                Support
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-mutedForeground text-center">
            © 2026 Recurrly. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
