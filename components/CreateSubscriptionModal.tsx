import { findIconForSubscription } from "@/lib/utils";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#FF6B6B",
  "AI Tools": "#4ECDC4",
  "Developer Tools": "#45B7D1",
  Design: "#FFA07A",
  Productivity: "#98D8C8",
  Cloud: "#B0A9E8",
  Music: "#FFB4B9",
  Other: "#C3B1E1",
};

export const CreateSubscriptionModal: React.FC<
  CreateSubscriptionModalProps
> = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [selectedCategory, setSelectedCategory] = useState<string>("Other");
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  const handleReset = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setSelectedCategory("Other");
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; price?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const priceNum = parseFloat(price);
    const now = dayjs();
    const startDate = now.format("YYYY-MM-DDTHH:mm:ss.000Z");

    let renewalDate: string;
    if (frequency === "Monthly") {
      renewalDate = now.add(1, "month").format("YYYY-MM-DDTHH:mm:ss.000Z");
    } else {
      renewalDate = now.add(1, "year").format("YYYY-MM-DDTHH:mm:ss.000Z");
    }

    const newSubscription: Subscription = {
      id: `subscription-${Date.now()}`,
      name: name.trim(),
      price: priceNum,
      currency: "USD",
      icon: findIconForSubscription(name.trim()),
      category: selectedCategory,
      status: "active",
      billing: frequency,
      startDate,
      renewalDate,
      color: CATEGORY_COLORS[selectedCategory],
      plan: frequency === "Yearly" ? "Annual Plan" : "Monthly Plan",
      paymentMethod: "Not specified",
    };

    onSubmit(newSubscription);
    handleReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Pressable
            className="flex-1"
            onPress={onClose}
            style={{ backgroundColor: "transparent" }}
          />

          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                onPress={onClose}
                className="modal-close"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView
              className="modal-body"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Name Input */}
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  placeholder="e.g. Netflix"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                  className={clsx(
                    "auth-input",
                    errors.name && "auth-input-error",
                  )}
                />
                {errors.name && (
                  <Text className="auth-error">{errors.name}</Text>
                )}
              </View>

              {/* Price Input */}
              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  className={clsx(
                    "auth-input",
                    errors.price && "auth-input-error",
                  )}
                />
                {errors.price && (
                  <Text className="auth-error">{errors.price}</Text>
                )}
              </View>

              {/* Frequency Toggle */}
              <View className="auth-field">
                <Text className="auth-label">Billing Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    onPress={() => setFrequency("Monthly")}
                    className={clsx(
                      "picker-option",
                      frequency === "Monthly" && "picker-option-active",
                    )}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Monthly" && "picker-option-text-active",
                      )}
                    >
                      Monthly
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setFrequency("Yearly")}
                    className={clsx(
                      "picker-option",
                      frequency === "Yearly" && "picker-option-active",
                    )}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Yearly" && "picker-option-text-active",
                      )}
                    >
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Category Selection */}
              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((category) => (
                    <Pressable
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      className={clsx(
                        "category-chip",
                        selectedCategory === category && "category-chip-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          selectedCategory === category &&
                            "category-chip-text-active",
                        )}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                className={clsx(
                  "auth-button",
                  !name.trim() && "auth-button-disabled",
                )}
                disabled={!name.trim()}
              >
                <Text className="auth-button-text">Add Subscription</Text>
              </Pressable>

              {/* Spacer */}
              <View className="h-5" />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
