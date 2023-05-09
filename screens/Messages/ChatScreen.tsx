import React, { useState, useCallback, useEffect } from "react";
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import socketio from "../../services/socket";
import { useFormStore } from "../../stores/useFormStore";
import { StackScreenProps } from "@react-navigation/stack";
import { ChatStackParamList } from "./chat";
import { API_URL } from "../../config/constants";
import { useFocusEffect } from "@react-navigation/native";
import { View } from "react-native";

export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: any;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: any;
}

const sendMessage = async (token: string, id: string, message: string) => {
  const response = await fetch(`${API_URL}/messages/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receiver_id: id, content: message }),
  });
  const data = await response.json();
  return data;
};

const fetchMessages = async (token: string, id: string, page = 0) => {
  const response = await fetch(`${API_URL}/messages/user/${id}?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export default function Chat({
  navigation,
  route,
}: StackScreenProps<ChatStackParamList, "ChatMessages">) {
  const { id } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { token, id: user_id } = useFormStore((state) => ({
    id: state.loggedInUser.id,
    token: state.token,
  }));

  const [page, setPage] = useState(0);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [shouldLoadEarlier, setShouldLoadEarlier] = useState(true);

  const socket = socketio(token);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const data = await fetchMessages(token, id);
        if (data.length < 20) {
          setShouldLoadEarlier(false);
        }
        const messages = data.map((message: any) => {
          return {
            _id: message.id,
            text: message.content,
            createdAt: message.created_at,
            user: {
              _id: message.sender_id,
            },
          };
        });
        setMessages(messages);
      };
      fetch();
    }, [id])
  );

  useEffect(() => {
    socket.on("message", (message: any) => {
      if (message.sender_id === id) {
        const append: IMessage = {
          _id: message.id,
          text: message.content,
          createdAt: message.created_at,
          user: {
            _id: message.sender_id,
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [append])
        );
      }
    });

    return () => {
      socket.off("message");
    };
  }, []);

  // load earlier messages by increasing page number
  const onLoadEarlier = useCallback(async () => {
    setLoadingEarlier(true);
    const messages = await fetchMessages(token, id, page + 1);

    if (messages.length < 20) {
      setShouldLoadEarlier(false);
    }
    const newMessages = messages.map((message: any) => {
      return {
        _id: message.id,
        text: message.content,
        createdAt: message.created_at,
        user: {
          _id: message.sender_id,
        },
      };
    });
    setMessages((previousMessages) =>
      GiftedChat.prepend(previousMessages, newMessages)
    );
    setPage((page) => page + 1);
    setLoadingEarlier(false);
  }, [page]);

  const onSend = useCallback((messages = []) => {
    //@ts-ignore
    sendMessage(token, id, messages[0].text).then((data) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <GiftedChat
        //@ts-ignore
        multiline={false}
        messages={messages}
        //@ts-ignore
        onSend={(messages) => onSend(messages)}
        alwaysShowSend
        renderAvatar={() => {
          return null;
        }}
        showAvatarForEveryMessage={true}
        isLoadingEarlier={loadingEarlier}
        onLoadEarlier={onLoadEarlier}
        loadEarlier={shouldLoadEarlier}
        infiniteScroll
        renderBubble={(props) => (
          <Bubble
            {...props}
            containerStyle={{
              left: {
                marginVertical: 0,
              },
              right: {},
            }}
            renderTime={() => {
              return null;
            }}
            wrapperStyle={{
              left: {
                borderColor: "#d6d6ea",
                borderWidth: 0.5,
                backgroundColor: "#ffffff",
                paddingHorizontal: 5,
                paddingVertical: 3,
              },
              right: {
                backgroundColor: "#7976FF",
                paddingHorizontal: 5,
                paddingVertical: 3,
              },
            }}
            tickStyle={{}}
            usernameStyle={{ color: "tomato", fontWeight: "100" }}
            containerToNextStyle={{
              left: { borderColor: "navy", borderWidth: 4 },
              right: {},
            }}
            containerToPreviousStyle={{
              left: { borderColor: "mediumorchid", borderWidth: 4 },
              right: {},
            }}
          />
        )}
        minInputToolbarHeight={100}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{
              fontFamily: "SourceSansPro-Regular",
            }}
            textInputProps={{
              blurOnSubmit: false,
              onSubmitEditing: () => {
                //@ts-ignore
                if (props.text && props.onSend) {
                  //@ts-ignore
                  props.onSend({ text: props.text.trim() }, true);
                }
              },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              padding: 10,
              borderTopColor: "#ddddff",
            }}
          />
        )}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 22,
              marginLeft: 10,
            }}
          >
            <Ionicons name="send" size={20} color="#7976FF" />
          </Send>
        )}
        user={{
          _id: user_id,
        }}
      />
    </View>
  );
}
