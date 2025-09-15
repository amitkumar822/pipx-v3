import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackHeader } from "@/src/components/helper/auth/BackHeader";
import { AgentHomeScreen } from "@/src/components/screens/AgentHomeScreen";
import { useLocalSearchParams } from 'expo-router';
import { useVisitNotificationLikeDisLikeComment } from '@/src/hooks/useApi';

const SingalPostView = () => {

    const { notificationPostId } = useLocalSearchParams();
    const { data: signalPostsData, isLoading, isFetching, refetch, error } = useVisitNotificationLikeDisLikeComment(notificationPostId);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <BackHeader />
            <AgentHomeScreen
                signalPostsData={signalPostsData?.data}
                signalPostsError={error}
                isLoading={isLoading}
                isFetching={isFetching}
                refetch={refetch}
                page={1}
                setPage={() => { }}
                isLoadingMore={false}
                hasNextPage={false}
                handleLoadMore={() => { }}
                signalOwnPostReportButtonHidde={true}
            />
        </SafeAreaView>
    )
}

export default SingalPostView
