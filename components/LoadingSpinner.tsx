import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  text = 'Loading...',
}) => {
  const { colorScheme } = useColorScheme();
  
  // Use theme-aware colors
  const spinnerColor = colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'; // dark-primary : light-primary
  
  return (
    <View className="flex-1 items-center justify-center bg-light-background dark:bg-dark-background">
      <View className="bg-light-card dark:bg-dark-card rounded-2xl p-8 shadow-xl border border-light-border dark:border-dark-border">
        <ActivityIndicator size={size} color={spinnerColor} />
        {text && (
          <Text className="text-light-foreground dark:text-dark-foreground mt-3 text-center font-medium">
            {text}
          </Text>
        )}
      </View>
    </View>
  );
};