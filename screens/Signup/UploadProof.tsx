import { Button } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import ImagePickerExample from "../../components/ImagePicker";
import { useFormStore } from "../../stores/useFormStore";
import { Icon } from "@rneui/base";

export function UploadProof({ navigation }: any) {
  const { personalInformation, childInformation, loginInformation } =
    useFormStore();
  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Upload Proof</Text>
      <Text
        variant="bodyLarge"
        style={{
          color: "gray",
        }}
      >
        We need to verify your child's affiliation with our school
      </Text>
      <ImagePickerExample />
      <Button
        buttonColor="#7976FF"
        mode="contained"
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() =>
          console.log({
            personalInformation,
            childInformation,
            loginInformation,
          })
        }
      >
        Submit
      </Button>
    </SlideUpCard>
  );
}
