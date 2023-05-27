import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useStudentNotes } from "./useStudentNotes";
import { useFormStore } from "../../stores/useFormStore";
import { FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

function formatNumber(number: number) {
  if (number % 1 !== 0) {
    return number.toFixed(2);
  } else {
    return number.toString();
  }
}

const StudentNotes = () => {
  const { activeChild, token, children } = useFormStore((state) => ({
    activeChild: state.activeChild,
    token: state.token,
    children: state.children,
  }));

  //@ts-ignore
  let child_id = children[activeChild].id;

  const { data, isLoading, isError, refetch, isRefetching } = useStudentNotes(
    token,
    child_id
  );

  const ListHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 23,
          paddingVertical: 16,
          backgroundColor: "#7976FF",
        }}
      >
        <View>
          <Text style={styles.noteTitle}>Module</Text>
        </View>
        <View style={styles.notesContainer}>
          <View
            style={{
              width: 45,
            }}
          >
            <Text style={styles.noteTitle}>Eval</Text>
          </View>
          <View
            style={{
              width: 45,
            }}
          >
            <Text style={styles.noteTitle}>Test</Text>
          </View>
          <View
            style={{
              width: 45,
            }}
          >
            <Text style={styles.noteTitle}>Exam</Text>
          </View>
          <View
            style={{
              width: 45,
            }}
          >
            <Text style={styles.noteTitle}>Avg</Text>
          </View>
        </View>
      </View>
    );
  };

  let renderFooter = () => {
    return (
      <View
        style={{
          padding: 20,

          backgroundColor: "#f8f8ff",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-end",
            gap: 20,
          }}
        >
          <Text
            style={[
              styles.noteTitle,
              {
                color: "#000000",
              },
            ]}
          >
            Average:
          </Text>
          <View
            style={[
              styles.noteBox,
              {
                width: 100,
                borderBottomColor: (data?.average ?? 0) < 10 ? "red" : "green",
                borderBottomWidth: 2,
                backgroundColor: "#ffffff",
              },
            ]}
          >
            <Text style={styles.noteValue}>{data?.average}</Text>
          </View>
        </View>
      </View>
    );
  };

  let renderItem = ({ item }: any) => {
    return (
      <View style={styles.noteCard}>
        <Image
          style={styles.noteIcon}
          source={{
            uri: item.module_icon,
          }}
        />
        <Text style={styles.noteName}>{item.module_name}</Text>
        <View style={styles.notesContainer}>
          <View style={styles.noteBox}>
            <Text style={styles.noteValue}>
              {formatNumber(item.evaluation)}
            </Text>
          </View>
          <View style={styles.noteBox}>
            <Text style={styles.noteValue}>{formatNumber(item.test)}</Text>
          </View>
          <View style={styles.noteBox}>
            <Text style={styles.noteValue}>{formatNumber(item.exam)}</Text>
          </View>
          <View
            style={[
              styles.noteBox,
              {
                borderBottomColor: "#c8c7fc",
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text style={styles.noteValue}>{formatNumber(item.average)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <ListHeader />
        <FlatList
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                paddingTop: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={{ color: "#fff" }}>No notes available</Text>
              )}
            </View>
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          data={data?.notes || []}
          ListFooterComponent={renderFooter}
          renderItem={renderItem}
          keyExtractor={(item) => item.module_name}
        />
      </View>
      <StatusBar style="light" backgroundColor="#7976FF" />
    </SafeAreaView>
  );
};

export default StudentNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noteCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e4",
  },
  notesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  noteBox: {
    backgroundColor: "#f5f5ff",
    borderRadius: 5,
    padding: 6,
    width: 45,
  },
  noteValue: {
    fontFamily: "SourceSansPro-Regular",
    fontSize: 14,
  },
  noteName: {
    width: 100,
    fontFamily: "SourceSansPro-SemiBold",
    fontSize: 16,
  },
  noteIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  noteTitle: {
    fontFamily: "SourceSansPro-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
