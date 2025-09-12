import React, { memo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppStatusBar } from "@/src/components/utils/AppStatusBar";
import SharedHeader from "./SharedHeader";

const ScreenWrapper = memo(({ children, backgroundColor = "#FFF" }) => {
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, backgroundColor }}>
      <AppStatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
      <SharedHeader />
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </SafeAreaView>
  );
});

ScreenWrapper.displayName = 'ScreenWrapper';

export default ScreenWrapper;
