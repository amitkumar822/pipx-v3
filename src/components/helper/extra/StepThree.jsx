import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthHeader } from "../auth/AuthHeader";
import Entypo from "@expo/vector-icons/Entypo";
import Buttons from "../../user_details/helper/Buttons";
import { useUserProvider } from "@/src/context/user/userContext";
import { SafeAreaView } from "react-native-safe-area-context";


const validateUsername = (value) => {
  const u = value.trim();
  if (!u) return "Please enter a username";
  if (u.length < 4) return "Username must be at least 4 characters";
  if (/\s/.test(u)) return "No spaces allowed";
  if (!/^[a-z]/.test(u)) return "Must start with a letter";
  if (!/^[a-z0-9]+$/.test(u)) return "Use only lowercase letters and numbers";
  return null;
};

export const StepThree = ({ type, step, setStep }) => {
  const { setUsername } = useUserProvider();

  const [userName, setUserName] = useState("");
  const [showError, setShowError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowError(validateUsername(userName) !== null);
    setErrMsg(validateUsername(userName) || "");
  }, [userName]);

  const handleUserNextPage = () => {
    const uName = userName.trim();
    const error = validateUsername(uName);
    if (error) {
      setShowError(true);
      setErrMsg(error);
      return;
    }

    if (!uName) {
      Alert.alert("Please file username");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setUsername(uName);
      setLoading(false);
      setStep(4);
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingBottom: 10 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <View style={styles.mainsection}>
          <View style={styles.topsection}>
            {/* Back button */}
            <AuthHeader step={step - 1} setStep={setStep} />

            <View style={styles.mailsign}>
              <Entypo name="email" size={40} color="#D7D7D7" />
            </View>
            <View style={styles.mailtitle}>
              {type === "signup" ? (
                <Text style={styles.mailtitletxt}>Choose a username</Text>
              ) : (
                <Text></Text>
              )}
            </View>
            <View style={styles.mailsubtitle}>
              {type === "signup" ? (
                <Text style={styles.mailsubtitletxt}>
                  Enter your desired username
                </Text>
              ) : (
                <Text></Text>
              )}
            </View>
            <View style={styles.emailinputwrap}>
              <TextInput
                style={styles.emailinput}
                onChangeText={(text) => {
                  const lowerText = text.toLocaleLowerCase().trim();
                  setUserName(lowerText);
                  setShowError(validateUsername(lowerText) !== null);
                  setErrMsg(validateUsername(lowerText) || "");
                }}
                value={userName}
                placeholder="username"
                keyboardType="default"
                placeholderTextColor="#797979"
              />
            </View>
            {showError ? (
              <View style={styles.errmsg}>
                <Text style={styles.errmsgtxt}>{errMsg}</Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={styles.bottomsection}>
          <Buttons onPress={handleUserNextPage} isLoading={loading} disabled={!userName || showError} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainsection: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  topsection: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 12,
    paddingTop: 10,
  },
  mailsign: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 21,
  },
  mailtitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 21,
  },
  mailtitletxt: {
    fontSize: 24,
    fontWeight: "700",
  },
  mailsubtitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 21,
  },
  mailsubtitletxt: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: "#797979",
  },
  emailinputwrap: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 21,
  },
  emailinput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 5,
    borderColor: "#007AFF",
    borderWidth: 1,
    bordeRadius: 14,
    fontSize: 16,
    color: "#000000",
  },
  bottomsection: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 21,
  },
  continuebtn: {
    width: "100%",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 20,
    borderColor: "#007AFF",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  btntxt: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errmsg: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 21,
  },
  errmsgtxt: {
    fontSize: 16,
    fontWeight: "400",
    color: "#FF0000",
  },
});
