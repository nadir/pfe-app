import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { Image } from "expo-image";

type FileProps = {
  name?: string;
  uploadedAt?: string;
  url: string;
  icon?: string;
  // default true
  downloadable?: boolean | true;
};

const getFileIcon = (url: string) => {
  const extension = url.split(".").pop();
  switch (extension) {
    case "pdf":
      return "https://img.icons8.com/color/96/pdf.png";
    case "doc":
    case "docx":
      return "https://img.icons8.com/color/96/word.png";
    case "xls":
    case "xlsx":
      return "https://img.icons8.com/color/96/xls.png";
    case "ppt":
    case "pptx":
      return "https://img.icons8.com/color/96/ppt.png";
    default:
      return "https://img.icons8.com/color/96/document--v1.png";
  }
};

const FileCard = ({ name, uploadedAt, url, icon, downloadable }: FileProps) => {
  const fileIcon = icon ? icon : getFileIcon(url);
  const fileName = name ? name : url.split("/").pop();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e3e3e3",
        padding: 10,
      }}
    >
      <Image
        source={{
          uri: fileIcon,
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
          {fileName}
        </Text>
      </View>
      {downloadable !== false && (
        <IconButton icon="download" size={20} onPress={() => {}} />
      )}
    </View>
  );
};

export default FileCard;

const styles = StyleSheet.create({});
