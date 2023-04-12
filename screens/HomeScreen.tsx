import { InteractionManager, StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { Button } from "react-native-paper";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }: any) => {
  const [animation, setAnimation] = useState<any>(null);
  const lottie = useRef<any>(null);
  useLayoutEffect(() => {
    const animation = require("../assets/illustrations/intro.json");
    setAnimation(animation);
  }, []);

  // when welcome page is out of focus pause the animation
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        lottie.current?.play();
      });

      return () => {
        task.cancel();
        lottie.current?.pause();
      };
    }, [])
  );

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
            ref={lottie}
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
          lottie.current?.pause();
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
