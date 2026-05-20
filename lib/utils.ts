import { icons } from "@/constants/icons";
import dayjs from "dayjs";
import { ImageSourcePropType } from "react-native";

export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Finds a matching icon for a subscription based on its name
 * Uses fuzzy matching to find the best available icon
 */
export const findIconForSubscription = (
  subscriptionName: string,
): ImageSourcePropType => {
  const name = subscriptionName.toLowerCase();

  // Exact and partial matches for known services
  const iconMatches: Record<string, ImageSourcePropType> = {
    spotify: icons.spotify,
    adobe: icons.adobe,
    github: icons.github,
    claude: icons.claude,
    canva: icons.canva,
    notion: icons.notion,
    figma: icons.figma,
    openai: icons.openai,
    dropbox: icons.dropbox,
    medium: icons.medium,
    netflix: icons.activity,
    amazon: icons.activity,
    hulu: icons.activity,
    disney: icons.activity,
    apple: icons.activity,
    microsoft: icons.openai,
    google: icons.openai,
    slack: icons.openai,
    zoom: icons.openai,
  };

  // Try exact match first
  if (iconMatches[name]) {
    return iconMatches[name];
  }

  // Try partial matches
  for (const [key, icon] of Object.entries(iconMatches)) {
    if (name.includes(key) || key.includes(name.split(" ")[0])) {
      return icon;
    }
  }

  // Fallback to wallet icon
  return icons.wallet;
};
