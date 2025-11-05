import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReturnCard } from "../components/ReturnCard";
import { returnMobileApi } from "../lib/api/returnMobileApi";
import { ReturnMobile } from "../lib/api/types";

export default function App() {
  const router = useRouter();
  const [returns, setReturns] = useState<ReturnMobile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchReturns = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      try {
        if (page === 1 && !reset) {
          setLoading(true);
        } else if (page > 1) {
          setLoadingMore(true);
        }

        const response = await returnMobileApi.fetchReturns({
          page,
          limit: 10,
          search: debouncedSearch || undefined,
        });

        if (response.success) {
          const newReturns = response.data.return_mobiles;
          const totalPages = Math.ceil(
            response.data.pagination.total / response.data.pagination.limit
          );

          if (reset || page === 1) {
            setReturns(newReturns);
          } else {
            setReturns((prev) => [...prev, ...newReturns]);
          }

          setHasMore(page < totalPages);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Error fetching returns:", error);
        Alert.alert("Error", "Failed to fetch returns. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [debouncedSearch]
  );

  // Reset and fetch when search changes
  useEffect(() => {
    if (debouncedSearch !== searchText) return;

    setReturns([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchReturns(1, true);
  }, [debouncedSearch, searchText, fetchReturns]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchReturns(currentPage + 1);
    }
  }, [loadingMore, hasMore, currentPage, fetchReturns]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    fetchReturns(1, true);
  }, [fetchReturns]);

  const handleReturnPress = (item: ReturnMobile) => {
    Alert.alert(
      `${item.tracking}`,
      `Channel: ${item.channel.name}\nStore: ${item.store.name}`
    );
  };

  const renderItem = ({ item }: { item: ReturnMobile }) => (
    <ReturnCard item={item} onPress={handleReturnPress} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#059669" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View className="flex-1 items-center justify-center py-8 px-4">
        <View className="bg-light-card dark:bg-dark-card rounded-2xl p-8 border border-light-border dark:border-dark-border shadow-xl">
          <Text className="text-light-foreground dark:text-dark-foreground text-center text-lg font-semibold">
            {debouncedSearch
              ? "No returns found for your search"
              : "No returns found"}
          </Text>
          <Text className="text-light-foreground-muted dark:text-dark-foreground-muted text-center mt-2">
            {debouncedSearch
              ? "Try a different search term"
              : "Pull to refresh"}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchReturns(1);
  }, [fetchReturns]);

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <View
        className="bg-light-card dark:bg-dark-card mx-4 mt-2 mb-4 rounded-2xl border border-light-border dark:border-dark-border shadow-xl p-4"
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
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-light-foreground dark:text-dark-foreground">
            Returns
          </Text>
          <Pressable
            onPress={() => router.push("./add-return" as any)}
            className="px-6 py-3 bg-light-primary dark:bg-dark-primary rounded-xl active:opacity-80 shadow-lg"
          >
            <Text className="text-light-primary-foreground dark:text-dark-primary-foreground font-semibold">
              Add Return
            </Text>
          </Pressable>
        </View>
        <View className="relative">
          <TextInput
            className="bg-light-input dark:bg-dark-input px-4 py-4 rounded-xl text-light-foreground dark:text-dark-foreground border border-light-border dark:border-dark-border"
            placeholder="Search returns..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {loading && returns.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <View className="bg-light-card dark:bg-dark-card rounded-2xl p-8 border border-light-border dark:border-dark-border shadow-xl">
            <ActivityIndicator size="large" color="#059669" />
            <Text className="text-light-foreground-secondary dark:text-dark-foreground-secondary font-medium mt-4 text-center">
              Loading returns...
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={returns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3B82F6"]}
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            returns.length === 0 ? { flexGrow: 1 } : undefined
          }
          className="flex-1"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
