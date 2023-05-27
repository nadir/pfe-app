import { Picker } from "@react-native-picker/picker";
import { Input } from "@rneui/base";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Button,
  IconButton,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { useFormStore } from "../stores/useFormStore";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { set } from "lodash";
import FileCard from "../components/FileCard";
import { ScrollView } from "react-native-gesture-handler";
import DatePickerInputButton from "../components/DatePickerInputButton";
import { format } from "date-fns";
import Toast from "react-native-toast-message";
import { useModules } from "../services/useModules";

const AddHomework = () => {
  const token = useFormStore((state) => state.token);
  const [selectedClass, setSelectedClass] = useState<number>();
  const [selectedModule, setSelectedModule] = useState<number>();
  const [file, setFile] = useState<DocumentPicker.DocumentResult>();
  const [dueDate, setDueDate] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const { data, isLoading, isError, error } = useModules(token);

  const modules = data?.filter((module) => module.class_id === selectedClass);

  const classes = data?.map((module) => {
    return {
      name: module.class_name,
      id: module.class_id,
    };
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          padding: 20,
          gap: 20,
        }}
      >
        {/* input title */}
        <View>
          <Text
            style={{
              fontFamily: "SourceSansPro-SemiBold",
              fontSize: 16,
            }}
          >
            Title
          </Text>
          <Input
            onChangeText={(text) => setTitle(text)}
            inputContainerStyle={{
              padding: 0,
              borderBottomWidth: 0,
              margin: 0,
            }}
            containerStyle={{
              backgroundColor: "#ffffff",
              padding: 0,
              borderRadius: 5,
              borderBottomWidth: 1,
              borderColor: "#1e88e5",
              height: 50,
              marginVertical: 10,
            }}
            style={{
              padding: 0,
              backgroundColor: "#ffffff",

              fontFamily: "SourceSansPro-Bold",
              fontSize: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>

        {/* input description */}
        <View>
          <Text
            style={{
              fontFamily: "SourceSansPro-SemiBold",
              fontSize: 16,
            }}
          >
            Description
          </Text>
          <Input
            onChangeText={(text) => setDescription(text)}
            placeholder="Enter description"
            inputContainerStyle={{
              borderBottomWidth: 0,
            }}
            multiline
            numberOfLines={5}
            containerStyle={{
              backgroundColor: "#ffffff",
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#e3e3e3",
              marginVertical: 10,
            }}
            style={{
              backgroundColor: "#ffffff",

              fontFamily: "SourceSansPro-Regular",
              fontSize: 16,
            }}
          />
        </View>

        {/* module picker */}
        <View>
          <Text
            style={{
              fontFamily: "SourceSansPro-SemiBold",
              fontSize: 16,
            }}
          >
            Class
          </Text>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#e3e3e3",
              backgroundColor: "#ffffff",
            }}
          >
            <Picker
              selectedValue={selectedClass}
              placeholder="Select a class"
              onValueChange={(itemValue: number, itemIndex) =>
                setSelectedClass(itemValue)
              }
            >
              {classes?.map((item) => {
                return (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                  />
                );
              })}
            </Picker>
          </View>
        </View>

        {/*  file picker */}

        <Text
          style={{
            fontFamily: "SourceSansPro-SemiBold",
            fontSize: 16,
          }}
        >
          Module
        </Text>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#e3e3e3",
            backgroundColor: "#ffffff",
          }}
        >
          <Picker
            selectedValue={selectedModule}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedModule(itemValue)
            }
          >
            {modules?.map((item) => {
              return (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              );
            })}
          </Picker>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "SourceSansPro-SemiBold",
              fontSize: 16,
            }}
          >
            File
          </Text>

          <TouchableRipple
            style={{
              backgroundColor: "#ffffff",
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,

              borderColor: "#e3e3e3",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={async () => {
              const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: false,
              });

              setFile(result);
            }}
          >
            <Text
              style={{
                fontFamily: "SourceSansPro-Regular",
                fontSize: 16,
                flex: 1,
              }}
            >
              {file?.type === "success" ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FileCard
                    downloadable={false}
                    url={file.uri}
                    name={file.name}
                  />
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => setFile(undefined)}
                  />
                </View>
              ) : (
                "Select a file"
              )}
            </Text>
          </TouchableRipple>
        </View>

        {/* input due date */}
        <View>
          <Text
            style={{
              fontFamily: "SourceSansPro-SemiBold",
              fontSize: 16,
            }}
          >
            Due Date
          </Text>
          <Input
            placeholder="MM/DD/YYYY"
            value={dueDate}
            onChangeText={(value) => {
              setDueDate(value);
            }}
            inputContainerStyle={{
              padding: 0,
              borderBottomWidth: 0,
              margin: 0,
            }}
            maxLength={10}
            leftIcon={
              <DatePickerInputButton
                onSet={(value: number | Date) => {
                  const dueDate = format(value, "dd/MM/yyyy").toString();
                  setDueDate(dueDate);
                }}
                error={false}
              />
            }
            containerStyle={{
              backgroundColor: "#ffffff",
              padding: 0,

              borderRadius: 5,
              borderBottomWidth: 1,
              borderColor: "#1e88e5",
              height: 50,
              marginVertical: 10,
            }}
            style={{
              padding: 0,
              backgroundColor: "#ffffff",

              fontFamily: "SourceSansPro-Regular",
              fontSize: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>

        <Button
          mode="contained"
          style={{
            width: "100%",
            alignSelf: "center",

            backgroundColor: "#1e88e5",
            marginVertical: 20,
          }}
          onPress={async () => {
            if (
              !title ||
              !description ||
              !selectedModule ||
              !selectedClass ||
              !dueDate ||
              file?.type !== "success"
            ) {
              // toast show

              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please fill all the fields",
              });
              return;
            }
            const form = new FormData();
            form.append("title", title);
            form.append("description", description);
            form.append("moduleId", selectedModule.toString());
            form.append("classId", selectedClass.toString());
            form.append("dueDate", dueDate);
            form.append("file", {
              uri: file.uri,
              name: file.name,
              type: file.mimeType,
            } as unknown as Blob);
            try {
              const response = await fetch(
                "http://192.168.100.103:6969/homework",
                {
                  method: "POST",
                  body: form,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message);
              }
              console.log("posted homework");
            } catch (error) {
              console.log(error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Error while posting homework",
              });
            }
          }}
        >
          Publish
        </Button>

        {/* input description */}
        {/* input file */}
        {/* input due date */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddHomework;

const styles = StyleSheet.create({});

// const PostHomework = async ({
//   title,
//   description,
//   selectedModule,
//   selectedClass,
//   dueDate,
//   file,
// }: {
//   title: string;
//   description: string;
//   selectedModule: string;
//   selectedClass: string;
//   dueDate: string;
//   file: string;
// }) => {

// };
