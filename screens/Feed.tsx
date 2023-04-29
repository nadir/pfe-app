import { View, Text, StyleSheet } from "react-native";
import { useFormStore } from "../stores/useFormStore";

const Feed = () => {
  const logout = useFormStore((state) => state.logout);
  return (
    <View style={styles.container}>
      <Text>Welcome to the feed page</Text>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
