import { Image } from "react-native";

const ImageIcon = ({
  focused,
  icon,
  grayscale,
  size,
}: {
  focused: boolean;
  icon: any;
  grayscale: any;
  size?: number;
}) => {
  return (
    <Image
      source={focused ? icon : grayscale}
      style={{
        height: size ? size : 30,
        width: size ? size : 30,
      }}
    />
  );
};

export default ImageIcon;
