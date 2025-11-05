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
      className="bg-light-card dark:bg-dark-card mx-4 mb-4 p-6 rounded-2xl shadow-xl border border-light-border dark:border-dark-border active:opacity-80"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8, // Android shadow
      }}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-light-foreground dark:text-dark-foreground flex-1">
          {item.tracking}
        </Text>
        <View className="bg-light-primary dark:bg-dark-primary px-3 py-2 rounded-xl">
          <Text className="text-xs text-light-primary-foreground dark:text-dark-primary-foreground font-semibold">
            {item.store.name}
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <View className="bg-light-background-secondary dark:bg-dark-background-secondary px-3 py-2 rounded-lg border border-light-primary dark:border-dark-primary self-start">
          <Text className="text-sm text-light-foreground dark:text-dark-foreground font-medium">
            {item.channel.name}
          </Text>
        </View>
      </View>

      <View className="mt-2 pt-3 border-t border-light-border dark:border-dark-border">
        <Text className="text-xs text-light-foreground-muted dark:text-dark-foreground-muted font-medium mb-1">
          Created: {formatDate(item.created_at)}
        </Text>
        {item.created_at !== item.updated_at && (
          <Text className="text-xs text-light-foreground-muted dark:text-dark-foreground-muted font-medium">
            Updated: {formatDate(item.updated_at)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
