import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFormStore } from "../../stores/useFormStore";
import { useContacts } from "./useContacts";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import { Avatar } from "@rneui/base";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ChatStackParamList } from "./chat";
import { useState } from "react";

const ChatContact = (
  user_id: string,
  first_name: string,
  last_name: string,
  navigation: StackNavigationProp<ChatStackParamList, "StartChat">,
  profile_pic?: string
) => {
  const initials = `${first_name[0]}${last_name[0]}`;
  const fullName = `${first_name} ${last_name}`;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#d5d4e3",
      }}
      onPress={() => {
        navigation.navigate("ChatMessages", {
          id: user_id,
          name: fullName,
        });
      }}
    >
      <Avatar
        rounded
        {...(profile_pic ? { source: { uri: profile_pic } } : {})}
        title={initials}
        containerStyle={{
          backgroundColor: "#c3c2ff",
        }}
      />
      <Text>{fullName}</Text>
    </TouchableOpacity>
  );
};

const noContacts = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontFamily: "SourceSansPro-SemiBold" }}>
        No contacts found
      </Text>
    </View>
  );
};

type StartChatProps = StackScreenProps<ChatStackParamList, "StartChat">;

const StartChat = ({ navigation }: StartChatProps) => {
  const [search, setSearch] = useState<string>("");
  const { token } = useFormStore((state) => ({
    token: state.token,
  }));

  const { data, isLoading, isError, error, refetch } = useContacts(
    token,
    search
  );
  useRefreshOnFocus(refetch);

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
        }}
      >
        {/* <IconButton icon="arrow-left" onPress={() => navigation.goBack()} /> */}
        <Searchbar
          placeholder="Search for a teacher to contact"
          cursorColor={"#c3c2ff"}
          onChangeText={(text) => {
            setSearch(text);
          }}
          style={{
            flex: 1,
            elevation: 20,
            borderWidth: 1,
            borderColor: "#d5d4e3",
          }}
          value={search}
        />
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) =>
          ChatContact(
            item.user_id,
            item.first_name,
            item.last_name,
            navigation,
            item.profile_pic
          )
        }
        keyExtractor={(item) => item.user_id}
        ListEmptyComponent={isLoading ? null : noContacts}
      />
    </SafeAreaView>
  );
};

export default StartChat;

const styles = StyleSheet.create({});
