import { StyleSheet, Text, View } from "react-native";
import FileCard from "../../components/FileCard";
import { useFormStore } from "../../stores/useFormStore";
import { IconButton } from "react-native-paper";

const Homeworks = () => {
  const user_type = useFormStore((state) => state.loggedInUser.user_type);
  return (
    <View style={styles.container}>
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
            Introductory exercises
          </Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {user_type === "teacher" ? (
              <>
                <IconButton
                  icon="pencil"
                  style={{
                    backgroundColor: "#f2f2f2",
                  }}
                  size={20}
                  onPress={() => {}}
                />
                <IconButton
                  icon="delete"
                  iconColor="#e53935"
                  style={{
                    backgroundColor: "#f2f2f2",
                  }}
                  size={20}
                  onPress={() => {}}
                />
              </>
            ) : (
              <Text
                style={{
                  fontFamily: "SourceSansPro-Regular",
                  fontSize: 12,
                  color: "grey",
                  marginLeft: 10,
                }}
              >
                Due in 2 days
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          aliquet, augue eu ultricies lacinia, ipsum nibh dapibus erat, sed
          posuere justo nunc quis justo. Donec aliquet, augue eu ultricies
          lacinia, ipsum nibh dapibus erat, sed posuere justo nunc quis justo.
          Donec aliquet, augue eu ultricies lacinia, ipsum nibh dapibus erat,
          sed posuere justo nunc quis justo.
        </Text>
        <FileCard url="https://example/homework.pdf" />
        <Text
          style={{
            fontFamily: "SourceSansPro-Regular",
            fontSize: 12,
            color: "grey",
            marginLeft: 10,
          }}
        >
          Posted 2 days ago by H. Nadhir
        </Text>
      </View>
    </View>
  );
};

export default Homeworks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
    backgroundColor: "white",
    gap: 20,
    paddingTop: 30,
  },
});
