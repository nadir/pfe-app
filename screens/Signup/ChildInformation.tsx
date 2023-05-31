import { Button } from "react-native-paper";
import SlideUpCard from "../../components/SlideUpCard";
import { Text } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { Platform, ScrollView, View } from "react-native";
import ControlledTextInput from "../../components/ControlledTextInput";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useFormStore } from "../../stores/useFormStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Icon } from "@rneui/base";
import { childInfoSchema } from "../../validation/childInfo";
import DatePickerInputButton from "../../components/DatePickerInputButton";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../../config/constants";

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
  const [classes, setClasses] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    fetch(`${API_URL}/classes?distinct=true`)
      .then((response) => response.json())
      .then((data) => {
        setClasses(data.results);
      });
  }, []);

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
        <Controller
          control={control}
          name="class"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text
                style={{
                  fontFamily: "SourceSansPro-Bold",
                  fontSize: 14,
                  color: "#7976FF",
                }}
              >
                Class
              </Text>
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: errors.class ? "rgb(255, 0, 0)" : "#e6e6e6",
                  shadowColor: "#00000037",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowRadius: 2,
                  shadowOpacity: 1,
                  elevation: 10,
                  marginBottom: 10,
                }}
              >
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  onBlur={onBlur}
                >
                  <Picker.Item label="Select Class" value={null} />
                  {classes.map((classItem) => (
                    <Picker.Item
                      key={classItem.id}
                      label={classItem.name}
                      value={classItem.id}
                    />
                  ))}
                </Picker>
              </View>

              {errors.class && (
                <Text
                  style={{
                    fontFamily: "SourceSansPro-Regular",
                    fontSize: 12,
                    color: "rgb(255, 0, 0)",
                    marginBottom: 5,
                  }}
                >
                  {errors.class?.message}
                </Text>
              )}
            </>
          )}
        ></Controller>
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
