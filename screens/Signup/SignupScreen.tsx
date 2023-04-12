import { useFocusEffect } from "@react-navigation/native";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { Button, ProgressBar, Text } from "react-native-paper";
import Animated, { FadeOutDown, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActiveForm from "./ActiveForm";
import { PersonalInfo } from "./PersonalInfo";
import { ChildInformation } from "./ChildInformation";
import { UploadProof } from "./UploadProof";

export const activeStepsAtom = atom<number>(0);

const SignupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [activeStep, setActiveStep] = useAtom(activeStepsAtom);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (activeStep > 0) {
          setActiveStep(activeStep - 1);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [activeStep])
  );

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "#F5F5F5",
        flex: 1,
      }}
    >
      <ActiveForm activeStep={activeStep}></ActiveForm>
      {/* // switch case render active step */}
      {activeStep === 0 && <PersonalInfo />}
      {activeStep === 1 && <ChildInformation />}
      {activeStep === 2 && <UploadProof />}
    </View>
  );
};

export default SignupScreen;
