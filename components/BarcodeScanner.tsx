import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  visible: boolean;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  visible,
  onClose,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
    onScan(data);
    onClose();

    // Reset scanned state after a delay
    setTimeout(() => setScanned(false), 2000);
  };

  if (hasPermission === null) {
    return null;
  }

  if (hasPermission === false) {
    Alert.alert("Camera Permission", "No access to camera");
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="absolute inset-0">
        <CameraView
          className="absolute inset-0"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "qr",
              "pdf417",
              "code128",
              "code39",
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
            ],
          }}
        />

        {/* Full screen overlay with cutout for scanning area */}
        <View className="absolute inset-0 bg-transparent">
          {/* Header */}
          <View className="flex-row justify-between items-center px-5 pt-16 pb-5">
            <View className="bg-light-card/80 dark:bg-dark-card/80 px-4 py-2 rounded-2xl backdrop-blur-lg border border-light-border/50 dark:border-dark-border/50 shadow-2xl">
              <Text className="text-light-foreground dark:text-dark-foreground text-lg font-semibold">
                Scan Barcode or QR Code
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-12 h-12 rounded-2xl bg-light-card/80 dark:bg-dark-card/80 justify-center items-center backdrop-blur-lg border border-light-border/50 dark:border-dark-border/50 shadow-2xl active:opacity-70"
            >
              <Text className="text-light-foreground dark:text-dark-foreground text-xl font-bold">
                ✕
              </Text>
            </Pressable>
          </View>

          {/* Scanning frame with overlay */}
          <View className="flex-1 justify-center items-center">
            {/* Semi-transparent overlays */}
            <View className="flex-1" />
            <View className="flex-row h-64">
              <View className="flex-1" />
              <View className="w-64 h-64 relative border-0 bg-transparent">
                {/* Corner indicators with glassmorphism */}
                <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-light-primary dark:border-dark-primary rounded-tl-lg" />
                <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-light-primary dark:border-dark-primary rounded-tr-lg" />
                <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-light-primary dark:border-dark-primary rounded-bl-lg" />
                <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-light-primary dark:border-dark-primary rounded-br-lg" />

                {/* Scanning line with glow effect */}
                <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-light-primary dark:bg-dark-primary opacity-80 shadow-lg" />

                {/* Glassmorphism frame overlay */}
                <View className="absolute inset-0 rounded-2xl border-2 border-light-primary/30 dark:border-dark-primary/30 bg-light-card/10 dark:bg-dark-card/10 backdrop-blur-sm" />
              </View>
              <View className="flex-1" />
            </View>
            <View className="flex-1" />
          </View>

          {/* Instructions with glassmorphism */}
          <View className="px-10 pb-16 items-center">
            <View className="bg-light-card/80 dark:bg-dark-card/80 px-6 py-4 rounded-2xl backdrop-blur-lg border border-light-border/50 dark:border-dark-border/50 shadow-2xl">
              <Text className="text-light-foreground dark:text-dark-foreground text-base text-center font-medium mb-2">
                Position the barcode or QR code within the frame
              </Text>
              {scanned && (
                <Text className="text-light-primary dark:text-dark-primary text-base font-semibold text-center">
                  Scanned successfully!
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
