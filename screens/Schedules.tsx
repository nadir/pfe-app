import { SectionList, StyleSheet, Text, View } from "react-native";
import * as StatusBar from "expo-status-bar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const scheduleData = [
  {
    title: "Sunday",
    data: [
      {
        start_time: "11:00 AM",
        end_time: "12:00 PM",
        module_name: "Chemistry",
      },

      {
        start_time: "12:00 PM",
        end_time: "1:00 PM",
        module_name: "Biology",
      },
    ],
  },
  {
    title: "Monday",
    data: [
      {
        start_time: "9:00 AM",
        end_time: "10:00 AM",
        module_name: "Math",
      },
      {
        start_time: "10:00 AM",
        end_time: "11:00 AM",
        module_name: "Physics",
      },

      {
        start_time: "11:00 AM",
        end_time: "12:00 PM",
        module_name: "Chemistry",
      },

      {
        start_time: "12:00 PM",
        end_time: "1:00 PM",
        module_name: "Biology",
      },
    ],
  },
  {
    title: "Tuesday",
    data: [
      {
        start_time: "9:00 AM",
        end_time: "10:00 AM",
        module_name: "Math",
      },
      {
        start_time: "10:00 AM",
        end_time: "11:00 AM",
        module_name: "Physics",
      },
    ],
  },
];

const DATA = [
  {
    title: "Main dishes",
    data: ["Pizza", "Burger", "Risotto"],
  },
  {
    title: "Sides",
    data: ["French Fries", "Onion Rings", "Fried Shrimps"],
  },
  {
    title: "Drinks",
    data: ["Water", "Coke", "Beer"],
  },
  {
    title: "Desserts",
    data: ["Cheese Cake", "Ice Cream"],
  },
];

const Schedules = () => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setStatusBarStyle("dark");
      StatusBar.setStatusBarBackgroundColor("white", true);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        style={{}}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 50,
        }}
        sections={scheduleData}
        keyExtractor={(item, index) => item.module_name + index}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.module_name}</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={styles.right}>
                <Text style={styles.subtitle}>{item.start_time}</Text>
              </View>
              <View style={styles.left}>
                <Text style={styles.subtitle}>{item.end_time}</Text>
              </View>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  item: {
    backgroundColor: "#fff",
    borderColor: "#dbdbdb",
    borderWidth: 1,
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 22,
    fontFamily: "SourceSansPro-Bold",
    marginTop: 25,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "SourceSansPro-SemiBold",
    width: 150,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "SourceSansPro-Regular",
    color: "white",
  },
  left: {
    width: 80,

    backgroundColor: "#7976FF",
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  right: {
    width: 80,
    paddingHorizontal: 10,
    backgroundColor: "#605dff",
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 5,
  },
});

export default Schedules;
