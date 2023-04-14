import { Button, TextInput } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Platform, ScrollView, View } from "react-native";
import ControlledTextInput from "../../components/ControlledTextInput";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useFormStore } from "../../stores/useFormStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const personalInfoSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  // dd/mm/yyyy date of birth
  dateOfBirth: yup
    .string()
    .matches(
      /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/,
      "Date of Birth must be in the format mm/dd/yyyy"
    )
    .required("Date of Birth is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should have a minimum length of 8")
    .required("Password is required"),
});

export function PersonalInfo({ navigation }: any) {
  const { setActiveStep } = useFormStore();

  const { personalInformation, setPersonalInformation } = useFormStore();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: personalInformation,
  });

  const onSubmit = (data: any) => {
    setActiveStep(1);
    setPersonalInformation(data);
  };
  console.log("hello rerender");

  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your personal information</Text>
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
          name="lastName"
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
          name="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email}
          inputProps={{
            left: <TextInput.Icon icon="at" />,
            autoCapitalize: "none",
          }}
        />
        <ControlledTextInput
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          placeholder="mm/dd/yyyy"
          error={errors.dateOfBirth}
          inputProps={{
            left: (
              <TextInput.Icon
                icon="calendar"
                onPress={() => {
                  if (Platform.OS === "android") {
                    DateTimePickerAndroid.open({
                      value: new Date(),
                      mode: "date",
                      onChange: (event, date) => {
                        if (event.type === "set") {
                          setValue(
                            "dateOfBirth",
                            format(date || 0, "MM/dd/yyyy")
                          );
                        }
                      },
                    });
                  }
                }}
              />
            ),
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
          name="password"
          label="Password"
          placeholder="Enter your password"
          isPassword={true}
          error={errors.password}
          minLength={8}
          inputProps={{
            left: <TextInput.Icon icon="lock" />,
          }}
        />
      </ScrollView>
      <Button
        buttonColor="#7976FF"
        mode="contained"
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => {
          // submit form data and only proceed to next step if it's valid
          handleSubmit(onSubmit)();
        }}
        style={{ marginVertical: 30 }}
      >
        Next
      </Button>
    </SlideUpCard>
  );
}
