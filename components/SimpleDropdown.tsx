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
      console.log(`Loading items for ${label}...`);
      setLoading(true);
      const fetchedItems = await fetchItems();
      console.log(`Fetched ${fetchedItems.length} items for ${label}`);
      setItems(fetchedItems);
    } catch (error) {
      console.error(`Error fetching items for ${label}:`, error);
    } finally {
      setLoading(false);
    }
  }, [fetchItems, label]);

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
      className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
    >
      <Text className="text-gray-900 font-medium">{item.name}</Text>
      <Text className="text-gray-500 text-sm">{item.code}</Text>
    </Pressable>
  );

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      
      <Pressable
        onPress={() => setModalVisible(true)}
        className={`border rounded-lg px-4 py-3 bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {value ? (
          <View>
            <Text className="text-gray-900 font-medium">{value.name}</Text>
            <Text className="text-gray-500 text-sm">{value.code}</Text>
          </View>
        ) : (
          <Text className="text-gray-500">{placeholder}</Text>
        )}
      </Pressable>

      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">Select {label}</Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              className="px-3 py-1"
            >
              <Text className="text-blue-600 font-medium">Cancel</Text>
            </Pressable>
          </View>

          {/* Search */}
          <View className="p-4 border-b border-gray-200">
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* List */}
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-500 mt-2">Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              className="flex-1"
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center p-8">
                  <Text className="text-gray-500 text-center">
                    {searchQuery ? 'No items found matching your search' : 'No items available'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
};