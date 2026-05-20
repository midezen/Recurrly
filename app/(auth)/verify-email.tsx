import { AuthButton } from "@/components/AuthButton";
import { AuthInput } from "@/components/AuthInput";
import { extractClerkErrors } from "@/lib/auth";
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyEmail = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signUp } = useSignUp();

  // Form state
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");
  const [errors, setErrors] = useState({
    code: "",
  });

  // Refs for keyboard navigation
  const codeRef = useRef<any>(null);

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, router]);

  // Code validation
  const validateCodeField = (value: string) => {
    setCode(value);
    setErrors((prev) => ({ ...prev, code: "" }));
  };

  // Form validation before submission
  const validateForm = (): boolean => {
    const newErrors = { code: "" };
    let isValid = true;

    if (!code.trim()) {
      newErrors.code = "Please provide the code sent to your email";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle sign in
  const handleCodeVerification = async () => {
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: clerkError } = await signUp.verifications.verifyEmailCode({
        code,
      });
      if (!clerkError && signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            const url = decorateUrl("/(auth)/sign-in");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url as Href);
            }
          },
        });
      } else {
        setGeneralError(JSON.stringify(clerkError, null, 2));
        // Check why the sign-up is not complete
        console.error("Sign-up attempt not complete:", signUp);
      }
    } catch (err) {
      const clerkErrors = extractClerkErrors(err);
      if (clerkErrors.length > 0) {
        setGeneralError(clerkErrors[0]);
      } else {
        setGeneralError(
          "Unable to Verify. Please check the code and try again.",
        );
      }
      console.error("Code Verification Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="auth-safe-area">
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans-semibold text-primary">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            {/* Brand Section */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurrly</Text>
                  <Text className="auth-wordmark-sub">Track & Manage</Text>
                </View>
              </View>
            </View>

            {/* Content */}
            <View className="mt-8">
              <Text className="auth-title">Verify Email</Text>
              <Text className="auth-subtitle">
                Provide the code sent to your email
              </Text>
            </View>

            {/* Form Card */}
            <View className="auth-card">
              {/* General Error */}
              {generalError && (
                <View className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3">
                  <Text className="text-sm font-sans-semibold text-destructive">
                    {generalError}
                  </Text>
                </View>
              )}

              {/* Form Fields */}
              <View className="auth-form">
                <AuthInput
                  label="Verfication Code"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={code}
                  onChangeText={validateCodeField}
                  error={errors.code}
                  editable={!isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => codeRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>

              {/* Sign In Button */}
              <AuthButton
                text="Verify"
                onPress={handleCodeVerification}
                isLoading={isLoading}
                isDisabled={!code}
                style={{ marginTop: 16 }}
              />
            </View>

            {/* Divider */}
            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">
                Having issues receiving code?
              </Text>
              <View className="auth-divider-line" />
            </View>

            {/* Sign Up Link */}
            <Link href="/(auth)/sign-up" asChild>
              <AuthButton text="Resend code" variant="secondary" />
            </Link>

            {/* Footer Message */}
            <Text className="mt-6 text-center text-xs font-sans-medium text-muted-foreground">
              By verifying, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyEmail;
