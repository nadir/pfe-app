import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useFormStore } from "../stores/useFormStore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";
import Messages from "./Messages";
import Schedules from "./Schedules";
import Courses from "./Courses/CoursesList";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import ImageIcon from "../components/ImageIcon";
import Feed from "./Feed";
import ChatNavigator from "./Messages/ChatNavigator";
import SocketContext from "../util/SocketContext";
import socketio from "../services/socket";
import { Socket } from "socket.io-client";
import AddContent from "./AddContent";
import { IconButton } from "react-native-paper";
import { TransitionPresets } from "@react-navigation/stack";
import AddHomework from "./AddHomework";
import Notes from "./Notes/Notes";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { set } from "lodash";
import { ScrollView } from "react-native-gesture-handler";
import ManageChildrenSheet from "./ManageChildrenSheet";
import { useNavigation } from "@react-navigation/native";
import StudentNotes from "./Notes/StudentNotes";
import FeedDetails from "./Feed/FeedDetails";
import AddChild from "./AddChild";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const user_type = useFormStore((state) => state.loggedInUser.user_type);
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => <TouchableOpacity {...props} />,

        headerShown: false,
        tabBarIcon: () => <Icon name="settings"></Icon>,
        tabBarLabelStyle: {
          paddingBottom: 10,
          fontFamily: "SourceSansPro-Regular",
          fontSize: 12,
        },
        tabBarStyle: {
          height: 70,
        },
        tabBarActiveTintColor: "#000000",
        tabBarBadgeStyle: {
          backgroundColor: "red",
          color: "white",
          fontSize: 10,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <ImageIcon
              focused={focused}
              icon={require("../assets/icons/icons8-newspaper-96.png")}
              grayscale={require("../assets/icons/newspaper-grayscale.png")}
            />
          ),
        }}
        name="Home"
        component={Feed}
      />
      <Tab.Screen
        name="Messages"
        options={({ navigation }) => ({
          unmountOnBlur: true,
          tabBarBadge: "+9",
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() =>
                navigation.navigate("Chat", { screen: "RecentChats" })
              }
            />
          ),
          tabBarIcon: ({ focused }) => (
            <ImageIcon
              focused={focused}
              icon={require("../assets/icons/icons8-communication-96.png")}
              grayscale={require("../assets/icons/communication-grayscale.png")}
            />
          ),
        })}
        component={Messages}
      />
      {user_type === "parent" ? (
        <Tab.Screen
          name="Schedule"
          options={{
            tabBarIcon: ({ focused }) => (
              <ImageIcon
                focused={focused}
                icon={require("../assets/icons/icons8-calendar-96.png")}
                grayscale={require("../assets/icons/calendar-grayscale.png")}
              />
            ),
          }}
          component={Schedules}
        />
      ) : (
        <Tab.Screen
          name="Add"
          options={{
            tabBarIcon: ({ focused }) => (
              <IconButton
                icon="plus"
                size={35}
                iconColor="white"
                style={{
                  backgroundColor: "#7976FF",
                  elevation: 5,
                  borderWidth: 5,
                  borderColor: "white",
                  borderRadius: 50,
                  marginBottom: 20,
                }}
              />
            ),
          }}
          component={AddContent}
        />
      )}
      <Tab.Screen
        name="Courses"
        options={{
          tabBarIcon: ({ focused }) => (
            <ImageIcon
              focused={focused}
              icon={require("../assets/icons/icons8-books-96.png")}
              grayscale={require("../assets/icons/books-grayscale.png")}
            />
          ),
        }}
        component={Courses}
      />
      <Tab.Screen
        options={({ navigation }) => ({
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => navigation.toggleDrawer()}
            />
          ),

          tabBarIcon: ({ focused }) => (
            <ImageIcon
              focused={focused}
              icon={require("../assets/icons/menu.png")}
              grayscale={require("../assets/icons/menu.png")}
            />
          ),
        })}
        name="More"
        component={Feed}
      />
    </Tab.Navigator>
  );
};

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { logout, bottomSheetRef } = useFormStore((state) => ({
    logout: state.logout,
    bottomSheetRef: state.bottomSheetRef,
  }));
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Children"
        onPress={() => {
          props.navigation.closeDrawer();
          bottomSheetRef.current?.present();
        }}
      />
      <DrawerItem label="Logout" onPress={logout} />
    </DrawerContentScrollView>
  );
}

const MainScreen = () => {
  const setBottomSheetRef = useFormStore((state) => state.setBottomSheetRef);
  const user_type = useFormStore((state) => state.loggedInUser.user_type);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  useEffect(() => {
    setBottomSheetRef(bottomSheetModalRef);
  }, []);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <ManageChildrenSheet />
      </BottomSheetModal>

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen name="Feed" component={TabNavigation} />
        <Drawer.Screen name="PostDetails" component={FeedDetails} />

        <Drawer.Screen
          name="Notes"
          component={user_type === "teacher" ? Notes : StudentNotes}
        />
        {/* <Drawer.Screen name="StudentNotes" component={StudentNotes} /> */}

        <Drawer.Screen name="Add Child" component={TabNavigation} />
        <Drawer.Screen name="Settings" component={TabNavigation} />
        <Drawer.Screen name="Chat" component={ChatNavigator} />
        <Drawer.Screen
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "Add Child",
            headerTitleStyle: {
              fontFamily: "SourceSansPro-SemiBold",
            },
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
          })}
          name="AddChild"
          component={AddChild}
        />

        <Drawer.Screen
          name="AddHomework"
          component={AddHomework}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "Add Homework",
            headerTitleStyle: {
              fontFamily: "SourceSansPro-SemiBold",
            },
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        />
      </Drawer.Navigator>
    </>
  );
};

// an image icon that returns grayscale if inactive and color image if active

export default MainScreen;

const styles = StyleSheet.create({});
