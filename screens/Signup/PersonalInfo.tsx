import { Button, TextInput } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Keyboard, Platform, ScrollView, View } from "react-native";
import ControlledTextInput from "../../components/ControlledTextInput";
import { format } from "date-fns";
import { useFormStore } from "../../stores/useFormStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Icon } from "@rneui/base";
import Error from "../../components/Error";
import * as Haptics from "expo-haptics";

import {
  PersonalInformation,
  personalInfoSchema,
} from "../../validation/personalInfo";
import DatePickerInputButton from "../../components/DatePickerInputButton";

export function PersonalInfo({ navigation }: any) {
  const { setActiveStep } = useFormStore();

  const { personalInformation, setPersonalInformation } = useFormStore();
  const [error, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: personalInformation,
  });

  const onSubmit = async (data: PersonalInformation) => {
    try {
      const result = await fetch(
        `http://192.168.100.103:6969/user/check?phone_number=${data.phoneNumber}`,
        {
          method: "GET",
        }
      );
      const json = await result.json();
      if (json.available === false) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("phoneNumber", {
          type: "manual",
          message: "Phone number already exists",
        });
        setFocus("phoneNumber");
        return;
      }

      setPersonalInformation(data);
      setActiveStep(1);
    } catch (error) {
      setSubmitError("Something went wrong, try again later");
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your personal information</Text>
      <ScrollView
        style={{ marginVertical: 0 }}
        contentContainerStyle={{ paddingVertical: 5 }}
      >
        {error && <Error message={error} />}
        <ControlledTextInput
          control={control}
          name="firstName"
          label="First Name"
          placeholder="Enter your First Name"
          autoCapitalize="words"
          autoComplete="name"
          autoCorrect={false}
          error={errors.firstName}
          icon={<Icon type="material-community" name="account" />}
          onSubmitEditing={() => {
            setFocus("lastName");
          }}
        />
        <ControlledTextInput
          control={control}
          name="lastName"
          label="Last Name"
          autoCapitalize="words"
          placeholder="Enter your Last Name"
          autoComplete="name-family"
          autoCorrect={false}
          icon={<Icon type="material-community" name="account" />}
          error={errors.lastName}
          onSubmitEditing={() => {
            setFocus("dateOfBirth");
          }}
        />
        <ControlledTextInput
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          autoComplete="birthdate-full"
          keyboardType="numbers-and-punctuation"
          placeholder="dd/mm/yyyy"
          icon={
            <DatePickerInputButton
              error={errors.dateOfBirth ? true : false}
              onSet={(value: number | Date) => {
                setValue(
                  "dateOfBirth",
                  format(value, "dd/MM/yyyy").toString(),
                  {
                    shouldValidate: true,
                  }
                );
              }}
            />
          }
          error={errors.dateOfBirth}
          onSubmitEditing={() => {
            setFocus("phoneNumber");
          }}
        />
        <ControlledTextInput
          control={control}
          name="phoneNumber"
          label="Phone Number"
          placeholder="(xx xx xx xx xx)"
          maxLength={10}
          keyboardType="phone-pad"
          autoComplete="tel"
          icon={<Icon type="material-community" name="phone" />}
          error={errors.phoneNumber}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            setFocus("address");
          }}
        />
        <ControlledTextInput
          control={control}
          name="address"
          label="Address"
          placeholder="Please Enter your Address"
          autoComplete="street-address"
          icon={<Icon type="material-community" name="map-marker" />}
          error={errors.address}
          onSubmitEditing={() => {
            handleSubmit(onSubmit)();
          }}
        />
      </ScrollView>
      <Button
        buttonColor="#7976FF"
        mode="contained"
        loading={isSubmitting}
        disabled={isSubmitting}
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
