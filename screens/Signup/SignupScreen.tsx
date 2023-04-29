import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActiveForm from "./ActiveForm";
import { PersonalInfo } from "./PersonalInfo";
import { ChildInformation } from "./ChildInformation";
import { LoginInformation } from "./LoginInformation";
import { UploadProof } from "./UploadProof";
import { useFormStore } from "../../stores/useFormStore";

const SignupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { activeStep, setActiveStep } = useFormStore();

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
        justifyContent: "space-between",
      }}
    >
      <ActiveForm activeStep={activeStep}></ActiveForm>
      {/* // switch case render active step */}
      {activeStep === 0 && <PersonalInfo />}
      {activeStep === 1 && <LoginInformation />}
      {activeStep === 2 && <ChildInformation />}
      {activeStep === 3 && <UploadProof />}
    </View>
  );
};

export default SignupScreen;
