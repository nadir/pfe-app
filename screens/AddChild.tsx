import { yupResolver } from "@hookform/resolvers/yup";
import { isValid, parse } from "date-fns";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import * as yup from "yup";
import ControlledTextInput from "../components/ControlledTextInput";
import { Button, HelperText, TouchableRipple } from "react-native-paper";
import { Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { API_URL } from "../config/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { useFormStore } from "../stores/useFormStore";
import Toast from "react-native-toast-message";

export const childInfoSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    // allow spaces and letters only even ones with accents
    .matches(/^[a-zA-Z ]+$/, "First Name is invalid"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z ]+$/, "Last Name is invalid"),

  // dd/mm/yyyy date of birth
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .test("date-of-birth", "Date of birth is invalid", (value) => {
      const date = parse(value, "dd/MM/yyyy", new Date());
      if (!isValid(date)) return false;
      // check if date is future
      if (date > new Date()) return false;
      // check if date is before 1900
      if (date.getFullYear() < 1900) return false;
      return true;
    }),
  class: yup.number().required("Class is required"),
});

export type ChildInfo = yup.InferType<typeof childInfoSchema>;

const AddChild = ({ navigation }: { navigation: any }) => {
  const { token, setActiveChild, addChild } = useFormStore((state) => ({
    token: state.token,
    setActiveChild: state.setActiveChild,
    addChild: state.addChild,
  }));

  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(childInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      class: null,
    },
  });

  const [classes, setClasses] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const [image, setImage] = useState("");
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setImage(result.assets[0].uri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetch(`${API_URL}/classes?distinct=true`)
        .then((response) => response.json())
        .then((data) => {
          setClasses(data.results);
        });

      setFocus("firstName");
    }, [navigation])
  );

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        padding: 30,
        gap: 20,
      }}
    >
      <ControlledTextInput
        control={control}
        name="firstName"
        label="First Name"
        placeholder="First Name"
        error={errors.firstName}
        onSubmitEditing={() => setFocus("lastName")}
      />
      <ControlledTextInput
        control={control}
        name="lastName"
        label="Last Name"
        placeholder="Last Name"
        error={errors.lastName}
        onSubmitEditing={() => setFocus("dateOfBirth")}
      />

      <ControlledTextInput
        control={control}
        name="dateOfBirth"
        maxLength={10}
        label="Date of Birth"
        placeholder="dd/mm/yyyy"
        error={errors.dateOfBirth}
        onSubmitEditing={() => setFocus("class")}
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
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: errors.class ? "rgb(255, 0, 0)" : "#e6e6e6",
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

      {/* image */}

      <Text
        style={{
          fontFamily: "SourceSansPro-Bold",
          fontSize: 14,
          color: "#7976FF",
        }}
      >
        Proof of school affiliation
      </Text>
      <View
        style={{
          overflow: "hidden",
          borderRadius: 10,
          backgroundColor: "#ffffff",
          borderWidth: 1,
          borderColor: "#e6e6e6",
        }}
      >
        <TouchableRipple
          onPress={() => {
            pickImage();
          }}
          style={{
            padding: 10,
          }}
          borderless={true}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name={image ? "check-circle" : "image-plus"}
              size={30}
              color={image ? "#7976FF" : "#ababab"}
            />
            <Text
              style={{
                fontFamily: "SourceSansPro-Regular",
                fontSize: 12,
                color: image ? "black" : "#ababab",
                marginLeft: 20,
              }}
            >
              {image ? "Image selected" : "Please select image"}
            </Text>
          </View>
        </TouchableRipple>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(async (data) => {
          const formData = new FormData();
          let uriArray = image.split(".");
          let fileType = uriArray[uriArray.length - 1];

          formData.append("first_name", data.firstName);
          formData.append("last_name", data.lastName);
          formData.append("date_of_birth", data.dateOfBirth);
          // @ts-ignore
          formData.append("class_id", data.class);
          formData.append("proof", {
            uri: image,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          } as unknown as Blob);

          try {
            const response = await fetch(`${API_URL}/students`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            const responseData = await response.json();

            if (!response.ok) {
              throw new Error(responseData.message);
            }
            const result = responseData.results[0];
            addChild({
              id: result.id,
              first_name: result.first_name,
              last_name: result.last_name,
              date_of_birth: result.date_of_birth,
              class_id: result.class_id,
              verified: result.verified,
            });

            setActiveChild(0);

            navigation.goBack();
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: (error as Error).message,
            });
          }
        })}
        loading={isSubmitting}
        disabled={!image || isSubmitting}
        icon={"plus"}
        buttonColor="#7976FF"
        style={{
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        Add Child
      </Button>

      <Button
        mode="outlined"
        onPress={() => console.log("bruh")}
        style={{
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        Cancel
      </Button>
    </ScrollView>
  );
};

export default AddChild;

const styles = StyleSheet.create({});
