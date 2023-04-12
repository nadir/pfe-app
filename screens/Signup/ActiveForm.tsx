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
        padding: 10,
        borderBottomWidth: 2,
        borderColor: active ? "#7976FF" : "#a7a4a4",
      }}
    >
      <Text
        style={{
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
      <FormTitle label="Personal Information" active={activeStep === 0} />
      <FormTitle label="Child Information" active={activeStep === 1} />
      <FormTitle label="Upload Proof" active={activeStep === 2} />
    </View>
  );
};

export default ActiveForm;

const styles = StyleSheet.create({});
