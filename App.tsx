import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider, configureFonts } from "react-native-paper";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { fontConfig } from "./config/fontConfig";
import SignupScreen from "./screens/Signup/SignupScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await NavigationBar.setBackgroundColorAsync("#ffffff");
        await NavigationBar.setButtonStyleAsync("dark");
        await Font.loadAsync({
          "SourceSansPro-Black": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Black.ttf"),
          "SourceSansPro-Bold": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf"),
          "SourceSansPro-Regular": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  const theme = {
    fonts: configureFonts({
      config: fontConfig,
    }),
  };

  return (
    <PaperProvider>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator
          detachInactiveScreens={true}
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "SourceSansPro-Regular",
  },
});
