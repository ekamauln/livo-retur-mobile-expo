import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <Text className="text-xl font-bold text-neutral-500">
        404 - Not Found
      </Text>
      <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 rounded">
        Go to Home
      </Link>
    </View>
  );
}
