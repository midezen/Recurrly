import { Link } from "expo-router";
import { Text, View } from "react-native";
import "@/global.css";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 bg-black text-white p-4 rounded-md"
      >
        Sign in here
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 bg-black text-white p-4 rounded-md"
      >
        Sign up here
      </Link>
      <Link
        href="/subscriptions/spotify"
        className="mt-4 bg-black text-white p-4 rounded-md"
      >
        Sub details spotify
      </Link>
    </View>
  );
}
