import { View, FlatList, ActivityIndicator, Text, StyleSheet } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useAssetBasedSignalPosts } from "@/src/hooks/useApi";
import SearchCard from "../helper/search/SearchCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import NoResultsFound from "../NoResultsFound";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import SearchCardSkeleton from "../helper/search/SearchCardSkeleton";

const perPage = 1000;

const AgentScreen = ({ assetId }) => {

  const [agentDetails, setAgentDetails] = useState([]);

  // ======= Pagination Logic =======
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: paginationData,
    isLoading,
    isFetching,
    error,
  } = useAssetBasedSignalPosts({
    assetId, page,
    perPage,
  });
  // Append new data to list only once per fetch for proper pagination
  useEffect(() => {
    if (paginationData?.statusCode === 200 && paginationData?.data?.length > 0) {
      if (page === 1) {
        setAgentDetails(paginationData.data);
      } else {
        setAgentDetails((prev) => [...prev, ...paginationData.data]);
      }
    }
    setHasNextPage(paginationData?.hasNextPage ?? false);
    setIsLoadingMore(false);
    setRefreshing(false);
  }, [paginationData, refreshing, page]);


  // Handle pagination trigger
  const handleLoadMore = () => {
    if (!isLoadingMore && hasNextPage && !isLoading) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  // Pull-to-refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasNextPage(false);
  };

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
