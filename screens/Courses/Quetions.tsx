import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type QuestionsProps = {
  primaryColor: string;
  secondaryColor: string;
};

const Quetions = ({ primaryColor, secondaryColor }: QuestionsProps) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          alignSelf: "stretch",
          backgroundColor: "white",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#e3e3e3",
          padding: 15,
          justifyContent: "space-between",
        }}
      >
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={3}
          maxLength={200}
          outlineColor="#e3e3e3"
          style={{
            backgroundColor: "white",
          }}
          outlineStyle={{
            borderWidth: 0,
          }}
          activeOutlineColor="#c2c2c2"
          placeholder="Type your question here..."
        />
        <Button
          mode="contained"
          style={{
            marginTop: 10,
            backgroundColor: primaryColor,
          }}
        >
          Ask
        </Button>
      </View>
    </View>
  );
};

export default Quetions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    minHeight: 1000,
    backgroundColor: "#F6F6F6",
  },
});
