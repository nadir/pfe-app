import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { Image } from "expo-image";
import { format, formatDistanceToNow } from "date-fns";

type FileProps = {
  name: string;
  uploadedAt?: Date;
  url: string;
  icon?: string;
  deletable?: boolean;
  onDelete?: () => void;
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

const FileCard = ({
  name,
  uploadedAt,
  url,
  icon,
  downloadable,
  deletable,
  onDelete,
}: FileProps) => {
  const fileIcon = icon ? icon : getFileIcon(name);
  const fileName = name;

  let formattedDate;

  if (uploadedAt) {
    formattedDate = formatDistanceToNow(uploadedAt, {
      addSuffix: true,
      includeSeconds: true,
    }).replace("about ", "");
  }

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
            fontSize: 14,
            color: "black",
          }}
        >
          {fileName}
        </Text>
        {uploadedAt && (
          <Text
            style={{
              fontFamily: "SourceSansPro-Regular",
              fontSize: 12,
              color: "grey",
            }}
          >
            Uploaded {formattedDate}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {downloadable !== false && (
          <IconButton icon="download" size={20} onPress={() => {}} />
        )}
        {deletable && (
          <IconButton
            icon="trash-can-outline"
            iconColor="red"
            size={20}
            onPress={onDelete}
          />
        )}
      </View>
    </View>
  );
};

export default FileCard;

const styles = StyleSheet.create({});
