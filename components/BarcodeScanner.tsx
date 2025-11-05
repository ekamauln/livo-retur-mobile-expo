import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
  const { colorScheme } = useColorScheme();

  // Define theme colors based on current scheme
  const colors = {
    // Light theme colors
    light: {
      card: "#FFFFFF",
      background: "#F8FAFC",
      foreground: "#0F172A",
      primary: "#059669",
      primaryForeground: "#FFFFFF",
      border: "#D1D5DB",
    },
    // Dark theme colors
    dark: {
      card: "#1E293B",
      background: "#0F172A",
      foreground: "#F1F5F9",
      primary: "#34D399",
      primaryForeground: "#1E293B",
      border: "#374151",
    },
  };

  const currentColors = colors[colorScheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
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
      <View style={StyleSheet.absoluteFillObject}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
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
        <View style={styles.fullOverlay}>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.headerCard,
                {
                  backgroundColor: currentColors.card + "CC",
                  borderColor: currentColors.border + "80",
                },
              ]}
            >
              <Text
                style={[styles.headerTitle, { color: currentColors.primary }]}
              >
                Scan Barcode or QR Code
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: currentColors.card + "CC",
                  borderColor: currentColors.border + "80",
                },
              ]}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  { color: currentColors.primary },
                ]}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          {/* Scanning frame with overlay */}
          <View style={styles.scanFrame}>
            {/* Semi-transparent overlays to create cutout effect */}
            <View style={styles.overlayTop} />
            <View style={styles.overlayRow}>
              <View style={styles.overlaySide} />
              <View style={styles.scanningArea}>
                {/* Corner indicators */}
                <View
                  style={[
                    styles.scanCorner,
                    styles.topLeft,
                    { borderColor: currentColors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.scanCorner,
                    styles.topRight,
                    { borderColor: currentColors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.scanCorner,
                    styles.bottomLeft,
                    { borderColor: currentColors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.scanCorner,
                    styles.bottomRight,
                    { borderColor: currentColors.primary },
                  ]}
                />

                {/* Scanning line */}
                <View
                  style={[
                    styles.scanLine,
                    { backgroundColor: currentColors.primary },
                  ]}
                />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom} />
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <View
              style={[
                styles.instructionCard,
                {
                  backgroundColor: currentColors.card + "CC",
                  borderColor: currentColors.border + "80",
                },
              ]}
            >
              <Text
                style={[
                  styles.instructionText,
                  { color: currentColors.primary },
                ]}
              >
                Position the barcode or QR code within the frame
              </Text>
              {scanned && (
                <Text
                  style={[styles.scannedText, { color: currentColors.primary }]}
                >
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

const styles = StyleSheet.create({
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scanFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlayRow: {
    flexDirection: "row",
    height: 256,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scanningArea: {
    width: 256,
    height: 256,
    position: "relative",
    backgroundColor: "transparent",
  },
  scanCorner: {
    position: "absolute",
    width: 32,
    height: 32,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  instructions: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: "center",
  },
  instructionCard: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 8,
  },
  scannedText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
