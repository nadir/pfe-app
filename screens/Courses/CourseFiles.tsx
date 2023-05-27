import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { IconButton } from "react-native-paper";

const CourseFiles = () => {
  return (
    <View style={styles.container}>
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
