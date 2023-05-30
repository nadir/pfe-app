import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import { data } from "./Feed/data";
import { FeedItem } from "./Feed/FeedItem";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "react-query";
import { API_URL } from "../config/constants";
import { useFormStore } from "../stores/useFormStore";
import { ActivityIndicator, IconButton, Searchbar } from "react-native-paper";
import { queryClient } from "../util/queryClient";
import { useCallback, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import { TouchableOpacity } from "react-native";

const useInfiniteFeed = (token: string) => {
  return useInfiniteQuery(
    ["feed"],
    async ({ pageParam = "" }) => {
      try {
        const response = await fetch(
          `${API_URL}/posts?nextCursor=${pageParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    }
  );
};

const Feed = ({ navigation }: { navigation: any }) => {
  const token = useFormStore((state) => state.token);
  const userId = useFormStore((state) => state.loggedInUser.id);
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteFeed(token);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStatusBarStyle("dark");
      StatusBar.setStatusBarBackgroundColor("#F6F6F6", true);
      StatusBar.setStatusBarTranslucent(true);
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <FlashList
        estimatedItemSize={300}
        contentContainerStyle={styles.container}
        // @ts-ignore
        data={data?.pages?.flatMap((page) => page.data) ?? []}
        onRefresh={() => {
          queryClient.invalidateQueries({
            queryKey: ["feed"],
            refetchActive: true,
          });
        }}
        refreshing={isLoading}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate("PostDetails", item);
              }}
            >
              <FeedItem {...item} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        getItemType={(item) => item.type}
        onEndReached={() => {
          console.log("im at the end");
          if (!isFetchingNextPage || !isLoading) {
            if (hasNextPage) fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.8}
        ListHeaderComponent={() => {
          const [searchQuery, setSearchQuery] = useState("");
          // search bar
          return (
            <Searchbar
              style={{
                marginVertical: 15,
                borderRadius: 10,
                padding: 0,
                backgroundColor: "#fff",
                borderColor: "#e8e8e8",
                borderWidth: 1,
              }}
              placeholder="Search"
              onChangeText={(text) => {
                setSearchQuery(text);
              }}
              value={searchQuery}
              mode="bar"
              right={(props) => (
                // return arrow icon if search query is not empty
                <IconButton
                  {...props}
                  icon={searchQuery ? "arrow-right" : "close"}
                  onPress={() => {
                    console.log("search query", searchQuery);
                  }}
                />
              )}
            />
          );
        }}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator style={{ marginTop: 20 }} animating={true} />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#F6F6F6",
  },
});
