import { Button, TextInput } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Platform, ScrollView, View } from "react-native";
import ControlledTextInput from "../../components/ControlledTextInput";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useFormStore } from "../../stores/useFormStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Icon } from "@rneui/base";
import { personalInfoSchema } from "../../validation/personalInfo";

export function PersonalInfo({ navigation }: any) {
  const { setActiveStep } = useFormStore();

  const { personalInformation, setPersonalInformation } = useFormStore();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: personalInformation,
  });

  const onSubmit = (data: any) => {
    setPersonalInformation(data);
    setActiveStep(1);
  };

  const [loading, setLoading] = useState(false);

  return (
    <SlideUpCard>
      <Text variant="headlineSmall">Enter your personal information</Text>
      <ScrollView
        style={{ marginVertical: 0 }}
        contentContainerStyle={{ paddingVertical: 5 }}
      >
        <ControlledTextInput
          control={control}
          name="firstName"
          label="First Name"
          placeholder="Enter your First Name"
          error={errors.firstName}
          icon={<Icon type="material-community" name="account" />}
        />
        <ControlledTextInput
          control={control}
          name="lastName"
          label="Last Name"
          placeholder="Enter your Last Name"
          icon={<Icon type="material-community" name="account" />}
          error={errors.lastName}
        />
        <ControlledTextInput
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          placeholder="dd/mm/yyyy"
          icon={
            <Icon
              type="material-community"
              name="calendar"
              onPress={() => {
                if (Platform.OS === "android") {
                  DateTimePickerAndroid.open({
                    value: new Date(),
                    mode: "date",
                    onChange: (event, date) => {
                      if (event.type === "set") {
                        setValue(
                          "dateOfBirth",
                          date ? format(date, "dd/MM/yyyy") : ""
                        );
                      }
                    },
                  });
                }
              }}
            />
          }
          error={errors.dateOfBirth}
        />
        <ControlledTextInput
          control={control}
          name="phoneNumber"
          label="Phone Number"
          placeholder="(xx xx xx xx xx)"
          icon={<Icon type="material-community" name="phone" />}
          error={errors.phoneNumber}
        />
        <ControlledTextInput
          control={control}
          name="address"
          label="Address"
          placeholder="Please Enter your Address"
          icon={<Icon type="material-community" name="map-marker" />}
          error={errors.address}
          minLength={8}
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
