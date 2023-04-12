import { useAtom } from "jotai";
import { Button } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { activeStepsAtom } from "./SignupScreen";
import { Text } from "react-native-paper";

export function UploadProof({ navigation }: any) {
  const [_, setActiveStep] = useAtom(activeStepsAtom);
  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Upload Proof</Text>
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
