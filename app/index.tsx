import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <Text className="text-xl font-bold text-neutral-500">Home Screen</Text>
      <Link href="/add-return" className="mt-4 px-4 py-2 bg-blue-600 rounded">
        Go to Add Return screen
      </Link>
    </View>
  );
}
