import React, { useState } from "react";
import { Controller, FieldError, set } from "react-hook-form";
import { TextInputProps, TextInput, HelperText } from "react-native-paper";
import { Input, Icon } from "@rneui/themed";
import { View, StyleSheet } from "react-native";
import { IconNode } from "@rneui/base";

interface ControlledTextInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  isPassword?: boolean;
  inputProps?: TextInputProps;
  minLength?: number;
  error?: FieldError;
  icon?: IconNode;
}

const ControlledTextInput: React.FC<ControlledTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  isPassword,
  error,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            //styles
            style={{
              fontFamily: "SourceSansPro-Regular",
            }}
            errorStyle={styles.errorStyle}
            labelStyle={styles.labelStyle}
            inputContainerStyle={[
              styles.inputContainerStyle,
              {
                borderColor: focused ? "#7976FF" : error ? "red" : "#DADCE1",
              },
            ]}
            containerStyle={styles.containerStyle}
            //
            label={label}
            placeholder={placeholder}
            value={value}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              isPassword && setShowPassword(false);
              setFocused(false);
              onBlur();
            }}
            onChangeText={onChange}
            secureTextEntry={isPassword && !showPassword}
            errorMessage={error?.message}
            renderErrorMessage={false}
            leftIcon={
              isPassword ? <Icon type="material-community" name="lock" /> : icon
            }
            leftIconContainerStyle={{ marginRight: 10 }}
            rightIcon={
              isPassword ? (
                <Icon
                  type="material-community"
                  name={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              ) : undefined
            }
            // Styling for text input
            placeholderTextColor="#9a99b1"
          />
        )}
      />
    </View>
  );
};

export default ControlledTextInput;

const styles = StyleSheet.create({
  inputContainerStyle: {
    gap: 0,
    marginVertical: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 0,
    // very soft shadow
    shadowColor: "#00000037",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 10,
  },
  labelStyle: {
    fontFamily: "SourceSansPro-Regular",
    color: "#7976FF",
    paddingVertical: 0,

    fontWeight: "normal",
  },
  containerStyle: {
    minHeight: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  errorStyle: {
    marginTop: 0,
    marginLeft: 0,
    fontFamily: "SourceSansPro-Regular",
  },
});
