import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import apiService from "../../services/api";

export const NotificationBadge = ({ iconSize = 24, iconColor = "#666", focused = false }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchNotificationCount();
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData().catch((err) => console.error("Interval fetch failed:", err));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await apiService.getNotificationCount();

      if (response.statusCode === 200 && response.data) {
        setNotificationCount(response.data["Total count"] || 0);
      }
    } catch (error) {
      // Don't show error for notification count - fail silently
    }
  };

  const handlePress = () => {
    router.push("/notification");
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Ionicons 
        name={focused ? "notifications" : "notifications-outline"} 
        size={iconSize} 
        color={iconColor} 
      />
      {notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {notificationCount > 99 ? "99+" : notificationCount.toString()}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
