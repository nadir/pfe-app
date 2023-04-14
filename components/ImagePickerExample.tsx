import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TouchableRipple } from "react-native-paper";

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableRipple
        onPress={pickImage}
        rippleColor="rgba(0, 0, 0, .09)"
        style={{
          flex: 1,
          alignSelf: "stretch",
          borderRadius: 20,
          marginVertical: 40,
          backgroundColor: "#f1f1f1",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#929292", fontSize: 20 }}>Upload Image</Text>
      </TouchableRipple>

      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}