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
import { API_URL } from "../config/constants";
import { fetchUser } from "../services/fetchUser";
import { refreshFCMToken } from "../services/refreshFCMToken";
import { fetchStudents } from "../services/fetchStudents";
import { set } from "lodash";

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should have a min length of 8")
    .required("Password is required"),
});

const LoginScreen = ({ navigation }: any) => {
  const [error, setError] = useState<string | null>(null);
  const { setToken, setLoggedInUser, setChildren, setActiveChild } =
    useFormStore((state) => ({
      setToken: state.setToken,
      setLoggedInUser: state.setLoggedInUser,
      setChildren: state.setChildren,
      setActiveChild: state.setActiveChild,
    }));

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
      const response = await fetch(`${API_URL}/auth/login`, options);
      const json = await response.json();
      if (!response.ok) {
        setError(json.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      await SecureStore.setItemAsync("token", json.token);

      await setToken(json.token);

      const userDetails = await fetchUser(json.token);
      setLoggedInUser({
        id: userDetails.user_id,
        firstName: userDetails.first_name,
        email: userDetails.email,
        user_type: userDetails.user_type,
        lastName: userDetails.last_name,
        profilePicture: userDetails.profile_picture,
        address: userDetails.address,
        phoneNumber: userDetails.phone_number,
        username: userDetails.username,
      });
      if (userDetails.user_type === "parent") {
        const childrenDetails = await fetchStudents(json.token);
        setChildren(childrenDetails);
        setActiveChild(0);
      }
      await refreshFCMToken(json.token);
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
