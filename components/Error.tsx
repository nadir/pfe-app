import { Icon } from "@rneui/base";
import { View, Text } from "react-native";

const Error = ({ message }: { message: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        backgroundColor: "#f8d7da",
        borderRadius: 5,
        paddingHorizontal: 15,
        minHeight: 50,
      }}
    >
      <Icon
        type="material-community"
        name="alert-circle"
        color="red"
        size={20}
      />
      <Text
        style={{
          color: "red",
          fontFamily: "SourceSansPro-Regular",
          fontSize: 12,
          marginLeft: 5,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default Error;
