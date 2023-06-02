import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedItem } from "./FeedItem";
import { IconButton } from "react-native-paper";
import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";
import { useFormStore } from "../../stores/useFormStore";
import Toast from "react-native-toast-message";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const useComments = (postId: string, token: string) => {
  return useQuery<Comment[]>(["comments", postId], async () => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
};

interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  first_name: string;
  last_name: string;
  profile_pic: string | null;
}

const FeedDetails = ({ id }: { id: string }) => {
  const token = useFormStore((state) => state.token);
  const user_id = useFormStore((state) => state.loggedInUser.id);
  const { data, isLoading, isError, error, refetch } = useComments(id, token);

  const renderComment = ({ item }: { item: Comment }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          backgroundColor: "white",
          borderBottomColor: "#E6E6E6",
          borderBottomWidth: 1,
          gap: 30,
          paddingHorizontal: 10,
        }}
      >
        <View style={{ flex: 0.1 }}>
          <IconButton icon="account" />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text style={{ fontFamily: "SourceSansPro-SemiBold" }}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={{ fontFamily: "SourceSansPro-Regular", color: "gray" }}>
            {item.content}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
          }}
        >
          {item.user_id === user_id && (
            <IconButton
              onPress={async () => {
                try {
                  await fetch(`${API_URL}/posts/comments/${item.id}/delete`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  refetch();
                } catch (error) {
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: (error as Error).message,
                  });
                }
              }}
              icon="trash-can-outline"
              iconColor="red"
            />
          )}
        </View>
      </View>
    );
  };

  const renderListHeader = () => {
    const publishComment = async () => {
      if (comment.length === 0) return;
      try {
        await fetch(`${API_URL}/posts/${id}/comments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
          }),
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: (error as Error).message,
        });
      }

      setComment("");
      refetch();
    };
    const [comment, setComment] = useState("");

    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderBottomColor: "#E6E6E6",
            paddingBottom: 10,
            borderBottomWidth: 1,
          }}
        >
          <TextInput
            style={{
              flex: 0.9,
              fontFamily: "SourceSansPro-Regular",
            }}
            value={comment}
            onSubmitEditing={publishComment}
            onChangeText={(text) => setComment(text)}
            placeholder="Add a comment..."
          ></TextInput>
          <IconButton
            iconColor="#a19fff"
            icon="send"
            onPress={publishComment}
          />
        </View>
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <BottomSheetFlatList
          ListHeaderComponent={renderListHeader}
          data={data}
          renderItem={renderComment}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={() => {
            return (
              <View
                style={{
                  height: 50,
                }}
              ></View>
            );
          }}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: "SourceSansPro-SemiBold",
                  }}
                >
                  No comments found
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default FeedDetails;

const styles = StyleSheet.create({
  commentsCard: {
    backgroundColor: "white",
  },
});
