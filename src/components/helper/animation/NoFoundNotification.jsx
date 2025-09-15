import React from "react";
import { View, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const NoNotifications = ({errorMessage = "No Notifications Found"}) => {
  return (
    <SafeAreaView className="flex-1 w-full items-center justify-center">
      {/* Lottie Animation */}
      <LottieView 
        source={require("@/assets/animation/Notification_Bell.json")}
        autoPlay
        loop
        style={{ width: width * 0.7, height: width * 0.7 }}
      />
      
      {/* Text */}
      <Text className=" font-semibold text-gray-800 -mt-8" style={{
        fontSize: 17,
      }}>
        {errorMessage}
      </Text>
      <Text className=" text-gray-500 text-center mt-2" style={{
        fontSize: 13,
      }}>
        You’re all caught up! New notifications will appear here.
      </Text>
    </SafeAreaView>
  );
};

export default NoNotifications;
