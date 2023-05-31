import { View, TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import { FC, useState } from "react";
import { PublicationProps } from "./FeedItemTypes";

export const Publication: FC<PublicationProps> = ({ text, title, image }) => {
  const [showMore, setShowMore] = useState(false);

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
      <Text
        numberOfLines={3}
        onTextLayout={(e) => {
          setShowMore(e.nativeEvent.lines.length >= 3);
        }}
        style={{
          fontFamily: "SourceSansPro-Regular",
          fontSize: 14,
        }}
      >
        {text}
      </Text>

      {showMore && (
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "SourceSansPro-SemiBold",
              color: "#7976FF",
              fontSize: 14,
            }}
          >
            Read more
          </Text>
        </TouchableOpacity>
      )}

      {/* post image */}
      {image &&
        (console.log(image),
        (
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
            transition={500}
          />
        ))}
    </View>
  );
};
