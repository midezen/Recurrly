import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Image, Text, View } from "react-native";

interface ProfileCardProps {
  /** Show email address */
  showEmail?: boolean;
  /** Show member since date */
  showMemberDate?: boolean;
  /** Show verification status */
  showVerification?: boolean;
  /** Container class name */
  containerClassName?: string;
}

/**
 * ProfileCard Component
 * Displays user profile information in a card format
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  showEmail = true,
  showMemberDate = true,
  showVerification = true,
  containerClassName = "",
}) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  const isEmailVerified =
    user.primaryEmailAddress?.verification?.status === "verified";

  return (
    <View
      className={`bg-card rounded-3xl p-6 border border-muted ${containerClassName}`}
    >
      {/* Header with Avatar and Basic Info */}
      <View className="flex-row items-center mb-4">
        {/* Avatar */}
        <View className="w-16 h-16 rounded-full bg-muted items-center justify-center mr-4 border-2 border-accent overflow-hidden">
          {user.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} className="w-full h-full" />
          ) : (
            <Text className="text-2xl font-bold text-accent">
              {user.firstName?.charAt(0)}
            </Text>
          )}
        </View>

        {/* User Info */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">
            {user.firstName} {user.lastName}
          </Text>
          {showEmail && (
            <Text className="text-mutedForeground text-sm mt-1">
              {user.primaryEmailAddress?.emailAddress}
            </Text>
          )}
          {showMemberDate && user.createdAt && (
            <Text className="text-mutedForeground text-xs mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      {/* Status Section */}
      {(showVerification || showMemberDate) && (
        <View className="mt-4 pt-4 border-t border-muted">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-mutedForeground text-sm">Account Status</Text>
            <View className="bg-success/20 rounded-full px-3 py-1">
              <Text className="text-success text-xs font-semibold">Active</Text>
            </View>
          </View>

          {showVerification && (
            <View className="flex-row items-center justify-between">
              <Text className="text-mutedForeground text-sm">
                Email Verified
              </Text>
              <View
                className={`${
                  isEmailVerified ? "bg-success/20" : "bg-muted"
                } rounded-full px-3 py-1`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isEmailVerified ? "text-success" : "text-mutedForeground"
                  }`}
                >
                  {isEmailVerified ? "✓ Verified" : "Pending"}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ProfileCard;
