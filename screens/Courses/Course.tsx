import { Keyboard, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  PagerMethods,
  TabbedHeaderPager,
} from "react-native-sticky-parallax-header";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CourseStackParams } from "./CoursesList";
import { adjustHex } from "../../util/adjustHex";
import { set } from "lodash";
import Quetions from "./Quetions";
import { Button } from "react-native-paper";
import CourseFiles from "./CourseFiles";
import Homeworks from "./Homeworks";
import { useFormStore } from "../../stores/useFormStore";

type CourseProps = NativeStackScreenProps<CourseStackParams, "Course">;

const Course = ({ navigation, route }: CourseProps) => {
  const colorShade = adjustHex(route.params.color, 15);

  const user_type = useFormStore((state) => state.loggedInUser.user_type);

  const [activeTab, setActiveTab] = useState(0);

  const parallaxHeaderRef = useRef<ScrollView>(null);

  useEffect(() => {
    const KeyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      parallaxHeaderRef.current?.scrollTo({
        y: 400,
        animated: true,
      });
      return () => {
        KeyboardShowListener.remove();
      };
    });
  }, []);

  return (
    <>
      <TabbedHeaderPager
        ref={parallaxHeaderRef}
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
        backgroundColor={route.params.color}
        foregroundImage={{
          uri: route.params.icon,
        }}
        // pagerProps={{
        //   ref: pagerRef,
        // }}
        title={route.params.name}
        tabTextContainerActiveStyle={{
          backgroundColor: colorShade,
        }}
        tabTextStyle={{
          color: "white",
          fontFamily: "SourceSansPro-Regular",
        }}
        tabs={[
          {
            title: "Resources",
          },
          {
            title: "Homeworks",
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
        onChangeTab={(prevPage: number, newPage: number) => {
          setActiveTab(newPage);
        }}
      >
        {activeTab === 0 && (
          <CourseFiles id={route.params.id} color={colorShade} />
        )}
        {activeTab === 1 && (
          <Homeworks
            color={colorShade}
            user_type={user_type}
            navigation={navigation}
            classId={route.params.class_id!}
            moduleId={route.params.id}
          />
        )}
        {activeTab === 2 && (
          <Quetions
            moduleId={route.params.id}
            primaryColor={route.params.color}
            secondaryColor={colorShade}
          />
        )}
        {activeTab === 3 && (
          <View style={styles.container}>
            <Text>Shut up</Text>
          </View>
        )}
      </TabbedHeaderPager>
      <StatusBar style="light" />
    </>
  );
};

export default Course;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
    backgroundColor: "white",
    alignItems: "center",
  },
});
