import React, { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../src/store/AuthContext";
import HomeScreen from "@/src/components/helper/home/HomeScreen";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { AppStatusBar } from "@/src/components/utils/AppStatusBar";
import { useSignalProviderProfile, useUserProfile } from "@/src/hooks/useApi";
import { useUserProvider } from "@/src/context/user/userContext";

export default function Home() {
  const { userType } = useContext(AuthContext);
  const { setProfile } = useUserProvider();
  
  // Always call hooks at the top level, regardless of conditions
  const { data: userProfile } = useUserProfile();
  const { data: agentProfile } = useSignalProviderProfile();

  // Handle profile updates based on user type
  useEffect(() => {
    if (userType === "USER" && userProfile?.data) {
      setProfile(userProfile.data);
    } else if (userType === "SIGNAL_PROVIDER" && agentProfile?.data) {
      setProfile(agentProfile.data);
    }
  }, [userType, userProfile, agentProfile, setProfile]);

  // Render based on user type
  if (userType === "USER" || userType === "SIGNAL_PROVIDER") {
    return (
      <ScreenWrapper>
        <HomeScreen />
      </ScreenWrapper>
    );
  }

  // Default fallback for undefined or other user types
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <Text>Loading...</Text>
    </SafeAreaView>
  );
}
