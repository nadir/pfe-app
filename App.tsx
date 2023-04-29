import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider, configureFonts } from "react-native-paper";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import * as NavigationBar from "expo-navigation-bar";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import { fontConfig } from "./config/fontConfig";
import SignupScreen from "./screens/Signup/SignupScreen";
import { useFormStore } from "./stores/useFormStore";
import WelcomeScreen from "./screens/WelcomeScreen";

import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import MainScreen from "./screens/MainScreen";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createStackNavigator();

export const Icon = createIconSetFromIcoMoon(
  require("./assets/icons/selection.json"),
  "Icons8",
  "icons8.ttf"
);

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const { token, setToken } = useFormStore((state) => ({
    token: state.token,
    setToken: state.setToken,
  }));

  useEffect(() => {
    async function prepare() {
      try {
        await NavigationBar.setBackgroundColorAsync("#ffffff");
        await NavigationBar.setButtonStyleAsync("dark");
        await Font.loadAsync({
          Icons8: require("./assets/icons/icons8.ttf"),
          "SourceSansPro-Black": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Black.ttf"),
          "SourceSansPro-Bold": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf"),
          "SourceSansPro-Regular": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf"),
        });
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          setToken(token);
        }
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
          {token ? (
            <Stack.Screen
              name="Account"
              component={MainScreen}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <>
              <Stack.Screen name="Home" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
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
