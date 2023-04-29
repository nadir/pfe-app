import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useFormStore } from "../stores/useFormStore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/base";
import Messages from "./Messages";
import Schedules from "./Schedules";
import Courses from "./Courses";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import ImageIcon from "../components/ImageIcon";
import Feed from "./Feed";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={{
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
        options={{
          tabBarBadge: "+9",

          tabBarIcon: ({ focused }) => (
            <ImageIcon
              focused={focused}
              icon={require("../assets/icons/icons8-communication-96.png")}
              grayscale={require("../assets/icons/communication-grayscale.png")}
            />
          ),
        }}
        component={Messages}
      />
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
  const logout = useFormStore((state) => state.logout);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={logout} />
    </DrawerContentScrollView>
  );
}

const MainScreen = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="Feed" component={TabNavigation} />
      <Drawer.Screen name="Add Child" component={TabNavigation} />
      <Drawer.Screen name="Settings" component={TabNavigation} />
    </Drawer.Navigator>
  );
};

// an image icon that returns grayscale if inactive and color image if active

export default MainScreen;

const styles = StyleSheet.create({});
