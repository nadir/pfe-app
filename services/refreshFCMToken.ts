import Constants from "expo-constants";
import { API_URL } from "../config/constants";
import messaging from "@react-native-firebase/messaging";
import { utils } from "@react-native-firebase/app";

export const fetchRefreshToken = async (token: string, fcmToken: string) => {
  try {
    const data = await fetch(`${API_URL}/user/firebase/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: fcmToken,
      }),
    });
    if (!data.ok) throw new Error(data.statusText);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const refreshFCMToken = async (token: string) => {
  if (Constants.executionEnvironment === "bare") {
    const { isAvailable: isGooglePlayServiceAvailable } =
      utils().playServicesAvailability;

    if (isGooglePlayServiceAvailable) {
      const fcmToken = await messaging().getToken();
      if (fcmToken && token) {
        await fetchRefreshToken(token, fcmToken);
      }
    } else {
      console.log("play services not available");
    }
  }
};
