import { Text, View } from "react-native";
import React, { useCallback, useEffect, useState, useMemo, memo } from "react";
import { AgentHomeScreen } from "../../screens/AgentHomeScreen";
import { useAllSignalPosts } from "@/src/hooks/useApi";
import debounce from "lodash/debounce";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = memo(() => {
  // pagination state
  const [page, setPage] = useState(1);
  const perPage = 10; // Set your desired per page value here
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // This hook fetches the signal posts of the agent in home screen
  const {
    data: signalPostsData,
    isLoading: isSignalPostsLoading,
    error: signalPostsError,
    refetch,
    isFetching: isFetchingSignalPosts,
  } = useAllSignalPosts(
    {
      page,
      perPage,
    },
    {
      enabled: true, // Always enabled since this is the Agent Signals screen
    }
  );

  // Initialize component state on mount
  useEffect(() => {
    if (!isInitialized) {
      setPosts([]);
      setPage(1);
      setHasNextPage(true);
      setIsLoadingMore(false);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Memoize the posts update logic to prevent unnecessary re-renders
  useEffect(() => {
    
    if (signalPostsData?.data && Array.isArray(signalPostsData.data) && signalPostsData.data.length > 0) {
      if (page === 1) {
        setPosts(signalPostsData.data);
      } else {
        setPosts((prev) => {
          const newPosts = [...prev, ...signalPostsData.data];
          return newPosts;
        });
      }
      // Update hasNextPage based on API response
      setHasNextPage(!!signalPostsData?.hasNextPage);
    } else {
      setPosts([]);
    }
  }, [signalPostsData, page, posts.length, isInitialized]);

  // Memoize the load more function to prevent recreation on every render
  const handleLoadMore = useCallback(
    debounce(() => {
      // Check if we have more pages and not currently loading
      if (hasNextPage && !isLoadingMore && !isSignalPostsLoading) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    }, 300),
    [hasNextPage, isLoadingMore, isSignalPostsLoading]
  );

  useEffect(() => {
    if (page > 1 && signalPostsData?.data?.length) {
      setIsLoadingMore(false);
    }
  }, [signalPostsData, page]);

  // Handle screen focus - refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isInitialized) {
        console.log("HomeScreen: Refreshing data on focus");
        setPage(1);
        setPosts([]);
        setHasNextPage(true);
        setIsLoadingMore(false);
        refetch();
      }
    }, [isInitialized, refetch])
  );

  // Memoize the AgentHomeScreen props to prevent unnecessary re-renders
  const agentHomeScreenProps = useMemo(() => ({
    signalPostsData: posts,
    signalPostsError,
    isLoading: isSignalPostsLoading,
    isFetching: isFetchingSignalPosts,
    refetch,
    page,
    setPage,
    isLoadingMore,
    hasNextPage,
    handleLoadMore,
  }), [posts, signalPostsError, isSignalPostsLoading, isFetchingSignalPosts, refetch, page, isLoadingMore, hasNextPage, handleLoadMore]);

  return <AgentHomeScreen {...agentHomeScreenProps} />;
});

export default HomeScreen;
