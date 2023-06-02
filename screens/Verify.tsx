import { Icon } from "@rneui/base";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormStore } from "../stores/useFormStore";
import { fetchStudents } from "../services/fetchStudents";
import { useFocusEffect } from "@react-navigation/native";
import * as StatusBar from "expo-status-bar";
import { useEffect, useState } from "react";

const Verify = () => {
  useEffect(() => {
    StatusBar.setStatusBarBackgroundColor("#F6F6F6", true);
  }, []);

  const [loading, setLoading] = useState(false);

  const token = useFormStore((state) => state.token);
  const { children, setChildren, setActiveChild } = useFormStore((state) => ({
    children: state.children,
    setChildren: state.setChildren,
    setActiveChild: state.setActiveChild,
  }));

  const reverify = async () => {
    setLoading(true);
    const childrenDetails = await fetchStudents(token);
    setChildren(childrenDetails);
    setLoading(false);
  };

  const sheetRef = useFormStore((state) => state.bottomSheetRef);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Icon name="lock" size={40} />
        <Text
          style={{
            fontFamily: "SourceSansPro-SemiBold",
            fontSize: 18,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Please wait while an admin verifies your child's affiliation with our
          school
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Button
            icon={"account-switch"}
            mode="contained"
            buttonColor="#7976FF"
            style={{
              marginTop: 20,
              borderRadius: 10,
            }}
            onPress={() => {
              sheetRef.current?.present();
            }}
          >
            Switch active child
          </Button>
          <Button
            icon={"reload"}
            buttonColor="#7976FF"
            mode="contained"
            style={{
              marginTop: 20,
              borderRadius: 10,
            }}
            disabled={loading}
            loading={loading}
            onPress={() => {
              reverify();
            }}
          >
            Reverify
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Verify;

const styles = StyleSheet.create({});
