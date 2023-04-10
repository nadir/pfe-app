import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput, Divider } from "react-native-paper";
import ControlledTextInput from "../components/ControlledTextInput";

const LoginScreen = () => {
  const [secure, setSecure] = useState(true);

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

  const onSubmit = (data: any) => console.log(data);

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: "SourceSansPro-Bold", fontSize: 30 }}>
        Login to your account
      </Text>
      <ControlledTextInput
        control={control}
        name="username"
        label="Username"
        placeholder="Enter your username"
        inputProps={{
          left: <TextInput.Icon icon="account" />,
          style: { ...styles.input, marginVertical: 20 },
        }}
      />
      <ControlledTextInput
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your username"
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
      {/* a small gray line to divide content */}

      <Button
        mode="contained"
        style={styles.btn}
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => handleSubmit(onSubmit)()}
        buttonColor="#7976FF"
        icon="arrow-right"
      >
        Login
      </Button>

      <Divider
        style={{
          backgroundColor: "#d8d8da",
          width: "90%",
        }}
      />
      <Button
        icon={"account-plus"}
        mode="contained-tonal"
        style={[styles.btn]}
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => console.log("Pressed")}
      >
        Create an account
      </Button>
    </View>
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
