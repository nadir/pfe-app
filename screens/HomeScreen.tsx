import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { Button } from "react-native-paper";
import { useLayoutEffect, useRef, useState } from "react";

const HomeScreen = ({ navigation }: any) => {
  const [animation, setAnimation] = useState<any>(null);
  useLayoutEffect(() => {
    const animation = require("../assets/illustrations/intro.json");
    setAnimation(animation);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {animation && (
          <LottieView
            autoPlay
            style={{
              width: 350,
              height: 350,
            }}
            source={require("../assets/illustrations/intro.json")}
          />
        )}
      </View>
      <Text
        style={{
          fontFamily: "SourceSansPro-Bold",
          fontSize: 30,
          textAlign: "left",
        }}
      >
        Welcome Message Education app
      </Text>
      <Text
        style={{
          fontFamily: "SourceSansPro-Regular",
          color: "#929292",
          marginTop: 15,
          marginBottom: 40,
          fontSize: 16,
          textAlign: "left",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultricies,
        nisl sit amet ultricies lacinia, nisl nisl aliquet nisl sit amet
      </Text>
      <Button
        mode="contained"
        labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
        onPress={() => {
          navigation.navigate("Login");
        }}
        buttonColor="#7976FF"
        icon="arrow-right"
        style={styles.btn}
      >
        Get Started
      </Button>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
    padding: 50,
  },
  btn: {},
});
