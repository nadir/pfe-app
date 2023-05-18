import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import { data } from "./Feed/data";
import { FeedItem } from "./Feed/FeedItem";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "react-query";
import { API_URL } from "../config/constants";
import { useFormStore } from "../stores/useFormStore";
import { ActivityIndicator } from "react-native-paper";
import { queryClient } from "../util/queryClient";

const useInfiniteFeed = (token: string) => {
  return useInfiniteQuery(
    ["feed"],
    async ({ pageParam = "" }) => {
      try {
        const response = await fetch(
          `http://192.168.100.103:6969/posts?nextCursor=${pageParam}`,
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

const Feed = () => {
  const token = useFormStore((state) => state.token);
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
          });
        }}
        refreshing={isLoading}
        renderItem={({ item }) => <FeedItem {...item} />}
        keyExtractor={(item) => item.id.toString()}
        getItemType={(item) => item.type}
        onEndReached={() => {
          console.log("im at the end");
          if (!isFetchingNextPage || !isLoading) {
            if (hasNextPage) fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.8}
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
