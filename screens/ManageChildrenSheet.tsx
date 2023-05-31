import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useFormStore } from "../stores/useFormStore";
import { Button } from "react-native-paper";
import {
  BottomSheetScrollView,
  TouchableOpacity,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { navigate } from "../util/RootNavigation";

export const ManageChildrenSheet = () => {
  const { dismiss } = useBottomSheetModal();
  const { children, setActiveChild, activeChild } = useFormStore((state) => ({
    children: state.children,
    setActiveChild: state.setActiveChild,
    activeChild: state.activeChild,
  }));

  const scrollRef = useRef<ScrollView>(null);

  //   useEffect(() => {
  //     scrollRef.current?.scrollTo({
  //       y: (activeChild || 1) * 40,
  //       animated: true,
  //     });
  //   }, [activeChild]);

  return (
    <View
      style={{
        flex: 1,
        padding: 18,
      }}
    >
      <Button
        mode="contained"
        onPress={() => {
          navigate("AddChild");
          dismiss();
        }}
        buttonColor="#7976FF"
        icon={"account-plus"}
        style={{
          marginBottom: 20,
          borderRadius: 10,
        }}
      >
        Add chlid
      </Button>
      <Text
        style={{
          fontFamily: "SourceSansPro-Bold",
          fontSize: 18,
          color: "black",
          marginBottom: 20,
        }}
      >
        Select child
      </Text>
      <BottomSheetScrollView
        ref={scrollRef}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 100,
        }}
      >
        {children.map((child, index) => (
          <TouchableOpacity
            onPress={() => {
              setActiveChild(index);
              dismiss();
            }}
            key={index}
            style={{
              padding: 15,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#e3e3e3",
              backgroundColor: activeChild === index ? "#f2f2ff" : "white",
              justifyContent: "space-between",
              flexDirection: "row",

              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 20,
              }}
            >
              <Ionicons name="person" size={20} color="black" />
              <Text
                style={{
                  fontFamily: "SourceSansPro-SemiBold",
                  fontSize: 16,
                  color: "black",
                }}
              >
                {child.first_name} {child.last_name}
              </Text>
            </View>
            {activeChild === index && (
              <Ionicons name="checkmark-circle" size={24} color="#7976FF" />
            )}
          </TouchableOpacity>
        ))}
      </BottomSheetScrollView>
    </View>
  );
};

export default ManageChildrenSheet;

const styles = StyleSheet.create({});
