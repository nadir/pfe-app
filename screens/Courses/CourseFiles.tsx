import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { API_URL } from "../../config/constants";
import { useFormStore } from "../../stores/useFormStore";
import FileCard from "../../components/FileCard";
import { useQuery } from "react-query";
import { FlatList } from "react-native-gesture-handler";
import { set } from "lodash";

interface Resource {
  id: number;
  filename: string;
  file: string;
  created_at: string;
  module_id: number;
}

const useModuleFiles = (id: number, token: string) => {
  return useQuery<Resource[]>(
    ["modules", id, "files"],
    async () => {
      const response = await fetch(`${API_URL}/modules/${id}/resources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data.results;
    },
    {
      enabled: !!id,
    }
  );
};

const CourseFiles = ({ id, color }: { id: number; color: string }) => {
  const token = useFormStore((state) => state.token);
  const user_type = useFormStore((state) => state.loggedInUser.user_type);
  const [loading, setLoading] = useState(false);

  const { data: files, isLoading, refetch } = useModuleFiles(id, token);

  const renderFiles = ({ item }: { item: Resource }) => {
    return (
      <FileCard
        deletable={user_type === "teacher"}
        downloadable={true}
        name={item.filename}
        url={item.file}
        onDelete={async () => {
          try {
            const response = await fetch(
              `${API_URL}/modules/resources/${item.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message);
            }

            Toast.show({
              type: "success",
              text1: "Success",
              text2: "File deleted successfully",
            });

            refetch();
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: (error as Error).message,
            });
          }
        }}
        uploadedAt={new Date(item.created_at)}
      />
    );
  };

  const renderListEmpty = () => {
    if (isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ActivityIndicator animating={true} color={color} />
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "SourceSansPro-SemiBold",
          }}
        >
          No files uploaded
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {user_type === "teacher" && (
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
              setLoading(false);
              return;
            }
            try {
              const form = new FormData();
              form.append("file", {
                uri: file.uri,
                name: file.name,
                type: file.mimeType,
              } as unknown as Blob);

              const response = await fetch(
                `${API_URL}/modules/${id}/resource`,
                {
                  method: "POST",
                  body: form,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              if (!response) {
                throw new Error("Error uploading file");
              }

              Toast.show({
                type: "success",
                text1: "Success",
                text2: "File uploaded successfully",
              });
              refetch();
              setLoading(false);
            } catch (error) {
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
      )}

      <FlatList
        data={files}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 20,
        }}
        renderItem={renderFiles}
        ListEmptyComponent={renderListEmpty}
        keyExtractor={(item) => item.id.toString()}
      />
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
