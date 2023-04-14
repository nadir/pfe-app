import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActiveForm from "./ActiveForm";
import { PersonalInfo } from "./PersonalInfo";
import { ChildInformation } from "./ChildInformation";
import { UploadProof } from "./UploadProof";
import { useFormStore } from "../../stores/useFormStore";

const SignupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { activeStep, setActiveStep } = useFormStore();
  const { personalInformation, setPersonalInformation } = useFormStore();

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
