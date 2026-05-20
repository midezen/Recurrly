import clsx from "clsx";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface AuthInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
}

export const AuthInput = React.forwardRef<TextInput, AuthInputProps>(
  (
    {
      label,
      error,
      helper,
      placeholder,
      containerClassName,
      editable = true,
      ...props
    },
    ref,
  ) => {
    return (
      <View className={clsx("auth-field", containerClassName)}>
        {label && <Text className="auth-label">{label}</Text>}
        <TextInput
          ref={ref}
          {...props}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          className={clsx("auth-input", error && "auth-input-error")}
        />
        {error && <Text className="auth-error">{error}</Text>}
        {helper && !error && <Text className="auth-helper">{helper}</Text>}
      </View>
    );
  },
);

AuthInput.displayName = "AuthInput";
