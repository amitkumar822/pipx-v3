import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Modal } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoginComponent } from "../helper/auth/LoginComponent";
import { SignUpComponent } from "../helper/auth/SignUpComponent";

export const LoginScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handlePresentModalPress = useCallback((from) => {
    if (from === "login") {
      setIsSignUp(false);
    } else {
      setIsSignUp(true);
    }
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <>
      <GestureHandlerRootView style={styles.ghcontainer}>
        <View style={styles.conatiner}>
          <View style={styles.topsection}>
            <Text style={styles.text}>PipX Login</Text>
          </View>
          <View style={styles.bottomsection}>
            <View style={styles.titletxt}>
              <Text style={styles.headtxt} >Welcome to Pipx</Text>
              <Text style={styles.bodytxt}>
                To sign up, you need to be at least 18. Your birthday won’t be
                shared with other users.
              </Text>
            </View>
            <View style={styles.authinput}>
              <Pressable
                style={styles.login}
                onPress={() => handlePresentModalPress("login")}
              >
                <Text style={styles.logintxt}>Login</Text>
              </Pressable>
              <Pressable
                style={styles.signup}
                onPress={() => handlePresentModalPress("signup")}
              >
                <Text style={styles.signuptxt}>Signup</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <GestureHandlerRootView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.dragIndicator} />
              <View style={styles.headerContent}>
                <Text style={styles.modalTitle}>
                  {isSignUp ? "Sign Up" : "Login"}
                </Text>
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              </View>
            </View>
            {isSignUp ? <SignUpComponent /> : <LoginComponent />}
          </View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  ghcontainer: {
    flex: 1,
  },
  conatiner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
  topsection: {
    width: "100%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
  },
  bottomsection: {
    width: "100%",
    height: "40%",
    flexDirection: "column",
    gap: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  titletxt: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },
  headtxt: {
    color: "#1A1C29",
    fontFamily: "Poppins",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
  },
  bodytxt: {
    color: "#1A1C29",
    fontFamily: "Poppins",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    textAlign: "center",
  },
  authinput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  login: {
    width: "40%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 14,
    borderRadius: 14,
    marginTop: 20,
    borderColor: "#007AFF",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logintxt: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signup: {
    width: "40%",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 20,
    borderColor: "#007AFF",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signuptxt: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 1,
    maxHeight: "70%",
    paddingHorizontal: 10,
  },
  modalHeader: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 5,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    width: "80%",
    paddingLeft: "21%",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
});
