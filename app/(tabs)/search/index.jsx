import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AgentSearchScreen from "@/src/components/helper/search/AgentSearchScreen";
import { AppStatusBar } from "@/src/components/utils/AppStatusBar";

export default function Search() {

  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF]">
      <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <AgentSearchScreen />
    </SafeAreaView>
  );
}
