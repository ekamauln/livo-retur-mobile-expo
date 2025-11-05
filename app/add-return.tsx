import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarcodeScanner } from "../components/BarcodeScanner";
import { SimpleDropdown } from "../components/SimpleDropdown";
import { returnMobileApi } from "../lib/api/returnMobileApi";
import { CreateReturnRequest } from "../lib/api/types";

export default function AddReturn() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<{
    id: number;
    code: string;
    name: string;
  } | null>(null);
  const [selectedStore, setSelectedStore] = useState<{
    id: number;
    code: string;
    name: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    tracking?: string;
    channel?: string;
    store?: string;
  }>({});
  const [scannerVisible, setScannerVisible] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!tracking.trim()) {
      newErrors.tracking = "Tracking number is required";
    }

    if (!selectedChannel) {
      newErrors.channel = "Channel is required";
    }

    if (!selectedStore) {
      newErrors.store = "Store is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchStores = useCallback(async () => {
    try {
      console.log("Fetching stores...");
      const response = await returnMobileApi.fetchStores();
      console.log("Stores response:", JSON.stringify(response, null, 2));

      if (response.success) {
        // Handle different possible response structures
        let stores = [];
        if (response.data && response.data.stores) {
          stores = response.data.stores;
        } else if (Array.isArray(response.data)) {
          stores = response.data;
        } else {
          console.log("Unexpected stores response structure:", response);
          return [];
        }

        return stores.map((store: any) => ({
          id: store.id,
          code: store.code,
          name: store.name,
        }));
      }
      console.log("Stores response not successful:", response);
      return [];
    } catch (error) {
      console.error("Error fetching stores:", error);
      Alert.alert(
        "Error",
        `Failed to fetch stores: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }, []);

  const fetchChannels = useCallback(async () => {
    try {
      console.log("Fetching channels...");
      const response = await returnMobileApi.fetchChannels();
      console.log("Channels response:", JSON.stringify(response, null, 2));

      if (response.success) {
        // Handle different possible response structures
        let channels = [];
        if (response.data && response.data.channels) {
          channels = response.data.channels;
        } else if (Array.isArray(response.data)) {
          channels = response.data;
        } else {
          console.log("Unexpected channels response structure:", response);
          return [];
        }

        return channels.map((channel: any) => ({
          id: channel.id,
          code: channel.code,
          name: channel.name,
        }));
      }
      console.log("Channels response not successful:", response);
      return [];
    } catch (error) {
      console.error("Error fetching channels:", error);
      Alert.alert(
        "Error",
        `Failed to fetch channels: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }, []);

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const requestData: CreateReturnRequest = {
      tracking: tracking.trim(),
      channel_id: selectedChannel!.id,
      store_id: selectedStore!.id,
    };

    try {
      setSubmitting(true);
      const response = await returnMobileApi.createReturn(requestData);

      if (response.success) {
        Alert.alert("Success", "Return created successfully!", [
          {
            text: "OK",
            onPress: () => {
              setTracking("");
              setSelectedChannel(null);
              setSelectedStore(null);
              setErrors({});
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to create return");
      }
    } catch (error) {
      console.error("Error creating return:", error);
      Alert.alert("Error", "Failed to create return. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChannelChange = (
    channel: { id: number; code: string; name: string } | null
  ) => {
    setSelectedChannel(channel);
    if (errors.channel) {
      setErrors((prev) => ({ ...prev, channel: undefined }));
    }
  };

  const handleStoreChange = (
    store: { id: number; code: string; name: string } | null
  ) => {
    setSelectedStore(store);
    if (errors.store) {
      setErrors((prev) => ({ ...prev, store: undefined }));
    }
  };

  const handleTrackingChange = (text: string) => {
    setTracking(text);
    if (errors.tracking) {
      setErrors((prev) => ({ ...prev, tracking: undefined }));
    }
  };

  const handleBarcodeScan = (scannedData: string) => {
    setTracking(scannedData);
    if (errors.tracking) {
      setErrors((prev) => ({ ...prev, tracking: undefined }));
    }
    setScannerVisible(false);
  };

  const openScanner = () => {
    setScannerVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
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
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-light-foreground dark:text-dark-foreground">
              Add Return
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="px-4 py-2 bg-light-background-secondary dark:bg-dark-background-secondary rounded-xl border border-light-border dark:border-dark-border active:opacity-80"
            >
              <Text className="text-light-foreground dark:text-dark-foreground font-medium">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-xl p-6 mb-6"
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
            {/* Tracking Number Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                Tracking Number *
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  className={`flex-1 mr-3 bg-light-input dark:bg-dark-input border rounded-xl px-4 py-4 text-light-foreground dark:text-dark-foreground ${
                    errors.tracking
                      ? "border-light-error dark:border-dark-error"
                      : "border-light-border dark:border-dark-border"
                  }`}
                  placeholder="Enter tracking number"
                  placeholderTextColor="#9CA3AF"
                  value={tracking}
                  onChangeText={handleTrackingChange}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={openScanner}
                  className="bg-light-primary dark:bg-dark-primary border border-light-border dark:border-dark-border rounded-xl px-4 py-4 active:opacity-80 shadow-lg"
                >
                  <Ionicons name="barcode-sharp" size={20} color="white" />
                </Pressable>
              </View>
              {errors.tracking && (
                <Text className="text-light-error dark:text-dark-error text-sm mt-2 font-medium">
                  {errors.tracking}
                </Text>
              )}
            </View>

            {/* Channel Dropdown */}
            <View className="mb-3">
              <SimpleDropdown
                label="Channel *"
                placeholder="Select a channel"
                value={selectedChannel}
                onValueChange={handleChannelChange}
                fetchItems={fetchChannels}
                error={errors.channel}
              />
            </View>

            {/* Store Dropdown */}
            <View>
              <SimpleDropdown
                label="Store *"
                placeholder="Select a store"
                value={selectedStore}
                onValueChange={handleStoreChange}
                fetchItems={fetchStores}
                error={errors.store}
              />
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className="px-4 mb-4">
          <View
            className="bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-xl p-6"
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
            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              className={`rounded-xl py-4 items-center shadow-lg ${
                submitting
                  ? "bg-light-background-muted dark:bg-dark-background-muted"
                  : "bg-light-primary dark:bg-dark-primary active:opacity-80"
              }`}
            >
              {submitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-light-primary-foreground dark:text-dark-primary-foreground font-bold ml-2 text-lg">
                    Creating...
                  </Text>
                </View>
              ) : (
                <Text className="text-light-primary-foreground dark:text-dark-primary-foreground font-bold text-lg">
                  Create Return
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Barcode Scanner Modal */}
        <BarcodeScanner
          visible={scannerVisible}
          onScan={handleBarcodeScan}
          onClose={() => setScannerVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
