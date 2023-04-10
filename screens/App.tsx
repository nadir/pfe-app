import { useCallback, useEffect, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import LottieView from "lottie-react-native";
SplashScreen.preventAutoHideAsync();

export default function App() {
  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);

  const [fontsLoaded] = useFonts({
    "SourceSansPro-Black": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Black.ttf"),
    "SourceSansPro-Bold": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf"),
    "SourceSansPro-Regular": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    await NavigationBar.setBackgroundColorAsync("#fff");
    await NavigationBar.setButtonStyleAsync("dark");
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 400,
            height: 400,
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("./assets/illustrations/intro.json")}
        />
        <View>
          <Text
            style={{
              fontFamily: "SourceSansPro-Bold",
              fontSize: 30,
              textAlign: "left",
            }}
          >
            Connect With Your Kids Teachers
          </Text>
          <Text
            style={{
              fontFamily: "SourceSansPro-Regular",
              fontSize: 18,
              color: "#929292",
            }}
          >
            Keep contact with teachers and help them to ensure your children's
            successful education journey.
          </Text>
        </View>
        {/* Button that says get started react native paper */}
        <Button
          mode="contained"
          style={styles.btn}
          labelStyle={{ fontFamily: "SourceSansPro-Bold" }}
          onPress={() => console.log("Pressed")}
          buttonColor="#7976FF"
          icon="arrow-right"
        >
          Get Started
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    margin: 10,
  },
  btn: {
    fontFamily: "SourceSansPro-Bold",
    width: "92%",
    borderRadius: 5,
    margin: 30,
  },
});
