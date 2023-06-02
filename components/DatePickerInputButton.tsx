import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Icon } from "@rneui/base";
import { Platform } from "react-native";

type DatePickerInputButtonProps = {
  error: boolean;
  onSet: (date: Date) => void;
};

const DatePickerInputButton = ({
  error,
  onSet,
}: DatePickerInputButtonProps) => {
  return (
    <Icon
      type="material-community"
      name="calendar"
      color={error ? "#f44336" : "#7976FF"}
      onPress={() => {
        if (Platform.OS === "android") {
          DateTimePickerAndroid.open({
            value: new Date(),
            mode: "date",
            onChange: (event, date) => {
              if (event.type === "set") {
                if (date) {
                  onSet(date);
                }
              }
            },
          });
        }
      }}
    />
  );
};

export default DatePickerInputButton;
