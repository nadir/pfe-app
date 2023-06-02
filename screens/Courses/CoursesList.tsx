import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Course from "./Course";
import { Button, TouchableRipple } from "react-native-paper";
import { Image } from "expo-image";

import { SafeAreaView } from "react-native-safe-area-context";

import { courseData } from "./courseData";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFormStore } from "../../stores/useFormStore";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import { useModules } from "../../services/useModules";

type CourseCardProps = {
  name: string;
  color: string;
  icon: string;
  id: number;
  class_id: number;
  navigation: NativeStackScreenProps<
    CourseStackParams,
    "CoursesList"
  >["navigation"];
};

const CourseCard = ({
  name,
  color,
  icon,
  navigation,
  id,
  class_id,
}: CourseCardProps) => {
  // course card that has icon, name and color of the course
  // when pressed it navigates to the course page
  return (
    <View
      style={{
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <TouchableRipple
        onPress={() =>
          navigation.navigate("Course", {
            name,
            color,
            icon,
            id,
            class_id,
          })
        }
        style={{
          alignSelf: "stretch",
          backgroundColor: color,
          borderRadius: 10,
          height: 100,
          padding: 30,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: icon,
            }}
            contentFit="cover"
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
            }}
          />
          <Text
            style={{
              fontFamily: "SourceSansPro-Bold",
              fontSize: 20,
              color: "white",
            }}
          >
            {name}
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
};

const CoursesList = ({
  navigation,
}: NativeStackScreenProps<CourseStackParams, "CoursesList">) => {
  const token = useFormStore((state) => state.token);
  const user_type = useFormStore((state) => state.loggedInUser.user_type);
  let classId = "";
  if (user_type === "parent") {
    classId = useFormStore(
      (state) => state.children[state.activeChild || 0].class_id
    );
  }

  const { data, isLoading, isError, error, refetch } = useModules(
    token,
    classId
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 15,
          gap: 20,
        }}
        style={{
          flex: 1,
        }}
      >
        {data?.map((course, index) => (
          <CourseCard
            key={index}
            navigation={navigation}
            name={
              user_type === "teacher"
                ? course.name + " - " + course.class_name
                : course.name
            }
            color={course.color}
            icon={course.icon}
            id={course.id}
            // @ts-ignore

            class_id={
              // @ts-ignore
              user_type === "teacher" ? course.class_id : classId
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export type CourseStackParams = {
  Course: {
    name: string;
    color: string;
    icon: string;
    id: number;
    class_id: number;
  };
  CoursesList: undefined;
};

const StackNavigator = createStackNavigator<CourseStackParams>();

export default function Courses() {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStatusBarStyle("auto");
      StatusBar.setStatusBarBackgroundColor("#F6F6F6", true);
    }, [])
  );
  return (
    <StackNavigator.Navigator
      initialRouteName="CoursesList"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* course with name color and id */}

      <StackNavigator.Screen name="Course" component={Course} />
      <StackNavigator.Screen name="CoursesList" component={CoursesList} />
    </StackNavigator.Navigator>
  );
}

const styles = StyleSheet.create({});
