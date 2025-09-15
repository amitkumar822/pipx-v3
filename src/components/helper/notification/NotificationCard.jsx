import React from "react";
import { View, Text, Pressable, Image, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AppImage } from "../../utils/AppImage";
import { format, isToday, isYesterday } from "date-fns";
import { useDeleteNotification } from "@/src/hooks/useApi";

const NotificationCard = ({ notification, onDelete, onVisit }) => {
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);

      if (isToday(date)) {
        return format(date, "h:mm a");
      } else if (isYesterday(date)) {
        return "Yesterday";
      } else {
        return format(date, "dd MMM yyyy");
      }
    } catch {
      return "Just now";
    }
  };

  // Notification metadata
  const sender = notification?.sender_first_name + " " + notification?.sender_last_name;
  const content = notification?.description || notification?.message || "New notification";


  const handleDelete = () => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete?.(notification.id);
          },
        },
      ]
    );
  };

  const handleVisitNotification = () => {
    onVisit?.(notification);
  };

  return (
    <Pressable
      onPress={handleVisitNotification}
      onLongPress={handleDelete}
      delayLongPress={500}
      className="min-w-full px-4 py-3 border-b border-gray-300"
      style={{
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Header with avatar and sender info */}
      <View className="flex-row items-start w-full">
        {/* sender_image */}
        <View className="w-10 h-10 rounded-full bg-blue-50 mr-3 flex items-center justify-center overflow-hidden">
          {notification?.sender_image ? (
            <AppImage
              uri={notification.sender_image}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <MaterialIcons name="person" size={16} color="#0073b1" />
          )}
        </View>

        {/* Sender and time */}
        <View className="flex-1">
          <View className="flex-row items-center flex-wrap">
            <Text className="font-semibold text-gray-900 capitalize" style={{ fontSize: 14 }}>
              {sender}
            </Text>
            <Text className="text-gray-500 ml-1" style={{ fontSize: 12 }}>
              • {formatTime(notification?.notification_time)}
            </Text>
          </View>
        </View>

        {/* Delete button */}
        {/* <Pressable onPress={handleDelete}>
          <MaterialIcons name="delete" size={18} color="#e0414c" />
        </Pressable> */}
      </View>

      {/* Notification content */}
      <View className="mb-1 -mt-3 mx-[52px]">
        <Text className="text-gray-800 mb-1" style={{ fontSize: 14 }}>
          {content}
        </Text>
      </View>

    </Pressable>
  );
};

export default NotificationCard;
