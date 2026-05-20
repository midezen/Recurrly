import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export interface SettingsMenuItemProps {
  /** Unique identifier */
  id: string;
  /** Display title */
  title: string;
  /** Emoji or icon */
  icon?: string;
  /** Callback when pressed */
  onPress: () => void;
  /** Is this a destructive action (shows in red) */
  isDestructive?: boolean;
  /** Is the item disabled */
  isDisabled?: boolean;
  /** Show loading indicator */
  isLoading?: boolean;
  /** Optional description text */
  description?: string;
}

interface SettingsMenuProps {
  /** Array of menu items */
  items: SettingsMenuItemProps[];
  /** Section title */
  title?: string;
  /** Container class name */
  containerClassName?: string;
}

/**
 * SettingsMenu Component
 * Displays a list of settings menu items
 */
export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  items,
  title,
  containerClassName = "",
}) => {
  return (
    <View className={containerClassName}>
      {title && (
        <Text className="text-sm font-semibold text-foreground mb-3 uppercase opacity-60">
          {title}
        </Text>
      )}

      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={item.onPress}
          disabled={item.isDisabled || item.isLoading}
          className={`flex-row items-center justify-between p-4 mb-2 rounded-2xl border border-muted active:opacity-80 ${
            item.isDestructive ? "bg-destructive/5" : "bg-card"
          } ${item.isDisabled ? "opacity-50" : ""}`}
        >
          <View className="flex-row items-center flex-1">
            {item.icon && <Text className="text-2xl mr-3">{item.icon}</Text>}
            <View className="flex-1">
              <Text
                className={`text-base font-semibold ${
                  item.isDestructive ? "text-destructive" : "text-foreground"
                }`}
              >
                {item.title}
              </Text>
              {item.description && (
                <Text className="text-mutedForeground text-xs mt-1">
                  {item.description}
                </Text>
              )}
            </View>
          </View>

          {item.isLoading ? (
            <ActivityIndicator size="small" color="#ea7a53" />
          ) : (
            <Text className="text-mutedForeground text-lg">→</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SettingsMenu;
