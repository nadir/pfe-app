import { createStackNavigator } from "@react-navigation/stack";
import RecentChats from "./RecentChats";
import Chat from "./ChatScreen";
import StartChat from "./StartChat";
import { ChatStackParamList } from "./chat";
import { IconButton } from "react-native-paper";
import { useFormStore } from "../../stores/useFormStore";
import { useEffect, useState } from "react";
import socketio from "../../services/socket";
import { Socket } from "socket.io-client";
import SocketContext from "../../util/SocketContext";

const Stack = createStackNavigator<ChatStackParamList>();

const ChatNavigator = () => {
  const token = useFormStore((state) => state.token);
  const [socketConnection, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = socketio(token);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketConnection}>
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
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
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
        <Stack.Screen
          name="StartChat"
          component={StartChat}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SocketContext.Provider>
  );
};

export default ChatNavigator;
