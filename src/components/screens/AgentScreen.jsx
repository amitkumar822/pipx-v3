import { View, FlatList, ActivityIndicator, Text, StyleSheet } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useAssetBasedSignalPosts } from "@/src/hooks/useApi";
import SearchCard from "../helper/search/SearchCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import NoResultsFound from "../NoResultsFound";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import SearchCardSkeleton from "../helper/search/SearchCardSkeleton";

const perPage = 30;

const AgentScreen = ({ currencyAssetId }) => {
  const insets = useSafeAreaInsets();
  const bottomHeight = insets.bottom === 0 ? 85 : insets.bottom;

  const [agentDetails, setAgentDetails] = useState([]);

  // ======= Pagination Logic =======
  const [page, setPage] = useState(1);

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: paginationData,
    isLoading,
    isFetching,
    isError,
    refetch,
    error,
  } = useAssetBasedSignalPosts({
    assetId: currencyAssetId, page,
    perPage,
  });


  const hasNextPage = paginationData?.hasNextPage ?? false;

  // Append new data to list only once per fetch for proper pagination
  useEffect(() => {
    if (paginationData?.data?.length && !refreshing) {
      if (page === 1) {
        // First page - replace all data
        setAgentDetails(paginationData.data);
      } else {
        // Subsequent pages - append new data and prevent duplicates
        setAgentDetails((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = paginationData.data.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [paginationData, page, refreshing]);

  // Handle pagination trigger
  const handleLoadMore = () => {
    if (!isFetching && hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setPage(1); // Reset to first page
      setAgentDetails([]); // Clear current data
      await refetch();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to refresh data.",
      });
    } finally {
      // Delay to show smooth refresh animation
      setTimeout(() => {
        setRefreshing(false);
      }, 300);
    }
  }, [refetch]);

  //! ======= Pagination Logic End =======


  if (isLoading && page === 1) {
    return (
      <GestureHandlerRootView style={{ flex: 1, paddingHorizontal: 10 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {Array.from({ length: 30 }).map((_, index) => (
            <SearchCardSkeleton key={index} />
          ))}
        </ScrollView>
      </GestureHandlerRootView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={agentDetails}
        renderItem={({ item }) => (
          <SearchCard searchData={item} nameDisplay={true} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingBottom: bottomHeight,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        // Pull-to-refresh functionality
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isFetching && !refreshing ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="gray" />
            </View>
          ) : !hasNextPage && agentDetails.length > 0 ? (
            <Text className="text-center text-gray-400 mb-2 py-2">
              🎉 You've seen all agents
            </Text>
          ) : null
        }
        ListEmptyComponent={() => <NoResultsFound />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
});

export default AgentScreen;
