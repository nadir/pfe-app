import React, { useState } from "react";
import { Controller, FieldError, set } from "react-hook-form";
import { TextInputProps, TextInput, HelperText } from "react-native-paper";
import { View } from "react-native";

interface ControlledTextInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  isPassword?: boolean;
  inputProps?: TextInputProps;
  minLength?: number;
  error?: FieldError;
}

const ControlledTextInput: React.FC<ControlledTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  isPassword,
  inputProps,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            label={label}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry={isPassword && showPassword}
            right={
              isPassword ? (
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              ) : null
            }
            // Styling for text input
            placeholderTextColor="#d5d5d5ea"
            mode="outlined"
            theme={{
              roundness: 10,
            }}
            outlineColor="#d8d8da"
            activeOutlineColor="#a8a8a8ea"
            error={error ? true : false}
            {...inputProps}
          />
        )}
      />
      {error && <HelperText type="error">{error?.message}</HelperText>}
    </View>
  );
};

export default ControlledTextInput;
