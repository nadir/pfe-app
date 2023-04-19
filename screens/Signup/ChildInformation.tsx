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

export function ChildInformation({ navigation }: any) {
  const { setActiveStep } = useFormStore();

  const { childInformation, setChildInformation } = useFormStore();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
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
          autoCorrect={false}
          error={errors.firstName}
          icon={<Icon type="material-community" name="account" />}
        />
        <ControlledTextInput
          control={control}
          name="lastName"
          label="Last Name"
          placeholder="Last Name"
          autoComplete="name-family"
          autoCorrect={false}
          icon={<Icon type="material-community" name="account" />}
          error={errors.lastName}
        />
        <ControlledTextInput
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          keyboardType="numbers-and-punctuation"
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
          name="class"
          label="Class"
          placeholder="Class"
          autoComplete="name-family"
          autoCorrect={false}
          icon={<Icon type="material-community" name="school" />}
          error={errors.class}
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
