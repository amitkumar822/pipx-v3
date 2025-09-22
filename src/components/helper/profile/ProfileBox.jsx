import React, { useContext, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import ReportBlockModal from "../ReportBlockModel";
import {
  useBlockUnblockSignalProvider,
  useSignalProviderBlockedUsers,
  useSignalProviderReportUser,
  useUserReportSignalProvider,
} from "@/src/hooks/useApi";
import { AppImage } from "../../utils/AppImage";
import Loading from "../../Loading";
import { AuthContext } from "@/src/store/AuthContext";
import { useUserProvider } from "@/src/context/user/userContext";
import { useBackHandler } from "@/src/utils/useBackHandler";

export const ProfileBox = ({ profile, statsDataByRole, visitType = false, backRoutePath }) => {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[f  Qoff7azayj[ayj[j[ayofayj[ayfjj[j[ayjuayj[";

  const { profile: loginCurrentProfile } = useUserProvider();

  const router = useRouter();
  const { userType } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  // Define constants for button logic
  const isCurrentUserProfile = !visitType;
  const isUserVisitingProfile = visitType && userType === "USER";
  const isSignalProviderVisitingUser = visitType && userType === "SIGNAL_PROVIDER" && profile?.user_type === "USER";
  const shouldShowMoreVertButton = isUserVisitingProfile || isSignalProviderVisitingUser;
  const shouldShowEditButton = isCurrentUserProfile;

  // Button handlers
  const handleMoreVertPress = () => {
    setModalType("both");
    setVisible(true);
  };

  const handleEditPress = () => {
    router.push("/profile/editprofile");
  };

  // Handle Android hardware back button using utility function
  useBackHandler(backRoutePath, "/");

  // User Block/Unblock Signal Provider hook
  const blockUnblockMutation = useBlockUnblockSignalProvider();

  // Signal Provider Blocked Users Hook
  const { mutate: signalProviderBlockedUsers } =
    useSignalProviderBlockedUsers();

  // Block & Unblock Signal Provider by USER
  const handleBlockUnblockSignalProvider = async () => {
    if (!profile?.id) {
      Alert.alert("Error", "Profile ID is missing.");
      return;
    }

    // console.log('====================================');
    // console.log("Profile: ", JSON.stringify(profile, null, 2));
    // console.log("Id: ", profile?.id);
    // console.log("User Type: ", userType);
    // console.log('====================================');

    if (userType === "SIGNAL_PROVIDER") {
      // Call the block/unblock mutation for SIGNAL_PROVIDER
      signalProviderBlockedUsers(profile?.id, {
        onSuccess: () => {
          setModalType("success");
          setTimeout(() => {
            router.push(backRoutePath);
          }, 500);
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error?.message || "Failed to block the signal provider."
          );
        },
      });
      return;
    } else if (userType === "USER") {
      // Call the block/unblock mutation for USER
      blockUnblockMutation.mutate(profile?.id, {
        onSuccess: () => {
          setModalType("success");
          setTimeout(() => {
            router.push(backRoutePath);
          }, 500);
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error?.message || "Failed to block the signal provider."
          );
        },
      });
      return;
    }
  };

  // User Report Signal Provider hook
  const { mutate: reportUserSignalProvider } = useUserReportSignalProvider();

  // Signal Provider Report User handler
  const { mutate: reportSignalProvider } = useSignalProviderReportUser();

  // Report User/Signal Provider handler
  const handleReportUserSignalProvider = () => {
    if (!profile?.id) {
      Alert.alert("Error", "Profile ID is missing.");
      return;
    }

    if (userType === "SIGNAL_PROVIDER") {
      reportSignalProvider(profile?.id, {
        onSuccess: (res) => {
          setModalType("success");
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error?.message || "Failed to report the signal provider."
          );
        },
      });
      return;
    } else if (userType === "USER") {
      reportUserSignalProvider(profile?.id, {
        onSuccess: (res) => {
          setModalType("success");
        },
        onError: (error) => {
          Alert.alert("Error", error?.message || "Failed to report the user.");
        },
      });
      return;
    }
  };

  const handlerObjectReportBlock = {
    handlerBlock: handleBlockUnblockSignalProvider,
    handlerReport: handleReportUserSignalProvider,
  };

  return (
    <View className="w-full">
      {!profile ? (
        <View className="w-full h-full justify-center items-center">
          <Loading />
        </View>
      ) : (
        <View className="w-full items-center">
          {/* Profile Header */}
          <View className="w-full relative h-20">
            {/* Header Background */}
            <LinearGradient
              colors={["#d3e8ff", "#e6f2ff"]}
              start={{ x: 0.1, y: 0.2 }}
              end={{ x: 0.1, y: 1.0 }}
              className="w-full h-20 relative"
            >
              {/* user name */}
              <View className="flex-1 justify-end px-4 pb-2 ">
                <View className="flex-row items-center justify-end gap-2">
                  <View className="w-[70%] px-2 py-1 rounded-lg">
                    <View
                      className={`flex-row flex-wrap items-center gap-x-2 ${visitType ? "justify-start" : "justify-end"}`}
                    >
                      <Text
                        className="text-black font-bold capitalize"
                        style={{
                          fontSize: 16,
                          flex: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {profile?.first_name} {profile?.last_name}
                      </Text>

                      <Text
                        className={`text-gray-600 font-medium ${visitType ? "hidden" : ""}`}
                        numberOfLines={1}
                        style={{ flexShrink: 1, fontSize: 13 }}
                      >
                        ({profile?.username})
                      </Text>
                    </View>
                  </View>
                  {shouldShowMoreVertButton && (
                    <Pressable
                      onPress={handleMoreVertPress}
                      className="p-1"
                    >
                      <MaterialIcons
                        name="more-vert"
                        size={22}
                        color="#7E7E7E"
                      />
                    </Pressable>
                  )}

                  {shouldShowEditButton && (
                    <Pressable
                      onPress={handleEditPress}
                      className="p-1"
                    >
                      <MaterialIcons name="edit" size={18} color="#7E7E7E" />
                    </Pressable>
                  )}
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Profile Image and Status */}
          <View className="w-full flex-row mt-2">
            {/* Profile Image */}
            <View className="items-center -mt-12 ml-2 mb-5 z-10">
              <View className="w-[72px] h-[100px] bg-white rounded-full justify-center items-center shadow border-2 border-white overflow-hidden">
                <AppImage
                  uri={profile?.profile_image}
                  contentFit="cover"
                  placeholder={{ blurhash }}
                  style={{
                    width: 72,
                    height: "100%",
                    borderRadius: 36,
                  }}
                />
              </View>
              <Text className="text-sm text-gray-600 font-medium mt-2">
                {profile?.user_type === "USER" ? "User" : "Agent"}
              </Text>
            </View>

            {/* Stats */}
            <View className="flex-1 px-2 mb-5">
              <View className="flex-row flex-wrap ">
                {(
                  statsDataByRole?.map((stat, index) => (
                    <Pressable
                      key={index}
                      onPress={stat.onPress}
                      className="w-1/3 px-1 mb-2"
                    >
                      <LinearGradient
                        colors={
                          profile?.user_type === "USER" &&
                            stat.label === "Blocked"
                            ? ["#ffeae8", "#ffeae8"]
                            : ["#d3e8ff", "#e6f2ff"]
                        }
                        start={{ x: 0.1, y: 0.2 }}
                        end={{ x: 0.1, y: 1.0 }}
                        className="rounded-lg overflow-hidden"
                      >
                        <View className=" rounded-xl py-3 justify-center items-center min-h-[60px]">
                          <Text
                            className={`font-bold mb-0.5 ${stat.label === "Success rate"
                              ? "text-green-500"
                              : "text-black"
                              }`}
                            style={{
                              fontSize: 16,
                            }}
                          >
                            {stat?.value ? String(stat.value) : "0"}
                          </Text>
                          <Text
                            className=" text-center"
                            style={{
                              fontSize: 9,
                              color: "#000",
                              fontWeight: "500",
                            }}
                          >
                            {stat?.label || "0"}
                          </Text>
                        </View>
                      </LinearGradient>
                    </Pressable>
                  ))) ||
                  null}
              </View>
            </View>
          </View>

          <ReportBlockModal
            visible={visible}
            userName={`${profile?.first_name} ${profile?.last_name}`}
            type={modalType}
            setModalType={setModalType}
            onClose={() => setVisible(false)}
            onAction={handlerObjectReportBlock}
          />
        </View>
      )}
    </View>
  );
};
