import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { StepOne } from "../../../src/components/helper/extra/StepOne";
import { StepTwo } from "../../../src/components/helper/extra/StepTwo";
import { StepThree } from "../../../src/components/helper/extra/StepThree";
import { StepFour } from "../../../src/components/helper/extra/StepFour";
import { StepFive } from "../../../src/components/helper/extra/StepFive";
import UserAgentDetailsForm from "@/src/components/user_details/UserAgentDetailsForm";
import AddressForm from "@/src/components/user_details/AddressForm";
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

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (type === "login") {
    return (
      <View style={styles.emailcontainer}>
        <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
        {step === 1 ? (
          <StepOne
            type={type}
            setStep={setStep}
            step={step}
            validateEmail={validateEmail}
          />
        ) : (
          <></>
        )}
        {step === 4 ? (
          <StepFour type={type} setStep={setStep} step={2} loginType="email" />
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
        <StepOne
          type={type}
          setStep={setStep}
          step={step}
          validateEmail={validateEmail}
        />
      ) : (
        <></>
      )}
      {step === 2 ? (
        <StepTwo type={type} setStep={setStep} step={step} />
      ) : (
        <></>
      )}
      {step === 3 ? (
        <StepThree type={type} setStep={setStep} step={step} />
      ) : (
        <></>
      )}
      {step === 4 ? (
        <StepFour
          type={type}
          setStep={setStep}
          step={step}
          loginType="mobile"
        />
      ) : (
        <></>
      )}
      {step === 5 ? (
        <StepFive type={type} setStep={setStep} step={step} />
      ) : (
        <></>
      )}
      {step === 6 ? <UserAgentDetailsForm setStep={setStep} step={step} /> : <></>}
      {step === 7 ? (
        <AddressForm registrationType="email" setStep={setStep} step={step} />
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
