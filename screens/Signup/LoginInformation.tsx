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
import { loginInfoSchema } from "../../validation/loginInfo";

export function LoginInformation({ navigation }: any) {
  const { setActiveStep } = useFormStore();

  const { loginInformation, setLoginInformation } = useFormStore();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginInfoSchema),
    defaultValues: loginInformation,
  });

  const onSubmit = (data: any) => {
    setLoginInformation(data);
    setActiveStep(2);
  };

  const [loading, setLoading] = useState(false);

  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your login details</Text>
      <ScrollView
        style={{ marginVertical: 0 }}
        contentContainerStyle={{ paddingVertical: 5 }}
      >
        <ControlledTextInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your Email"
          error={errors.email}
          icon={<Icon type="material-community" name="at" />}
        />
        <ControlledTextInput
          control={control}
          name="username"
          label="username"
          placeholder="Enter your Last Name"
          icon={<Icon type="material-community" name="account" />}
          error={errors.username}
        />

        <ControlledTextInput
          control={control}
          name="password"
          label="password"
          placeholder="Enter a password"
          isPassword
          icon={<Icon type="material-community" name="lock" />}
          error={errors.password}
        />
        <ControlledTextInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your Password"
          isPassword
          icon={<Icon type="material-community" name="lock" />}
          error={errors.confirmPassword}
        />
      </ScrollView>
      <Button
        buttonColor="#7976FF"
        mode="contained"
        loading={loading}
        disabled={loading}
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPressIn={() => setLoading(true)}
        onPress={() => {
          // submit form data and only proceed to next step if it's valid
          handleSubmit(onSubmit)();
          setLoading(false);
        }}
        style={{ marginVertical: 30 }}
      >
        Next
      </Button>
    </SlideUpCard>
  );
}
