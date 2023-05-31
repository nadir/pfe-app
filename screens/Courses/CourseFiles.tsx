import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Button, IconButton } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { API_URL } from "../../config/constants";
import { useFormStore } from "../../stores/useFormStore";

const CourseFiles = ({ id, color }: { id: number; color: string }) => {
  const token = useFormStore((state) => state.token);
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={{
          backgroundColor: color,
          borderRadius: 20,
          marginHorizontal: 20,
          marginVertical: 10,
        }}
        icon={"upload"}
        textColor="white"
        loading={loading}
        disabled={loading}
        labelStyle={{
          color: "white",
        }}
        onPress={async () => {
          setLoading(true);
          const file = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false,
          });

          if (file.type !== "success") {
            return;
          }
          try {
            const form = new FormData();
            form.append("file", {
              uri: file.uri,
              name: file.name,
              type: file.mimeType,
            } as unknown as Blob);

            const response = await fetch(`${API_URL}/modules/8/resource`, {
              method: "POST",
              body: form,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });

            if (!response) {
              throw new Error("Error uploading file");
            }

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "File uploaded successfully",
            });
            setLoading(false);
          } catch (error) {
            console.log(error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: (error as Error).message,
            });
          }

          setLoading(false);
        }}
      >
        Upload a file
      </Button>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#e3e3e3",
          marginHorizontal: 20,
          padding: 10,
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/color/144/pdf.png",
          }}
          style={{
            width: 30,
            height: 30,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            flexGrow: 1,
            marginLeft: 10,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "SourceSansPro-Bold",
              fontSize: 16,
              color: "black",
            }}
          >
            Chaptire_1.pdf
          </Text>
          <Text
            style={{
              fontFamily: "SourceSansPro-Regular",
              fontSize: 12,
              color: "grey",
            }}
          >
            Uploaded 15s ago by John Doe
          </Text>
        </View>
        <IconButton icon="download" size={20} onPress={() => {}} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#e3e3e3",
          marginHorizontal: 20,
          padding: 10,
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/color/96/word.png",
          }}
          style={{
            width: 30,
            height: 30,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            flexGrow: 1,
            marginLeft: 10,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "SourceSansPro-Bold",
              fontSize: 16,
              color: "black",
            }}
          >
            Lesson_2.docx
          </Text>
          <Text
            style={{
              fontFamily: "SourceSansPro-Regular",
              fontSize: 12,
              color: "grey",
            }}
          >
            Uploaded 1h ago By H. Nadhir
          </Text>
        </View>

        <IconButton icon="download" size={20} onPress={() => {}} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#e3e3e3",
          marginHorizontal: 20,
          padding: 10,
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/color/96/video-file.png",
          }}
          style={{
            width: 30,
            height: 30,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            flexGrow: 1,
            marginLeft: 10,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "SourceSansPro-Bold",
              fontSize: 16,
              color: "black",
            }}
          >
            Introduction.mp4
          </Text>
          <Text
            style={{
              fontFamily: "SourceSansPro-Regular",
              fontSize: 12,
              color: "grey",
            }}
          >
            Uploaded 2min ago By H. Nadhir
          </Text>
        </View>

        <IconButton icon="download" size={20} onPress={() => {}} />
      </View>
    </View>
  );
};

export default CourseFiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
    backgroundColor: "white",
    gap: 20,
    paddingTop: 30,
  },
});
