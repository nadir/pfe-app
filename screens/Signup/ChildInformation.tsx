import { Button, TextInput } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import ControlledTextInput from "../../components/ControlledTextInput";
import { useFormStore } from "../../stores/useFormStore";

export function ChildInformation({ navigation }: any) {
  const { setActiveStep } = useFormStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
  });
  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your Child's information</Text>
      <ScrollView
        style={{ marginVertical: 10 }}
        contentContainerStyle={{ gap: 20 }}
      >
        <ControlledTextInput
          control={control}
          name="firstName"
          label="First Name"
          placeholder="Enter your First Name"
          error={errors.username}
          inputProps={{
            left: <TextInput.Icon icon="account" />,
            autoCapitalize: "none",
          }}
        />
        <ControlledTextInput
          control={control}
          name="lantName"
          label="Last Name"
          placeholder="Enter your Last Name"
          error={errors.username}
          inputProps={{
            left: <TextInput.Icon icon="account" />,
            autoCapitalize: "none",
          }}
        />
        <ControlledTextInput
          control={control}
          name="username"
          label="Username"
          placeholder="Enter your username"
          error={errors.username}
          inputProps={{
            left: <TextInput.Icon icon="account" />,
            autoCapitalize: "none",
          }}
        />
        <ControlledTextInput
          control={control}
          name="Data of Birth"
          label="Date of Birth"
          placeholder="Enter your Date of Birth"
          error={errors.username}
          inputProps={{
            left: <TextInput.Icon icon="account" />,
            autoCapitalize: "none",
          }}
        />
      </ScrollView>
      <Button
        buttonColor="#7976FF"
        mode="contained"
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        style={{ marginVertical: 30 }}
        onPress={() => setActiveStep(2)}
      >
        Next
      </Button>
    </SlideUpCard>
  );
}
