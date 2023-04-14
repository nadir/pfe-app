import { Button } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import ImagePickerExample from "../../components/ImagePickerExample";
import { useFormStore } from "../../stores/useFormStore";

export function UploadProof({ navigation }: any) {
  const { activeStep, setActiveStep } = useFormStore();
  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Upload Proof</Text>
      <ImagePickerExample />
      <Button
        buttonColor="#7976FF"
        mode="contained"
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => console.log("submitted")}
      >
        Submit
      </Button>
    </SlideUpCard>
  );
}
