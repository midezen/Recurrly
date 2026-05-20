import { AuthButton } from "@/components/AuthButton";
import { AuthInput } from "@/components/AuthInput";
import {
  extractClerkErrors,
  getPasswordStrength,
  sanitizeInput,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/auth";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signUp } = useSignUp();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Refs for keyboard navigation
  const lastNameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, router]);

  // Get password strength
  const passwordStrength = getPasswordStrength(password);
  const strengthColor =
    passwordStrength === "weak"
      ? "#dc2626"
      : passwordStrength === "fair"
        ? "#ea7a53"
        : passwordStrength === "good"
          ? "#f59e0b"
          : "#16a34a";

  // Field validators
  const validateFirstNameField = (value: string) => {
    const sanitized = sanitizeInput(value);
    setFirstName(sanitized);

    if (!sanitized) {
      setErrors((prev) => ({ ...prev, firstName: "" }));
      return;
    }

    if (sanitized.length < 2) {
      setErrors((prev) => ({
        ...prev,
        firstName: "First name must be at least 2 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const validateLastNameField = (value: string) => {
    const sanitized = sanitizeInput(value);
    setLastName(sanitized);

    if (!sanitized) {
      setErrors((prev) => ({ ...prev, lastName: "" }));
      return;
    }

    if (sanitized.length < 2) {
      setErrors((prev) => ({
        ...prev,
        lastName: "Last name must be at least 2 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  };

  const validateEmailField = (value: string) => {
    const sanitized = sanitizeInput(value);
    setEmail(sanitized);

    if (!sanitized) {
      setErrors((prev) => ({ ...prev, email: "" }));
      return;
    }

    if (!validateEmail(sanitized)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validatePasswordField = (value: string) => {
    setPassword(value);

    const validation = validatePassword(value);
    if (!validation.isValid && value.length > 0) {
      setErrors((prev) => ({
        ...prev,
        password: validation.errors[0] || "Password does not meet requirements",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    // Re-validate confirm password if it exists
    if (confirmPassword && value !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else if (confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validateConfirmPasswordField = (value: string) => {
    setConfirmPassword(value);

    if (!validatePasswordMatch(password, value)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Form validation before submission
  const validateForm = (): boolean => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password =
        passwordValidation.errors[0] || "Password does not meet requirements";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle sign up
  const handleSignUp = async () => {
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp.password({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      const { error: clerkError } = await signUp.verifications.sendEmailCode();
      if (!clerkError) {
        router.push("/(auth)/verify-email");
      } else {
        setGeneralError(JSON.stringify(clerkError, null, 2));
      }
    } catch (err) {
      const clerkErrors = extractClerkErrors(err);
      if (clerkErrors.length > 0) {
        setGeneralError(clerkErrors[0]);
      } else {
        setGeneralError(
          "Unable to create account. Please try again with different information.",
        );
      }
      console.error("Sign up error:", err);
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
              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Start tracking and managing your subscriptions
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
                {/* Name Row */}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <AuthInput
                      label="First Name"
                      placeholder="John"
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={firstName}
                      onChangeText={validateFirstNameField}
                      error={errors.firstName}
                      editable={!isLoading}
                      returnKeyType="next"
                      onSubmitEditing={() => lastNameRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                  <View className="flex-1">
                    <AuthInput
                      ref={lastNameRef}
                      label="Last Name"
                      placeholder="Doe"
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={lastName}
                      onChangeText={validateLastNameField}
                      error={errors.lastName}
                      editable={!isLoading}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <AuthInput
                  ref={emailRef}
                  label="Email Address"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={validateEmailField}
                  error={errors.email}
                  editable={!isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                />

                <AuthInput
                  ref={passwordRef}
                  label="Password"
                  placeholder="Create a strong password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={validatePasswordField}
                  error={errors.password}
                  editable={!isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  blurOnSubmit={false}
                />

                {/* Password Strength Indicator */}
                {password && (
                  <View className="mx-px gap-2">
                    <View className="flex-row items-center gap-2">
                      <View className="h-1 flex-1 rounded-full bg-muted" />
                      <View
                        className="h-1 w-8 rounded-full"
                        style={{ backgroundColor: strengthColor }}
                      />
                    </View>
                    <Text
                      className="text-xs font-sans-semibold"
                      style={{ color: strengthColor }}
                    >
                      {passwordStrength.charAt(0).toUpperCase() +
                        passwordStrength.slice(1)}{" "}
                      password
                    </Text>
                  </View>
                )}

                <AuthInput
                  ref={confirmPasswordRef}
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={confirmPassword}
                  onChangeText={validateConfirmPasswordField}
                  error={errors.confirmPassword}
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
              </View>

              {/* Sign Up Button */}
              <AuthButton
                text="Create Account"
                onPress={handleSignUp}
                isLoading={isLoading}
                isDisabled={
                  !firstName ||
                  !lastName ||
                  !email ||
                  !password ||
                  !confirmPassword
                }
                style={{ marginTop: 16 }}
              />
            </View>

            {/* Divider */}
            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">
                Already have an account?
              </Text>
              <View className="auth-divider-line" />
            </View>

            {/* Sign In Link */}
            <Link href="/(auth)/sign-in" asChild>
              <AuthButton text="Sign In Instead" variant="secondary" />
            </Link>

            {/* Footer Message */}
            <Text className="mt-6 text-center text-xs font-sans-medium text-muted-foreground">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
