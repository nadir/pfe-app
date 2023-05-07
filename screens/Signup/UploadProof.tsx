import { Button } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import ImagePickerPrompt from "../../components/ImagePicker";
import { useFormStore } from "../../stores/useFormStore";
import { Icon } from "@rneui/base";
import { format, parse } from "date-fns";
import * as SecureStorage from "expo-secure-store";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useState } from "react";
import { API_URL } from "../../config/constants";

export function UploadProof({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const {
    personalInformation,
    childInformation,
    loginInformation,
    proofOfEnrollment,
    setToken,
  } = useFormStore();
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
      <ImagePickerPrompt />
      <Button
        buttonColor="#7976FF"
        mode="contained"
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        disabled={!proofOfEnrollment || loading}
        loading={loading}
        onPress={async () => {
          setLoading(true);
          const dob = parse(
            personalInformation.dateOfBirth,
            "dd/MM/yyyy",
            new Date()
          );
          const childDob = parse(
            childInformation.dateOfBirth,
            "dd/MM/yyyy",
            new Date()
          );
          let uriArray = proofOfEnrollment.split(".");
          let fileType = uriArray[uriArray.length - 1];

          const form = new FormData();
          form.append("first_name", personalInformation.firstName);
          form.append("last_name", personalInformation.lastName);
          form.append("date_of_birth", format(dob, "yyyy-MM-dd").toString());
          form.append("phone_number", personalInformation.phoneNumber);
          form.append("address", personalInformation.address || "");
          form.append("email", loginInformation.email);
          form.append("username", loginInformation.username);
          form.append("password", loginInformation.password);
          form.append("child_first_name", childInformation.firstName);
          form.append("child_last_name", childInformation.lastName);
          form.append("child_class", childInformation.class);
          form.append(
            "child_date_of_birth",
            format(childDob, "yyyy-MM-dd").toString()
          );
          form.append("proof_of_enrollment", {
            uri: proofOfEnrollment,
            name: `proof_of_enrollment.${fileType}`,
            type: `image/${fileType}`,
          } as unknown as Blob);

          try {
            const result = await fetch(`${API_URL}/auth/signup"`, {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: form,
            });
            const json = await result.json();

            if (json.success) {
              await SecureStorage.setItemAsync("token", json.token);
              setToken(json.token);
            }
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Signup Error",
              text2: "An error occurred while signing up",
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        Submit
      </Button>
    </SlideUpCard>
  );
}
