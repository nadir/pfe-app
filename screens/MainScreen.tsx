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
import Verify from "./Verify";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabNavigation = ({ navigation }: { navigation: any }) => {
  const user_type = useFormStore((state) => state.loggedInUser.user_type);

  const verified = useFormStore((state) => {
    if (state.loggedInUser && state.loggedInUser.user_type === "parent") {
      const activeChild = state.activeChild;
      const children = state.children;

      if (
        activeChild !== null &&
        children &&
        children.length > activeChild &&
        children[activeChild].verified !== undefined
      ) {
        return children[activeChild].verified;
      }
    }

    return true;
  });

  console.log("user_type", verified);
  if (!verified) {
    navigation.setOptions({
      swipeEnabled: false,
    });
    return <Verify />;
  }
  // disable drawer swipe gesture

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
  const { user_type, logout, bottomSheetRef } = useFormStore((state) => ({
    logout: state.logout,
    bottomSheetRef: state.bottomSheetRef,
    user_type: state.loggedInUser.user_type,
  }));
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {user_type === "parent" && (
        <DrawerItem
          label="Children"
          onPress={() => {
            props.navigation.closeDrawer();
            bottomSheetRef.current?.present();
          }}
        />
      )}

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
          drawerActiveTintColor: "#7976FF",
          headerShown: false,
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen
          name="Feed"
          options={{
            drawerIcon: ({ focused }) => (
              <Ionicons
                name="newspaper"
                size={20}
                color={focused ? "#7976FF" : "grey"}
              />
            ),
          }}
          component={TabNavigation}
        />

        <Drawer.Screen
          name="Notes"
          options={{
            drawerIcon: ({ focused }) => (
              <Ionicons
                name="calculator"
                size={20}
                color={focused ? "#7976FF" : "grey"}
              />
            ),
          }}
          component={user_type === "teacher" ? Notes : StudentNotes}
        />
        {/* <Drawer.Screen name="StudentNotes" component={StudentNotes} /> */}

        <Drawer.Screen
          name="Chat"
          component={ChatNavigator}
          options={{
            drawerIcon: ({ focused }) => (
              <Ionicons
                name="chatbubble-ellipses"
                size={20}
                color={focused ? "#7976FF" : "grey"}
              />
            ),
          }}
        />
        {user_type === "parent" && (
          <Drawer.Screen
            options={({ navigation }) => ({
              drawerIcon: ({ focused }) => (
                <Ionicons
                  name="person-add"
                  size={20}
                  color={focused ? "#7976FF" : "grey"}
                />
              ),
              headerShown: true,
              headerTitle: "Add Child",
              headerTitleStyle: {
                fontFamily: "SourceSansPro-SemiBold",
              },
              drawerLabel: "Add Child",
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
        )}

        {user_type === "teacher" && (
          <Drawer.Screen
            name="AddHomework"
            component={AddHomework}
            options={({ navigation }) => ({
              drawerIcon: ({ focused }) => (
                <Ionicons
                  name="pencil"
                  size={20}
                  color={focused ? "#7976FF" : "grey"}
                />
              ),
              headerShown: true,
              headerTitle: "Add Homework",
              drawerLabel: "Add Homework",
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
        )}
      </Drawer.Navigator>
    </>
  );
};

// an image icon that returns grayscale if inactive and color image if active

export default MainScreen;

const styles = StyleSheet.create({});
