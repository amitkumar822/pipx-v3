import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../src/store/AuthContext";
import HomeScreen from "@/src/components/helper/home/HomeScreen";
import { AppStatusBar } from "@/src/components/utils/AppStatusBar";
import { useSignalProviderProfile, useUserProfile } from "@/src/hooks/useApi";
import { useUserProvider } from "@/src/context/user/userContext";

export default function Home() {
  const { userType } = useContext(AuthContext);
  const { setProfile } = useUserProvider();

  if (userType === "USER") {
    const { data: profile } = useUserProfile();
    if (profile) {
      useEffect(() => {
        setProfile(profile?.data);
      }, [profile]);
    }
  }

  if (userType === "SIGNAL_PROVIDER") {
    const { data: agentProfile } = useSignalProviderProfile();
    if (agentProfile) {
      useEffect(() => {
        setProfile(agentProfile?.data);
      }, [agentProfile]);
    }
  }

  if (userType === "USER") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: "#FFF" }}>
        <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <HomeScreen />
      </View>
    );
  }

  if (userType === "SIGNAL_PROVIDER") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: "#FFF" }}>
        <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <HomeScreen />
      </View>
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
