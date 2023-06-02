import { View, TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import { FC, useState } from "react";
import { PublicationProps } from "./FeedItemTypes";
import ReadMore from "@fawazahmed/react-native-read-more";

export const Publication: FC<PublicationProps> = ({ text, title, image }) => {
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      {title && (
        <Text
          style={{
            fontFamily: "SourceSansPro-SemiBold",
            fontSize: 18,
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
      )}
      <ReadMore
        numberOfLines={4}
        animate={false}
        style={{
          fontFamily: "SourceSansPro-Regular",
          fontSize: 14,
        }}
        seeMoreText="Read more"
        seeMoreStyle={{
          fontFamily: "SourceSansPro-SemiBold",
          color: "#7976FF",
          fontSize: 14,
          marginLeft: 5,
        }}
        seeLessStyle={{
          fontFamily: "SourceSansPro-SemiBold",
          color: "#7976FF",
          fontSize: 14,
          marginLeft: 5,
        }}
      >
        {text}
      </ReadMore>

      {/* post image */}
      {image && (
        <Image
          recyclingKey={image}
          source={{
            uri: image,
          }}
          placeholder={"LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
          contentFit="cover"
          style={{
            height: 200,

            marginTop: 20,
            borderRadius: 10,
          }}
          transition={{
            duration: 300,
            effect: "cross-dissolve",
          }}
        />
      )}
    </View>
  );
};
