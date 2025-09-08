import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface NoInternetWrapperProps {
  children: React.ReactNode;
}

export const NoInternetWrapper: React.FC<NoInternetWrapperProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);

      Animated.timing(fadeAnim, {
        toValue: connected ? 0 : 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });

    return () => unsubscribe();
  }, [fadeAnim]);

  return (
    <View style={{ flex: 1 }}>
      {children}
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] },
        ]}
      >
        <MaterialIcons name="wifi-off" size={24} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.text}>
          ⚠️ No Internet Connection
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: width * 0.05,
    width: width * 0.9,
    backgroundColor: "#ff4d4d",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 999,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
});
