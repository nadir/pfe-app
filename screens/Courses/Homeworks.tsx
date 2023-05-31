import { FlatList, StyleSheet, Text, View } from "react-native";
import FileCard from "../../components/FileCard";
import { useFormStore } from "../../stores/useFormStore";
import { Button, IconButton } from "react-native-paper";
import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";
import { format, formatDistanceToNow } from "date-fns";
import Toast from "react-native-toast-message";

interface Homework {
  id: number;
  module_id: number;
  class_id: number;
  title: string;
  description: string;
  file: string;
  due_date: string;
  created_at: string;
  author_id: string;
  filename: string;
}

const useHomeworks = (classId: number, moduleId: number, token: string) => {
  return useQuery<Homework[]>(["modules", moduleId, "homeworks"], async () => {
    const response = await fetch(
      `${API_URL}/modules/${moduleId}/${classId}/homeworks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.results;
  });
};

const Homeworks = ({
  navigation,
  moduleId,
  classId,
  user_type,
  color,
}: {
  navigation: any;
  moduleId: number;
  classId: number;
  user_type: string;
  color: string;
}) => {
  const token = useFormStore((state) => state.token);

  const {
    data: homeworks,
    isLoading,
    refetch,
  } = useHomeworks(classId, moduleId, token);

  console.log(homeworks);

  const rendrHomeworks = ({ item }: { item: Homework }) => {
    let formattedDate = formatDistanceToNow(new Date(item.created_at), {
      addSuffix: true,
      includeSeconds: true,
    }).replace("about ", "");
    return (
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#e3e3e3",
          marginHorizontal: 20,
          padding: 20,
          gap: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginLeft: 10,

            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "SourceSansPro-Bold",
              fontSize: 18,
              color: "black",
              flexGrow: 1,
            }}
          >
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {user_type === "teacher" ? (
              <>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#e53935"
                  style={{
                    backgroundColor: "#f2f2f2",
                  }}
                  size={20}
                  onPress={async () => {
                    const response = await fetch(
                      `${API_URL}/modules/homeworks/${item.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    const data = await response.json();

                    if (!response.ok) {
                      Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: data.message,
                      });
                    } else {
                      refetch();
                    }
                  }}
                />
              </>
            ) : (
              <Text
                style={{
                  fontFamily: "SourceSansPro-Regular",
                  fontSize: 12,
                  color: "grey",
                }}
              >
                Due on {format(new Date(item.due_date), "dd/MM/yyyy")}
              </Text>
            )}
          </View>
        </View>
        <Text
          style={{
            fontFamily: "SourceSansPro-Regular",
            fontSize: 12,
            color: "grey",
            marginLeft: 10,
          }}
        >
          {item.description}
        </Text>
        <FileCard name={item.filename} url={item.file} downloadable />
        <Text
          style={{
            fontFamily: "SourceSansPro-Regular",
            fontSize: 12,
            color: "grey",
            marginLeft: 10,
          }}
        >
          Posted {formattedDate}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {user_type === "teacher" && (
        <Button
          mode="contained"
          icon={"plus"}
          style={{
            marginHorizontal: 20,
            backgroundColor: color,
          }}
          onPress={() => {
            navigation.navigate("AddHomework");
          }}
        >
          Add Homework
        </Button>
      )}

      <FlatList
        contentContainerStyle={{
          gap: 20,
        }}
        data={homeworks}
        renderItem={rendrHomeworks}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
      />
    </View>
  );
};

export default Homeworks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    gap: 20,
    paddingTop: 30,
    minHeight: 1000,
  },
});
