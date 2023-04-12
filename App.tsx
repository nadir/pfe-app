import { useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  Button,
  MD2DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  configureFonts,
} from "react-native-paper";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { enableScreens } from "react-native-screens";
import { fontConfig } from "./config/fontConfig";
import SignupScreen from "./screens/Signup/SignupScreen";
enableScreens();
// Prevent native splash screen from autohiding before App component declaration
SplashScreen.preventAutoHideAsync();

// function HomeScreen({ navigation }: any) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Hello World ✨</Text>
//       {/* button that navigations to Login screen */}
//       <Button
//         mode="contained-tonal"
//         onPress={() => navigation.navigate("Login")}
//         style={{ marginTop: 20 }}
//       >
//         Login
//       </Button>
//     </View>
//   );
// }

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "SourceSansPro-Black": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Black.ttf"),
    "SourceSansPro-Bold": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf"),
    "SourceSansPro-Regular": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf"),
  });
  NavigationBar.setBackgroundColorAsync("#ffffff");
  NavigationBar.setButtonStyleAsync("dark");

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
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
