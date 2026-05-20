import clsx from "clsx";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";

interface AuthButtonProps extends PressableProps {
  text: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: "primary" | "secondary";
}

export const AuthButton = React.forwardRef<React.Component, AuthButtonProps>(
  (
    {
      text,
      isLoading = false,
      isDisabled = false,
      variant = "primary",
      onPress,
      ...props
    },
    ref,
  ) => {
    const buttonStyle = clsx(
      variant === "primary" ? "auth-button" : "auth-secondary-button",
      (isLoading || isDisabled) &&
        (variant === "primary" ? "auth-button-disabled" : "opacity-50"),
    );

    return (
      <Pressable
        {...props}
        onPress={isLoading || isDisabled ? undefined : onPress}
        disabled={isLoading || isDisabled}
        className={buttonStyle}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === "primary" ? "#081126" : "#ea7a53"}
          />
        ) : (
          <Text
            className={
              variant === "primary"
                ? "auth-button-text"
                : "auth-secondary-button-text"
            }
          >
            {text}
          </Text>
        )}
      </Pressable>
    );
  },
);

AuthButton.displayName = "AuthButton";
