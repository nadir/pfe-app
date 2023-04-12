import React from "react";
import { Controller, FieldError } from "react-hook-form";
import { TextInputProps, TextInput, HelperText } from "react-native-paper";
import { View } from "react-native";

interface ControlledTextInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputProps?: TextInputProps;
  minLength?: number;
  error?: FieldError;
}

const ControlledTextInput: React.FC<ControlledTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  inputProps,
  minLength,
  error,
}) => {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        rules={{
          required: { value: true, message: `${name} is required` },
          minLength: {
            message: `${name} must be at least ${minLength} characters`,
            value: minLength || 0,
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            label={label}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
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
