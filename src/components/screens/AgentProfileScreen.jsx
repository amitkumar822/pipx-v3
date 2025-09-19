import React, { useContext, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { ProfileHeader } from "../helper/profile/ProfileHeader";
import { ProfileBox } from "../helper/profile/ProfileBox";
import { useRouter } from "expo-router";
import { useLogout, useSignalProviderProfile } from "@/src/hooks/useApi";
import { AuthContext } from "@/src/store/AuthContext";
import { useUserProvider } from "@/src/context/user/userContext";
import { LoadingScreen } from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";

export const AgentProfileScreen = () => {
  const { setProfile } = useUserProvider();
  const { userType, logout } = useContext(AuthContext);
  const { data, loading, error, refetch } = useSignalProviderProfile();
  const router = useRouter();
  const logoutMutation = useLogout();

  const agentProfile = data?.data;

  useEffect(() => {
    if (agentProfile && userType === "SIGNAL_PROVIDER") {
      setProfile(agentProfile);
    }
  }, [agentProfile, userType]);

  const handleLogout = async () => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Execute the logout mutation (server-side logout)
              await logoutMutation.mutateAsync();

              // Always call the AuthContext logout to clear local state and storage
              await logout();

              // Navigate to auth screen
              router.push("/auth/login");
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen error={error} refetch={refetch} logout={handleLogout} />
    );
  }

  // User Stats data - make this dynamic later
  const statsAgentData = [
    {
      value: agentProfile?.post || "0",
      label: "Posts",
      onPress: () => router?.push("/profile/agentcheckpostview"),
    },
    {
      value: agentProfile?.followers || "0",
      label: "Followers",
      onPress: () => router?.push("/profile/userfollowers"),
    },
    {
      value: `${agentProfile?.success_rate}%` || "0%",
      label: "Success rate",
      onPress: () => { },
    },
    {
      value: `${agentProfile?.win_post}: ${agentProfile?.lose_post}` || "0:0",
      label: "Win/Loss ratio",
      onPress: () => { },
    },
    {
      value: agentProfile?.block_user_count || "0",
      label: "Blocked",
      onPress: () => router?.push("/profile/agentblock"),
    },
  ];

  return (
    <View style={styles.profilecontainer}>
      <ProfileHeader rightaction={handleLogout} />
      <ProfileBox profile={agentProfile} statsDataByRole={statsAgentData} userType={userType} />
    </View>
  );
};

const styles = StyleSheet.create({
  profilecontainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
