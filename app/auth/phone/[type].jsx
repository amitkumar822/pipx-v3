import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { PhoneAuthStepOne } from "../../../src/components/helper/extra/phoneauth/PhoneAuthStepOne";
import { PhoneAuthStepTwo } from "../../../src/components/helper/extra/phoneauth/PhoneAuthStepTwo";
import AddressForm from "@/src/components/user_details/AddressForm";
import UserAgentDetailsForm from "@/src/components/user_details/UserAgentDetailsForm";
import { StepFour } from "@/src/components/helper/extra/StepFour";
import { StepFive } from "@/src/components/helper/extra/StepFive";
import { StepThree } from "@/src/components/helper/extra/StepThree";
import { AppStatusBar } from "@/src/components/utils/AppStatusBar";

export default function EmailAuth() {
  const { type } = useLocalSearchParams();
  const [step, setStep] = useState(1);

  // 🔹 Handle Android hardware back
  useEffect(() => {
    const backAction = () => {
      if (step > 1) {
        if (type === "login") {
          setStep(1);
        } else {
          setStep((prev) => prev - 1);
        }
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [step]);

  if (type === "login") {
    return (
      <View style={styles.emailcontainer}>
        <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
        {step === 1 ? (
          <PhoneAuthStepOne
            type={type}
            step={step}
            setStep={setStep}
            loginType="phone"
          />
        ) : (
          <></>
        )}
        {step === 4 ? (
          <StepFour type={type} setStep={setStep} step={2} loginType="phone" />
        ) : (
          <></>
        )}
      </View>
    );
  }

  return (
    <View style={styles.emailcontainer}>
      <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      {step === 1 ? (
        <PhoneAuthStepOne type={type} step={step} setStep={setStep} />
      ) : (
        <></>
      )}
      {step === 2 ? (
        <PhoneAuthStepTwo type={type} step={step} setStep={setStep} />
      ) : (
        <></>
      )}

      {step === 3 ? (
        <StepThree type={type} step={step} setStep={setStep} />
      ) : (
        <></>
      )}

      {step === 4 ? (
        <StepFour type={type} step={step} setStep={setStep} />
      ) : (
        <></>
      )}
      {step === 5 ? (
        <StepFive type={type} step={step} setStep={setStep} />
      ) : (
        <></>
      )}

      {step === 6 ? (
        <UserAgentDetailsForm step={step} setStep={setStep} />
      ) : (
        <></>
      )}
      {step === 7 ? (
        <AddressForm step={step} registrationType="mobile" setStep={setStep} />
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emailcontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
