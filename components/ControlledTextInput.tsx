import React from "react";
import { Controller, ControllerProps } from "react-hook-form";
import { TextInputProps, TextInput } from "react-native-paper";

interface ControlledTextInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputProps?: TextInputProps;
  minLength?: number;
}

const ControlledTextInput: React.FC<ControlledTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  inputProps,
  minLength,
}) => {
  return (
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
          {...inputProps}
        />
      )}
    />
  );
};

export default ControlledTextInput;
