import { createStackNavigator } from "@react-navigation/stack";
import RecentChats from "./RecentChats";
import Chat from "./ChatScreen";
import StartChat from "./StartChat";
import { ChatStackParamList } from "./chat";
import { IconButton } from "react-native-paper";

const Stack = createStackNavigator<ChatStackParamList>();

const ChatNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RecentChats"
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "SourceSansPro-SemiBold",
        },
      }}
    >
      <Stack.Screen
        name="RecentChats"
        options={({ navigation }) => ({
          title: "Messages",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <IconButton
              icon="email-plus"
              onPress={() => navigation.navigate("StartChat")}
            />
          ),
        })}
        component={RecentChats}
      />
      <Stack.Screen
        name="ChatMessages"
        component={Chat}
        options={({ route }) => ({
          title: route.params.name || "Chat",
        })}
      />
      <Stack.Screen name="StartChat" component={StartChat} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
