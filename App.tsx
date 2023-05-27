import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus, Platform, StyleSheet } from "react-native";
import {
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
} from "react-native-paper";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "react-query";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import { fontConfig } from "./config/fontConfig";
import SignupScreen from "./screens/Signup/SignupScreen";
import { useFormStore } from "./stores/useFormStore";
import WelcomeScreen from "./screens/WelcomeScreen";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import MainScreen from "./screens/MainScreen";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";

import messaging from "@react-native-firebase/messaging";

import { utils } from "@react-native-firebase/app";
import { fetchUser } from "./services/fetchUser";
import { requestNotificationPermission } from "./util/requestNotificationPermission";
import { refreshFCMToken } from "./services/refreshFCMToken";
import { cacheImages } from "./util/cacheImages";
import { queryClient } from "./util/queryClient";
import { fetchStudents } from "./services/fetchStudents";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createStackNavigator();

export const Icon = createIconSetFromIcoMoon(
  require("./assets/icons/selection.json"),
  "Icons8",
  "icons8.ttf"
);

const { isAvailable: isGooglePlayServiceAvailable } =
  utils().playServicesAvailability;

// refetch data on app focus
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}
// refetch data on app online
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

// create navigation ref for notifications
const navigationRef = createNavigationContainerRef();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const { token, setToken, setLoggedInUser, setChildren, setActiveChild } =
    useFormStore((state) => ({
      token: state.token,
      setToken: state.setToken,
      setLoggedInUser: state.setLoggedInUser,
      setChildren: state.setChildren,
      setActiveChild: state.setActiveChild,
    }));

  useEffect(() => {
    async function prepare() {
      try {
        await requestNotificationPermission();
        await Font.loadAsync({
          Icons8: require("./assets/icons/icons8.ttf"),
          "SourceSansPro-Black": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Black.ttf"),
          "SourceSansPro-Bold": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf"),
          "SourceSansPro-Regular": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf"),
          "SourceSansPro-SemiBold": require("./assets/fonts/Source_Sans_Pro/SourceSansPro-SemiBold.ttf"),
        });

        const imageAssets = cacheImages([
          require("./assets/icons/books-grayscale.png"),
          require("./assets/icons/calendar-grayscale.png"),
          require("./assets/icons/communication-grayscale.png"),
          require("./assets/icons/newspaper-grayscale.png"),
          require("./assets/icons/icons8-books-96.png"),
          require("./assets/icons/icons8-calendar-96.png"),
          require("./assets/icons/icons8-communication-96.png"),
          require("./assets/icons/icons8-newspaper-96.png"),
        ]);

        await Promise.all([...imageAssets]);
        const token = await SecureStore.getItemAsync("token");

        // check if token is still valid and populate user data
        if (token) {
          try {
            const data = await fetchUser(token);
            if (data) {
              setToken(token);
              setLoggedInUser({
                id: data.user_id,
                firstName: data.first_name,
                email: data.email,
                user_type: data.user_type,
                lastName: data.last_name,
                profilePicture: data.profile_picture,
                address: data.address,
                phoneNumber: data.phone_number,
                username: data.username,
              });
              if (data.user_type === "parent") {
                const childrenDetails = await fetchStudents(token);
                setChildren(childrenDetails);
                setActiveChild(0);
              }
              await refreshFCMToken(token);
            }
          } catch (e) {
            await SecureStore.deleteItemAsync("token");
            setToken("");
          }
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();

    // react-query refetch on app focus subscription
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
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
    <QueryClientProvider client={queryClient}>
      <PaperProvider
        theme={{
          ...DefaultTheme,
          dark: false,
          colors: {
            ...DefaultTheme.colors,
          },
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <NavigationContainer
              onReady={onLayoutRootView}
              ref={navigationRef}
              linking={{
                prefixes: [Linking.createURL("/")],
                config: {
                  screens: {
                    Home: "",
                    Login: "login",
                    Signup: "signup",
                    Account: {
                      path: "account",
                      screens: {
                        Chat: {
                          initialRouteName: "RecentChats",
                          path: "chat",
                          screens: {
                            ChatMessages: "/:id",
                          },
                        },
                      },
                    },
                  },
                },
                async getInitialURL() {
                  // Check if app was opened from a deep link
                  const url = await Linking.getInitialURL();

                  if (url != null) {
                    return url;
                  }

                  const message = await messaging().getInitialNotification();

                  // Get deep link from data
                  // if this is undefined, the app will open the default/home page
                  return message?.data?.link;
                },
                subscribe(listener) {
                  const onReceiveURL = ({ url }: { url: string }) =>
                    listener(url);
                  // Listen to incoming links from deep linking
                  const subscription = Linking.addEventListener(
                    "url",
                    onReceiveURL
                  );

                  // Listen to notification opened from background
                  const unsubNotification = messaging().onNotificationOpenedApp(
                    (message) => {
                      const url = message?.data?.link;
                      if (url) {
                        listener(url);
                      }
                    }
                  );

                  return () => {
                    // Clean up the event listeners
                    subscription.remove();
                    unsubNotification();
                  };
                },
              }}
            >
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
            <StatusBar style="dark" />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </QueryClientProvider>
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
