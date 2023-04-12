import { useAtom } from "jotai";
import { Button } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { activeStepsAtom } from "./SignupScreen";
import { Text } from "react-native-paper";

export function PersonalInfo({ navigation }: any) {
  const [_, setActiveStep] = useAtom(activeStepsAtom);
  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your personal information</Text>
      <Button
        buttonColor="#7976FF"
        mode="contained"
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => setActiveStep(1)}
      >
        Next
      </Button>
    </SlideUpCard>
  );
}
