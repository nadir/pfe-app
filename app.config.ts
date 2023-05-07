import { ExpoConfig, ConfigContext } from "expo/config";
import Constants from "expo-constants";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "pfe-app",
  slug: "pfe-app",
  plugins: process.env.FIREBASE ? ["@react-native-firebase/app"] : [],
});
