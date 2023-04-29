import { useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { Button, TextInput, Divider } from "react-native-paper";
import ControlledTextInput from "../components/ControlledTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@rneui/base";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import Error from "../components/Error";

import { useFormStore } from "../stores/useFormStore";

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should have a min length of 8")
    .required("Password is required"),
});

const LoginScreen = ({ navigation }: any) => {
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useFormStore();

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: yup.InferType<typeof loginSchema>) => {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(
        "http://192.168.100.103:6969/auth/login",
        options
      );
      const json = await response.json();
      if (!response.ok) {
        setError(json.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      await SecureStore.setItemAsync("token", json.token);
      await setToken(json.token);
    } catch (error) {
      setError("Something went wrong");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontFamily: "SourceSansPro-Bold",
          fontSize: 30,
          marginBottom: 10,
        }}
      >
        Login to your account
      </Text>
      {error && <Error message={error} />}
      <View>
        <ControlledTextInput
          control={control}
          name="username"
          placeholder="Enter your username"
          icon={<Icon type="material-community" name="account" />}
          error={errors.username}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => {
            setFocus("password");
          }}
        />
        <ControlledTextInput
          control={control}
          name="password"
          placeholder="Enter your password"
          autoComplete="password"
          error={errors.password}
          autoCapitalize="none"
          isPassword={true}
          onSubmitEditing={handleSubmit(onSubmit)}
        />
      </View>

      <Button
        mode="contained"
        style={styles.btn}
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => {
          setError(null);
          Keyboard.dismiss();
          handleSubmit(onSubmit)();
        }}
        loading={isSubmitting}
        disabled={isSubmitting}
        buttonColor="#7976FF"
        icon="arrow-right"
      >
        Login
      </Button>

      <Divider
        style={{
          backgroundColor: "#d8d8da",
        }}
      />
      <Button
        icon={"account-plus"}
        mode="contained-tonal"
        style={[styles.btn]}
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => {
          Keyboard.dismiss();
          navigation.navigate("Signup");
        }}
      >
        Create an account
      </Button>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",

    padding: 30,
  },
  btn: {
    marginVertical: 20,
  },
  input: {
    alignSelf: "stretch",
  },
});
