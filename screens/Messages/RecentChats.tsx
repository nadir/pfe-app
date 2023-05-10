import { formatDistanceToNow } from "date-fns";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, FAB, TouchableRipple } from "react-native-paper";
import { formatDistance } from "../../util/getRelativeTime";
import { Image } from "expo-image";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ChatStackParamList } from "./chat";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";
import { useFormStore } from "../../stores/useFormStore";
import { useRecentChats } from "./useRecentChats";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { Avatar } from "@rneui/base";

type ChatContactProps = {
  userId: string;
  firstName: string;
  lastName: string;
  image?: string;
  lastMessage: string;
  lastMessageTime: string;
  navigation: StackNavigationProp<ChatStackParamList, "RecentChats">;
};

const ChatContact = ({
  userId,
  firstName,
  lastName,
  image,
  lastMessage,
  lastMessageTime,
  navigation,
}: ChatContactProps) => {
  const parsedLastMessageTime = new Date(lastMessageTime);
  const formattedTime = formatDistanceToNow(parsedLastMessageTime, {
    locale: { formatDistance },
    addSuffix: true,
  });

  // get the initials of the user
  const initials = `${firstName[0]}${lastName[0]}`;

  const fullName = `${firstName} ${lastName}`;

  return (
    <TouchableRipple
      onPress={() => {
        navigation.navigate("ChatMessages", {
          id: userId,
          name: fullName,
        });
      }}
      rippleColor="#7876ff15"
      borderless={true}
    >
      <View style={styles.contactCard}>
        <Avatar
          rounded
          {...(image ? { source: { uri: image } } : {})}
          title={initials}
          containerStyle={styles.avatar}
        />

        <View
          style={{
            justifyContent: "center",
            marginLeft: 20,
            flex: 1,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "SourceSansPro-Regular",
              fontSize: 16,
            }}
          >
            {fullName}
          </Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "SourceSansPro-Regular",
                fontSize: 14,
                color: "gray",
                width: "85%",
                marginRight: 10,
              }}
            >
              {lastMessage}
            </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontFamily: "SourceSansPro-Bold",
                color: "#7976FF",
                fontSize: 14,
              }}
            >
              {formattedTime}
            </Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const EmptyResult = () => (
  <View
    style={{
      flex: 1,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      gap: 40,
    }}
  >
    <AntDesign name="message1" size={50} color="gray" />
    <Text
      style={{
        fontFamily: "SourceSansPro-Regular",
        fontSize: 16,
        color: "gray",
        textAlign: "center",
      }}
    >
      No recent messages found, start a new conversation!
    </Text>
  </View>
);

type RecentChatsProps = StackScreenProps<ChatStackParamList, "RecentChats">;

const RecentChats = ({ navigation }: RecentChatsProps) => {
  const token = useFormStore((state) => state.token);

  const { data, isLoading, isError, error, refetch } = useRecentChats(token);
  useRefreshOnFocus(refetch);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {isLoading && (
        <ActivityIndicator style={{ marginTop: 20 }} animating={true} />
      )}

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ChatContact
            userId={item.contact_id}
            firstName={item.first_name}
            lastName={item.last_name}
            image={item.profile_pic}
            lastMessage={item.content}
            lastMessageTime={item.created_at}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.contact_id}
        persistentScrollbar
        ListEmptyComponent={isLoading ? null : <EmptyResult />}
        extraData={isLoading}
      />
    </View>
  );
};

export default RecentChats;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#c3c2ff",
  },
  avatar: {
    backgroundColor: "#c3c2ff",
  },
  contactCard: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    borderColor: "#7876ff73",
    borderBottomWidth: 0.5,
  },
});
