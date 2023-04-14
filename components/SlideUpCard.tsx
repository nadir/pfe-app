import React, { ReactChildren, ReactElement, ReactNode } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Animated, {
  BounceInDown,
  BounceOutDown,
  FadeIn,
  FadeOutDown,
  SlideInDown,
} from "react-native-reanimated";

type SlideUpCardProps = {
  children: ReactNode;
};

const SlideUpCard: React.FC<SlideUpCardProps> = ({ children }) => {
  return (
    <Animated.View
      entering={SlideInDown}
      exiting={FadeOutDown}
      style={styles.formCard}
    >
      {children}
    </Animated.View>
  );
};

export default SlideUpCard;

const styles = StyleSheet.create({
  formCard: {
    height: "90%",
    padding: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    alignSelf: "flex-start",
    shadowColor: "#0000002d",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.01,
    shadowRadius: 5.0,
    elevation: 24,
  },
});
