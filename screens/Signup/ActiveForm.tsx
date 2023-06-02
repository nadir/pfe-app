import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type FormElementProps = {
  label: string;
  active: boolean;
};

const FormTitle: React.FC<FormElementProps> = ({ label, active }) => {
  return (
    <View
      style={{
        borderBottomWidth: 2,
        width: "23%",
        paddingBottom: 5,
        borderColor: active ? "#7976FF" : "#a7a4a4",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          color: active ? "#7976FF" : "#a7a4a4",
        }}
        variant="bodySmall"
      >
        {label}
      </Text>
    </View>
  );
};

export const ActiveForm: React.FC<{ activeStep: number }> = ({
  activeStep,
}) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 20,
        paddingHorizontal: 5,
      }}
    >
      <FormTitle label="Personal data" active={activeStep === 0} />
      <FormTitle label="Login Details" active={activeStep === 1} />
      <FormTitle label="Child Details" active={activeStep === 2} />
      <FormTitle label="Upload Proof" active={activeStep === 3} />
    </View>
  );
};

export default ActiveForm;

const styles = StyleSheet.create({});
