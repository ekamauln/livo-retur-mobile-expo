import React from "react";
import { Pressable, Text, View } from "react-native";
import { ReturnMobile } from "../lib/api/types";

interface ReturnCardProps {
  item: ReturnMobile;
  onPress?: (item: ReturnMobile) => void;
}

export const ReturnCard: React.FC<ReturnCardProps> = ({ item, onPress }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      className="bg-neutral-900 mx-4 mb-3 p-4 rounded-lg shadow-sm border border-neutral-500 active:bg-neutral-600"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-neutral-300 flex-1">
          {item.tracking}
        </Text>
        <View className="bg-neutral-100 px-2 py-1 rounded">
          <Text className="text-xs text-neutral-800 font-medium">
            {item.store.name}
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-md text-neutral-500 mb-1">
          {item.channel.name}
        </Text>
      </View>

      <View className="mt-2 pt-2 border-t border-neutral-500">
        <Text className="text-xs text-neutral-500 mb-1">
          Created: {formatDate(item.created_at)}
        </Text>
        {item.created_at !== item.updated_at && (
          <Text className="text-xs text-neutral-500">
            Updated: {formatDate(item.updated_at)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
