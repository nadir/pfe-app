import { Button } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Platform, ScrollView } from "react-native";
import ControlledTextInput from "../../components/ControlledTextInput";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useFormStore } from "../../stores/useFormStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Icon } from "@rneui/base";
import { childInfoSchema } from "../../validation/childInfo";
import DatePickerInputButton from "../../components/DatePickerInputButton";

export function ChildInformation({ navigation }: any) {
  const { setActiveStep } = useFormStore();

  const { childInformation, setChildInformation } = useFormStore();

  const {
    control,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(childInfoSchema),
    defaultValues: childInformation,
  });

  const onSubmit = (data: any) => {
    setChildInformation(data);
    setActiveStep(3);
  };

  const [loading, setLoading] = useState(false);

  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your Child's Information</Text>
      <ScrollView
        style={{ marginVertical: 0 }}
        contentContainerStyle={{ paddingVertical: 5 }}
      >
        <ControlledTextInput
          control={control}
          name="firstName"
          label="First Name"
          placeholder="First Name"
          autoCapitalize="words"
          autoCorrect={false}
          error={errors.firstName}
          icon={<Icon type="material-community" name="account" />}
          onSubmitEditing={() => {
            setFocus("lastName");
          }}
        />
        <ControlledTextInput
          control={control}
          name="lastName"
          label="Last Name"
          autoCapitalize="words"
          placeholder="Last Name"
          autoComplete="name-family"
          autoCorrect={false}
          icon={<Icon type="material-community" name="account" />}
          error={errors.lastName}
          onSubmitEditing={() => {
            setFocus("dateOfBirth");
          }}
        />
        <ControlledTextInput
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          keyboardType="numbers-and-punctuation"
          placeholder="dd/mm/yyyy"
          icon={
            <DatePickerInputButton
              error={errors.dateOfBirth ? true : false}
              onSet={(value: number | Date) => {
                setValue(
                  "dateOfBirth",
                  format(value, "dd/MM/yyyy").toString(),
                  {
                    shouldValidate: true,
                  }
                );
              }}
            />
          }
          error={errors.dateOfBirth}
          onSubmitEditing={() => {
            setFocus("class");
          }}
        />
        <ControlledTextInput
          control={control}
          name="class"
          label="Class"
          placeholder="Class"
          autoComplete="name-family"
          autoCorrect={false}
          icon={<Icon type="material-community" name="school" />}
          error={errors.class}
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
          // submit form data and only proceed to next step if it's valid
          handleSubmit(onSubmit)();
        }}
        style={{ marginVertical: 30 }}
      >
        Next
      </Button>
    </SlideUpCard>
  );
}
