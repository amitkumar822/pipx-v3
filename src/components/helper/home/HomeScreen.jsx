import React, { useCallback, useEffect, useState, useMemo, memo } from "react";
import { AgentHomeScreen } from "../../screens/AgentHomeScreen";
import { useAllSignalPosts } from "@/src/hooks/useApi";
import debounce from "lodash/debounce";

const HomeScreen = () => {

  // pagination state
  const [page, setPage] = useState(1);
  let perPage = 20; // Set your desired per page value here
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState([]);

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
    }
  );

  useEffect(() => {
    if (signalPostsData?.data) {
      if (page === 1) {
        setPosts(signalPostsData.data); // fresh
      } else {
        setPosts((prev) => [...prev, ...signalPostsData.data]);
      }
      // Update hasNextPage based on API response
      setHasNextPage(!!signalPostsData?.hasNextPage);
    }
  }, [signalPostsData?.data, page]);

  const handleLoadMore = useCallback(
    debounce(() => {
      // Check if we have more pages and not currently loading
      if (hasNextPage && !isLoadingMore && !isSignalPostsLoading) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    }, 300),
    [hasNextPage, isLoadingMore, isSignalPostsLoading, page]
  );

  useEffect(() => {
    if (page > 1 && signalPostsData?.data?.length) {
      setIsLoadingMore(false);
    }
  }, [signalPostsData, page]);

  return (
    <AgentHomeScreen
      signalPostsData={posts}
      signalPostsError={signalPostsError}
      isLoading={isSignalPostsLoading}
      isFetching={isFetchingSignalPosts}
      refetch={refetch}
      setPage={setPage}
      isLoadingMore={isLoadingMore}
      hasNextPage={hasNextPage}
      handleLoadMore={handleLoadMore}
    />
  );
};

export default HomeScreen;
