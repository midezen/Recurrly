import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Image, Text, View } from "react-native";

interface UserProfileProps {
  /** Size of the avatar: 'sm' | 'md' | 'lg' */
  size?: "sm" | "md" | "lg";
  /** Show additional details like email */
  showDetails?: boolean;
  /** Show membership info */
  showMemberInfo?: boolean;
  /** Custom container class */
  containerClassName?: string;
}

/**
 * UserProfile Component
 * Displays user avatar, name, email, and optional membership info
 */
export const UserProfile: React.FC<UserProfileProps> = ({
  size = "md",
  showDetails = false,
  showMemberInfo = false,
  containerClassName = "",
}) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  // Avatar sizes
  const avatarSizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <View className={`flex-row items-center ${containerClassName}`}>
      {/* Avatar */}
      <View
        className={`${avatarSizes[size]} rounded-full bg-muted items-center justify-center border-2 border-accent overflow-hidden ${
          size !== "sm" ? "mr-4" : "mr-3"
        }`}
      >
        {user.imageUrl ? (
          <Image source={{ uri: user.imageUrl }} className="w-full h-full" />
        ) : (
          <Text className={`font-bold text-accent ${textSizes[size]}`}>
            {user.firstName?.charAt(0)}
          </Text>
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className={`font-bold text-foreground ${textSizes[size]}`}>
          {user.firstName} {user.lastName}
        </Text>

        {showDetails && (
          <Text className="text-mutedForeground text-xs mt-1">
            {user.primaryEmailAddress?.emailAddress}
          </Text>
        )}

        {showMemberInfo && user.createdAt && (
          <Text className="text-mutedForeground text-xs mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
};

export default UserProfile;
