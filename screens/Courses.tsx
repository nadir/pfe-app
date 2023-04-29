import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TabbedHeaderPager } from "react-native-sticky-parallax-header";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const Courses = () => {
  const navigation = useNavigation();
  return (
    <>
      <TabbedHeaderPager
        // renderHeaderBar={() => (
        //   <SafeAreaView>
        //     <View
        //       style={{
        //         width: "100%",
        //         alignSelf: "flex-end",
        //         flexDirection: "row",
        //       }}
        //     >
        //       <Text
        //         style={{
        //           color: "white",
        //           fontFamily: "SourceSansPro-Bold",
        //           fontSize: 20,
        //         }}
        //       >
        //         Math
        //       </Text>
        //     </View>
        //   </SafeAreaView>
        // )}
        backgroundColor={"#7976FF"}
        foregroundImage={require("../assets/icons/icons8-books-96.png")}
        title="Math"
        tabTextContainerActiveStyle={{
          backgroundColor: "#a1a0ff",
        }}
        tabTextStyle={{
          color: "white",
          fontFamily: "SourceSansPro-Regular",
        }}
        tabs={[
          {
            title: "Courses",
          },
          {
            title: "Assignments",
          },
          {
            title: "Exams",
          },
          {
            title: "Questions",
          },
          {
            title: "About",
          },
        ]}
        titleStyle={{
          fontFamily: "SourceSansPro-Bold",
        }}
      >
        <View style={{ height: 1000, backgroundColor: "white" }}>
          <Text>Content here bruh</Text>
        </View>
      </TabbedHeaderPager>
      <StatusBar style="inverted" />
    </>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
