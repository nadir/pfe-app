import Constants from "expo-constants";
import messaging from "@react-native-firebase/messaging";

export async function requestNotificationPermission() {
  if (Constants.executionEnvironment === "bare") {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }
}
