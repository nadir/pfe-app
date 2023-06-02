import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

const Messages = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("Chat");
        }}
      >
        Go to random chat
      </Button>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
