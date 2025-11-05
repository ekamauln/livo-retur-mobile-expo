import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';

interface DropdownItem {
  id: number;
  code: string;
  name: string;
}

interface SimpleDropdownProps {
  label: string;
  placeholder: string;
  value?: DropdownItem | null;
  onValueChange: (item: DropdownItem | null) => void;
  fetchItems: () => Promise<DropdownItem[]>;
  error?: string;
}

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  label,
  placeholder,
  value,
  onValueChange,
  fetchItems,
  error,
}) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectItem = (item: DropdownItem) => {
    onValueChange(item);
    setModalVisible(false);
    setSearchQuery('');
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <Pressable
      onPress={() => handleSelectItem(item)}
      className="mx-4 my-1 px-4 py-3 bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border shadow-sm active:opacity-70"
    >
      <Text className="text-light-foreground dark:text-dark-foreground font-medium">{item.name}</Text>
      <Text className="text-light-foreground-muted dark:text-dark-foreground-muted text-sm">{item.code}</Text>
    </Pressable>
  );

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-light-foreground dark:text-dark-foreground mb-2">{label}</Text>
      
      <Pressable
        onPress={() => setModalVisible(true)}
        className={`border rounded-xl px-4 py-3 bg-light-input dark:bg-dark-input shadow-lg ${
          error 
            ? 'border-light-destructive dark:border-dark-destructive' 
            : 'border-light-border dark:border-dark-border'
        }`}
      >
        {value ? (
          <View>
            <Text className="text-light-foreground dark:text-dark-foreground font-medium">{value.name}</Text>
            <Text className="text-light-foreground-muted dark:text-dark-foreground-muted text-sm">{value.code}</Text>
          </View>
        ) : (
          <Text className="text-light-foreground-muted dark:text-dark-foreground-muted">{placeholder}</Text>
        )}
      </Pressable>

      {error && (
        <Text className="text-light-destructive dark:text-dark-destructive text-sm mt-1">{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-light-background dark:bg-dark-background">
          {/* Header */}
          <View className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border shadow-lg">
            <View className="flex-row items-center justify-between p-4">
              <Text className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">Select {label}</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-3 py-1 rounded-lg bg-light-secondary dark:bg-dark-secondary"
              >
                <Text className="text-light-primary dark:text-dark-primary font-medium">Cancel</Text>
              </Pressable>
            </View>
          </View>

          {/* Search */}
          <View className="p-4 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
            <TextInput
              className="border border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input rounded-xl px-4 py-3 text-light-foreground dark:text-dark-foreground shadow-sm"
              placeholder={`Search ${label.toLowerCase()}...`}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* List */}
          {loading ? (
            <View className="flex-1 justify-center items-center p-8">
              <View className="bg-light-card dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-light-border dark:border-dark-border">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-light-foreground dark:text-dark-foreground mt-3 text-center font-medium">Loading...</Text>
              </View>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              className="flex-1 bg-light-background dark:bg-dark-background"
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center p-8">
                  <View className="bg-light-card dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-light-border dark:border-dark-border">
                    <Text className="text-light-foreground-muted dark:text-dark-foreground-muted text-center">
                      {searchQuery ? 'No items found matching your search' : 'No items available'}
                    </Text>
                  </View>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
};