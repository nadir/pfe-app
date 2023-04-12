import { useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { Button, TextInput, Divider } from "react-native-paper";
import ControlledTextInput from "../components/ControlledTextInput";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = ({ navigation }: any) => {
  const [secure, setSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
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
      <View style={{ gap: 20 }}>
        <ControlledTextInput
          control={control}
          name="username"
          label="Username"
          placeholder="Enter your username"
          error={errors.username}
          inputProps={{
            left: <TextInput.Icon icon="account" />,
            style: { ...styles.input },
            autoCapitalize: "none",
          }}
        />
        <ControlledTextInput
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password}
          minLength={8}
          secureTextEntry={secure}
          inputProps={{
            onBlur: () => setSecure(true),
            right: (
              <TextInput.Icon
                icon={secure ? "eye" : "eye-off"}
                onPress={() => setSecure(!secure)}
              />
            ),
            left: <TextInput.Icon icon="lock" />,
            style: { ...styles.input },
          }}
        />
      </View>

      <Button
        mode="contained"
        style={styles.btn}
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPressIn={() => setIsLoading(true)}
        onPress={() => {
          Keyboard.dismiss();
          handleSubmit(onSubmit)();
          setIsLoading(false);
        }}
        loading={isLoading}
        disabled={isLoading}
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
    // borderRadius: 5,
  },
  input: {
    alignSelf: "stretch",
  },
});
