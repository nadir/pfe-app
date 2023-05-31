import { FC, ReactNode, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, IconButton, Button } from "react-native-paper";
import { Poll } from "./Poll";
import { Publication } from "./Publication";
import { Dimensions } from "react-native";
import { queryClient } from "../../util/queryClient";
import { produce } from "immer";
import { useFormStore } from "../../stores/useFormStore";
import { formatDistanceToNow } from "date-fns";
import { API_URL } from "../../config/constants";
import { data } from "./data";
import Toast from "react-native-toast-message";
import { FeedItemProps } from "./FeedItemTypes";

export const FeedItem: FC<FeedItemProps> = ({
  id,
  user,
  isLiked,
  likesCount,
  commentsCount,
  type,
  created_at,
  text,
  options,
  image,
  title,
  question,
  poll_id,
  votedOption,
  cardStyle,
}) => {
  const token = useFormStore((state) => state.token);
  const userId = useFormStore((state) => state.loggedInUser.id);
  const lastItemId = useRef(id);

  // // ref to liked posts
  // const likedPosts = useRef<number[]>([]);
  const [liked, setLiked] = useState(isLiked);
  const formattedDate = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    includeSeconds: true,
  }).replace("about ", "");

  if (id !== lastItemId.current) {
    lastItemId.current = id;
    setLiked(isLiked);
  }
  return (
    <View style={[styles.card, cardStyle]}>
      {/* Author profile pic and posted at date */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar.Text
            size={40}
            label={user.name[0] + user.name[1]}
            color="white"
            style={{
              backgroundColor: "#c3c2ff",
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontFamily: "SourceSansPro-SemiBold" }}>
              {user.name}
            </Text>
            <Text
              style={{ fontFamily: "SourceSansPro-Regular", color: "gray" }}
            >
              Posted {formattedDate}
            </Text>
          </View>
        </View>
        {user.id === userId && (
          <IconButton
            icon={"trash-can-outline"}
            onPress={async () => {
              try {
                await fetch(`${API_URL}/posts/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
              } catch (error) {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: "Something went wrong",
                });
              }
              queryClient.setQueryData(["feed"], (data: any) => ({
                pages: produce(data.pages, (draft: any) => {
                  draft.forEach((page: any) => {
                    page.data = page.data.filter((post: any) => post.id !== id);
                  });
                }),
                pageParams: data.pageParams,
              }));
            }}
          />
        )}
      </View>
      {/* render poll or publication*/}

      {type === "poll" ? (
        <Poll
          // @ts-ignore
          id={poll_id}
          options={options}
          votedOptionId={votedOption}
          question={question}
          token={token}
        />
      ) : (
        <Publication title={title} text={text} image={image} />
      )}

      {/* like and comment count */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Button
          onPress={() => {}}
          icon="comment"
          mode="text"
          textColor="#444360"
        >
          {commentsCount} Replies
        </Button>
        <Button
          onPress={async () => {
            setLiked(!liked);

            await fetch(`${API_URL}/posts/${id}/like`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}}`,
              },
            });

            // data is pages full of list of posts
            // i want to get the post with id = id
            queryClient.setQueryData(["feed"], (data: any) => ({
              pages: produce(data.pages, (draft: any) => {
                draft.forEach((page: any) => {
                  page.data.forEach((post: any) => {
                    if (post.id === id) {
                      post.isLiked = !post.isLiked;
                      if (post.isLiked) {
                        post.likesCount += 1;
                      } else {
                        post.likesCount -= 1;
                      }
                    }
                  });
                });
              }),
              pageParams: data.pageParams,
            }));
          }}
          mode="text"
          // it was initialy liked but now it's isLiked ? :D why tf is this working
          textColor={isLiked ? "#ea4518" : "#444360"}
          icon={isLiked ? "heart" : "heart-outline"}
        >
          {likesCount}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: "white",
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
});
