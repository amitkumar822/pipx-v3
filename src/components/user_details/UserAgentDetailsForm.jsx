import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import TextField from "./helper/TextField";
import Buttons from "./helper/Buttons";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useUserProvider } from "@/src/context/user/userContext";
import { AuthHeader } from "../helper/auth/AuthHeader";
import FileUploadField from "./helper/FileUploadField";
import { SafeAreaView } from "react-native-safe-area-context";

const UserAgentDetailsForm = ({ setStep, step }) => {
  const { setUserAgentDetails, regRoleType } = useUserProvider();

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    document: null,
  });

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      setDate(selectedDate);

      // ✅ Format date as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      setUserDetails({ ...userDetails, birthday: formattedDate });
    }
  };

  const [loading, setLoading] = useState(false);

  const requiredFields =
    regRoleType === "SIGNAL_PROVIDER"
      ? ["firstName", "lastName", "birthday", "gender", "document"]
      : ["firstName", "lastName", "birthday", "gender"];

  const isFormValid = requiredFields.every((key) => {
    const value = userDetails[key];
    return value && (typeof value !== "string" || value.trim().length > 0);
  });

  // handle Submit
  const handleUserDetailsSubmit = async () => {
   
    if (!isFormValid) {
      Alert.alert("All fields are required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setUserAgentDetails(userDetails);
      setStep(7);
      setLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: 10 }}>
        <AuthHeader step={step - 2} setStep={setStep} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <FontAwesome name="vcard-o" size={28} color="gray" />
            <Text style={styles.title}>Your details</Text>
          </View>

          <View style={styles.form}>
            <TextField
              placeholder="First name"
              value={userDetails.firstName}
              onChangeText={(text) =>
                setUserDetails({ ...userDetails, firstName: text })
              }
              
            />

            <TextField
              placeholder="Last name"
              value={userDetails.lastName}
              onChangeText={(text) =>
                setUserDetails({ ...userDetails, lastName: text })
              }
              
            />

            {/* 🎯 Birthday - Touchable Date Picker */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextField
                placeholder="Birthday (mm/dd/yyyy)"
                value={userDetails.birthday}
                editable={false}
                
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* 🎯 Gender Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userDetails.gender}
                onValueChange={(value) =>
                  setUserDetails({ ...userDetails, gender: value })
                }
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>

            {regRoleType === "SIGNAL_PROVIDER" && (
              <FileUploadField
                onFileSelect={(file) =>
                  setUserDetails({ ...userDetails, document: file })
                }
                
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed bottom section outside KeyboardAvoidingView */}
      <View style={styles.bottomSection}>
        <Buttons onPress={handleUserDetailsSubmit} isLoading={loading} disabled={!isFormValid} />
      </View>
    </SafeAreaView>
  );
};

export default UserAgentDetailsForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 5,
    width: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
    marginBottom: 16,
  },
  form: {
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  bottomSection: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FFF",
  },
  confirmPasswordContainer: {
    position: "relative",
  },
  confirmIcon: {
    position: "absolute",
    top: "25%",
    right: "5%",
  },
});
