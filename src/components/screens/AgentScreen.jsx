import { View, FlatList, ActivityIndicator, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useAssetBasedSignalPosts } from "@/src/hooks/useApi";
import SearchCard from "../helper/search/SearchCard";
import NoResultsFound from "../NoResultsFound";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import SearchCardSkeleton from "../helper/search/SearchCardSkeleton";
import { useBackHandler } from "@/src/utils/useBackHandler";

const perPage = 20;

const AgentScreen = ({ assetId }) => {
  // Back handler for the home screen when back button is pressed
  useBackHandler("/by-currency", "/", assetId);

  const [agentDetails, setAgentDetails] = useState([]);

  // ======= Pagination Logic =======
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
    if (paginationData?.statusCode === 200) {
      if (page === 1) {
        setAgentDetails(paginationData.data || []);
      } else {
        setAgentDetails((prev) => [...prev, ...(paginationData.data || [])]);
      }
      setHasNextPage(paginationData?.hasNextPage ?? false);
      setIsInitialLoad(false);
    }
    setIsLoadingMore(false);
    setRefreshing(false);
  }, [paginationData, page, refreshing]);

  // Auto-load more data if initial load doesn't fill the screen
  useEffect(() => {
    if (!isInitialLoad && hasNextPage && !isLoading && !isLoadingMore && agentDetails.length < 10) {
      // If we have less than 10 items and there's more data available, load more
      handleLoadMore();
    }
  }, [isInitialLoad, hasNextPage, isLoading, isLoadingMore, agentDetails.length]);


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
    setHasNextPage(true);
    setIsInitialLoad(true);
    setAgentDetails([]);
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

  if(error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>{error?.message || "An error occurred while loading data"}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={agentDetails}
        renderItem={({ item }) => (
          <SearchCard 
            searchData={item} 
            nameDisplay={true} 
            backRoutePath={"/agent"} 
            currencyAssetId={assetId}
          />
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
