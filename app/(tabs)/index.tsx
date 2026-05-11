import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
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
    </SafeAreaView>
  );
}
