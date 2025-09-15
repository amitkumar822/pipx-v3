import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import NotificationCard from "../helper/notification/NotificationCard";
import apiService from "../../services/api";
import { BackHeader } from "../helper/auth/BackHeader";
import NoNotifications from "../helper/animation/NoFoundNotification";
import { useDeleteNotification } from "@/src/hooks/useApi";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

let perPage = 25;
export default function NotificationScreen() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (pageNum = 1, isRefresh = false) => {
    // Don't make API call if we've reached the last page and it's not a refresh
    if (!isRefresh && !hasNextPage && pageNum > 1) {
      return;
    }

    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await apiService.getNotifications(pageNum, perPage);

      if (response.statusCode === 200 && response.data) {
        if (pageNum === 1 || isRefresh) {
          setNotifications(response.data);
        } else {
          setNotifications(prev => [...prev, ...response.data]);
        }

        // Check if there are more pages
        setHasNextPage(response.hasNextPage || false);
      } else {
        if (pageNum === 1) {
          setNotifications([]);
        }
        setHasNextPage(false);
      }
    } catch (error) {
      if (pageNum === 1) {
        setNotifications([]);
      }
      setHasNextPage(false);
      setError(error?.message || error?.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  };

  const { mutate: deleteNotificationMutation } = useDeleteNotification();

  const handleDeleteNotification = (notificationId) => {
    deleteNotificationMutation(notificationId, {
      onSuccess: () => {
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
        Toast.show({
          type: "success",
          text1: "Notification deleted successfully",
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Error deleting notification",
          text2: error.message || "Please try again later",
        });
      },
    });
  };

  const renderNotification = ({ item }) => (
    <NotificationCard
      key={item.id}
      notification={item}
      onDelete={handleDeleteNotification}
      onVisit={handleVisitNotification}
    />
  );

  const handleVisitNotification = (notification) => {
    if (notification.category === "like_unlike_post" || notification.category === "post_comment" || notification.category === "dislike_un_dislike_post") {
      const notificationPostId = notification.extra_data?.post_id;
      if (notificationPostId) {
        router.push({
          pathname: "(tabs)/notification/singal-post-view",
          params: { notificationPostId: notificationPostId }
        });
      }
    } else if (notification.category === "follow_request") {
      // Visit User Profile when user follow
      const signalProviderId = notification?.extra_data?.user_id;
      if (!signalProviderId) return;
      router.push({
        pathname: "/visitprofile",
        params: {
          id: String(signalProviderId),
          userType: "USER",
          backRoutePath: "/(tabs)/notification",
        },
      });
    }
  };

  const renderEmptyComponent = () => (
    <View className="min-w-full h-screen -top-28">
      <NoNotifications errorMessage={error} />
    </View>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasNextPage(true);
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasNextPage && notifications.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      );
    }

    if (!hasNextPage && notifications.length > 0) {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>You've reached the end - no more data</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container} className="bg-gray-50">
      <BackHeader
        style={{ backgroundColor: "#FFFFFF" }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.notifcontainer}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  notifcontainer: {
    flexGrow: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMoreText: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  endMessage: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  endMessageText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});
