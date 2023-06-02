import { Button, TextInput } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import ControlledTextInput from "../../components/ControlledTextInput";
import { useFormStore } from "../../stores/useFormStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Icon } from "@rneui/base";
import { LoginInfo, loginInfoSchema } from "../../validation/loginInfo";
import * as Haptics from "expo-haptics";
import Error from "../../components/Error";
import { API_URL } from "../../config/constants";

export function LoginInformation({ navigation }: any) {
  const { setActiveStep } = useFormStore();
  const [error, setSubmitError] = useState<string | null>(null);

  const { loginInformation, setLoginInformation } = useFormStore();

  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginInfoSchema),
    defaultValues: loginInformation,
  });

  const onSubmit = async (data: LoginInfo) => {
    try {
      const result = await fetch(
        `${API_URL}/user/check?email=${data.email}&username=${data.username}`,
        {
          method: "GET",
        }
      );
      const json = await result.json();
      if (json.available === false) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError(json.field, {
          type: "manual",
          message: json.message,
        });
        setFocus(json.field);
        return;
      }
      setLoginInformation(data);
      setActiveStep(2);
    } catch (error) {
      setSubmitError("Something went wrong, try again later");
    }
  };

  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your login details</Text>
      <ScrollView
        style={{ marginVertical: 0 }}
        contentContainerStyle={{ paddingVertical: 5 }}
      >
        {error && <Error message={error} />}
        <ControlledTextInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          error={errors.email}
          icon={<Icon type="material-community" name="at" />}
          onSubmitEditing={() => {
            setFocus("username");
          }}
        />
        <ControlledTextInput
          control={control}
          name="username"
          label="Username"
          placeholder="Enter a username"
          autoCapitalize="none"
          autoComplete="username"
          icon={<Icon type="material-community" name="account" />}
          error={errors.username}
          onSubmitEditing={() => {
            setFocus("password");
          }}
        />

        <ControlledTextInput
          control={control}
          name="password"
          label="Password"
          placeholder="Enter a password"
          autoCapitalize="none"
          autoComplete="password"
          isPassword
          icon={<Icon type="material-community" name="lock" />}
          error={errors.password}
          onSubmitEditing={() => {
            setFocus("confirmPassword");
          }}
        />
        <ControlledTextInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your Password"
          autoCapitalize="none"
          autoComplete="password"
          isPassword
          icon={<Icon type="material-community" name="lock" />}
          error={errors.confirmPassword}
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
          handleSubmit(onSubmit)();
        }}
        style={{ marginVertical: 30 }}
      >
        Next
      </Button>
    </SlideUpCard>
  );
}
