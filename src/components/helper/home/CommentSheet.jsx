import React, { useState, memo } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import CommentCard from "./CommentCard";
import {
  useDeleteComment,
  useGetReplyCommentMessage,
  useGetSignalPostComments,
} from "@/src/hooks/useApi";
import { useUserProvider } from "@/src/context/user/userContext";

const { height } = Dimensions.get("window");
const heightPercent = (percent) => (height * percent) / 100;

const CommentSheet = ({ signalPostId }) => {
  const { profile } = useUserProvider();

  // Fetch all comments when signalPostId changes
  const {
    data: allComments,
    isLoading: loading,
    error,
  } = useGetSignalPostComments(signalPostId, {
    enabled: !!signalPostId,
  });

  const [activeReplyTarget, setActiveReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Get Reply Comment Message for the active comment
  const { data: replyCommentMessage, isLoading: isReplyLoading } =
    useGetReplyCommentMessage(activeReplyTarget?.id, {
      enabled: !!activeReplyTarget?.id,
    });


  // Handle delete comment mutation hook
  const { mutate: deleteComment, isLoading: isDeleting } = useDeleteComment();

  // Handle long press to show delete alert
  const handleLongPress = (comment) => {
    if (comment?.user?.id !== profile?.id) {
      return;
    }
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          style: "destructive",
          onPress: () => handleDeleteComment(comment?.id),
        },
      ]
    );
  };

  // Handle delete comment
  const handleDeleteComment = (commentId) => {
    deleteComment(
      { commentId },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Comment deleted successfully",
          });
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Failed to delete comment",
            text2: error?.message || "Please try again later",
          });
        },
      }
    );
  };

  const renderComment = ({ item }) => (
    <CommentCard
      item={item}
      activeReplyTarget={activeReplyTarget}
      setActiveReplyTarget={setActiveReplyTarget}
      replyCommentMessage={replyCommentMessage}
      isLoading={isReplyLoading}
      replyText={replyText}
      setReplyText={setReplyText}
      handleLongPress={handleLongPress}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {loading && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#888" />
          </View>
        )}
        {error && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "gray", textAlign: "center" }}>
              {error?.response?.message ||
                "An error occurred while fetching comments."}
            </Text>
          </View>
        )}

        {!loading && !error && (
          <FlatList
            data={allComments?.data || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderComment}
            contentContainerStyle={{
              padding: 12,
              paddingBottom: heightPercent(20), // Adjust for keyboard
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default memo(CommentSheet);
