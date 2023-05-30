import { Picker } from "@react-native-picker/picker";
import { Icon } from "@rneui/base";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import { pick, set } from "lodash";
import { useModules } from "../services/useModules";
import { useFormStore } from "../stores/useFormStore";

import { Image } from "expo-image";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { publishPost } from "../services/publishPost";

const AddContent = ({ navigation }: { navigation: any }) => {
  const [inputs, setInputs] = useState<string[]>([""]);
  const [postType, setPostType] = useState<"poll" | "post">("post");
  const [postTitle, setPostTitle] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const token = useFormStore((state) => state.token);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeClass, setClass] = useState<string | undefined>("");

  const { data: modules } = useModules(token);

  const classes = useMemo(() => {
    return modules?.map((module) => {
      return {
        name: module.class_name,
        id: module.class_id,
      };
    });
  }, [modules]);

  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  const deleteInput = (index: number) => {
    let updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);

    setInputs(updatedInputs);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    index: number
  ) => {
    const updatedInputs = inputs.map((input, i) => {
      // change only the input that has been changed
      if (i === index) {
        return event.nativeEvent.text;
      }

      return input;
    });

    setInputs(updatedInputs);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {/* add poll option button */}

      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: "SourceSansPro-SemiBold",
            }}
          >
            Publication Type
          </Text>
          <Button
            buttonColor="#7976FF"
            style={{ borderRadius: 10 }}
            icon={"upload"}
            mode="contained"
            loading={loading}
            disabled={loading}
            onPress={async () => {
              // check if any of the inputs are empty
              setLoading(true);
              if (postType === "poll") {
                if (!postTitle) {
                  Toast.show({
                    type: "error",
                    text1: "Poll must have a title",
                  });
                  return;
                }
                if (inputs.length < 2) {
                  Toast.show({
                    type: "error",
                    text1: "Poll must have at least 2 options",
                  });
                  return;
                }

                // check if any of the inputs are empty
                if (inputs.some((input) => input === "")) {
                  Toast.show({
                    type: "error",
                    text1: "Poll options cannot be empty",
                  });
                  return;
                }
                try {
                  await publishPost(
                    {
                      title: postTitle,
                      options: inputs,
                      type: "poll",
                      classId: activeClass,
                    },
                    token
                  );
                } catch (error) {
                  Toast.show({
                    type: "error",
                    text1: "Error publishing post",
                  });
                }
              } else {
                if (!content) {
                  Toast.show({
                    type: "error",
                    text1: "Post must have a body",
                  });
                  return;
                }
                try {
                  await publishPost(
                    {
                      title: postTitle,
                      content: content,
                      type: "post",
                      classId: activeClass,
                      image: image,
                    },
                    token
                  );
                } catch (error) {
                  Toast.show({
                    type: "error",
                    text1: "Error publishing post",
                  });
                }
              }
              setLoading(false);
              navigation.goBack();
            }}
          >
            Publish
          </Button>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View style={styles.pickerContainer}>
            <Picker
              mode="dropdown"
              style={{
                flex: 1,
              }}
              selectedValue={postType}
              onValueChange={(itemValue, itemIndex) => {
                setPostType(itemValue);
              }}
            >
              <Picker.Item label="Poll" value="poll" />
              <Picker.Item label="Post" value="post" />
            </Picker>
          </View>
          <View
            style={[
              styles.pickerContainer,
              {
                flex: 0.7,
              },
            ]}
          >
            <Picker
              mode="dropdown"
              style={{
                flex: 1,
              }}
              selectedValue={activeClass}
              onValueChange={(itemValue, itemIndex) => {
                setClass(itemValue);
              }}
            >
              <Picker.Item enabled={false} label="Class" value="" />
              {classes?.map((classItem) => (
                <Picker.Item
                  key={classItem.id}
                  label={classItem.name}
                  value={classItem.id}
                />
              ))}
            </Picker>
          </View>
        </View>
        <TextInput
          placeholder={postType === "poll" ? "Question" : "Title"}
          style={styles.title}
          value={postTitle}
          onChangeText={(text) => {
            setPostTitle(text);
          }}
        />

        {postType === "poll" ? (
          <View
            style={{
              gap: 10,
            }}
          >
            <IconButton
              style={{ alignSelf: "flex-end", marginHorizontal: 22 }}
              icon={"plus"}
              iconColor="#7976FF"
              rippleColor="#7976FF"
              mode="contained"
              onPress={() => {
                addInput();
              }}
            ></IconButton>

            {inputs.map((input, index) => (
              <View key={index} style={styles.pollOption}>
                <TextInput
                  value={input}
                  onChange={(event) => handleInputChange(event, index)}
                  placeholder="Type your option here"
                  style={styles.pollOptionText}
                ></TextInput>
                <IconButton
                  iconColor="#ff1212"
                  rippleColor="#ff7676"
                  style={{
                    backgroundColor: "#ffe7e7",
                  }}
                  icon={"delete"}
                  mode="contained"
                  onPress={() => {
                    deleteInput(index);
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            style={{
              marginBottom: 20,
            }}
          >
            <View style={styles.postContent}>
              <TextInput
                placeholder="Type your post here"
                style={{
                  fontSize: 16,
                  fontFamily: "SourceSansPro-Regular",
                  color: "#000",
                }}
                value={content}
                onChangeText={(text) => {
                  setContent(text);
                }}
                multiline={true}
                numberOfLines={10}
                maxLength={500}
                textAlignVertical="top"
              />
              {image && (
                <Image
                  source={{
                    uri: image,
                  }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 10,

                    marginVertical: 10,
                  }}
                />
              )}

              <IconButton
                iconColor="#7976FF"
                rippleColor="#7976FF"
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: "transparent",
                }}
                icon={image ? "image-remove" : "image-plus"}
                mode="contained"
                onPress={() => {
                  if (image) setImage("");
                  else {
                    pickImage();
                  }
                }}
              ></IconButton>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddContent;

const styles = StyleSheet.create({
  postContent: {
    fontSize: 16,
    fontFamily: "SourceSansPro-Regular",
    color: "#000",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d7d7d7",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,

    padding: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d7d7d7",
  },
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "SourceSansPro-SemiBold",
    color: "#000",
  },
  pollOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d7d7d7",
  },
  pollOptionText: {
    fontSize: 16,
    fontFamily: "SourceSansPro-Regular",
    color: "#000",
  },
});
