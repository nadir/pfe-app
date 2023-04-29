import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TouchableRipple } from "react-native-paper";
import { Icon } from "@rneui/base";
import { Ionicons } from "@expo/vector-icons";
import { useFormStore } from "../stores/useFormStore";

export default function ImagePickerPrompt() {
  const { image, setImage } = useFormStore((state) => ({
    image: state.proofOfEnrollment,
    setImage: state.setProofOfEnrollment,
  }));

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableRipple
        onPress={pickImage}
        rippleColor="rgba(199, 199, 199, 0.09)"
        borderless={true}
        style={[
          styles.container,
          image ? styles.containerActive : styles.containerInactive,
        ]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            padding: 20,
          }}
        >
          {image ? (
            <Ionicons name="checkmark-circle" size={60} color="green" />
          ) : (
            <Ionicons name="document-attach-outline" size={60} color="grey" />
          )}

          <Text
            style={[
              styles.text,
              image ? styles.textActive : styles.textInactive,
            ]}
          >
            Upload a picture of your child's school certificate
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "SourceSansPro-Regular",
    textAlign: "center",
  },
  textActive: {
    color: "#425e40",
  },
  textInactive: {
    color: "#929292",
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 10,
    marginVertical: 25,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#7aa677",
  },
  containerActive: {
    backgroundColor: "#fafffb",
    borderWidth: 0.4,
    borderColor: "#a6c0a5",
  },
  containerInactive: {
    backgroundColor: "#f5f5f5",
  },
});
