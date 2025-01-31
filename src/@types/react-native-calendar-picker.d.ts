declare module "react-native-calendar-picker" {
  import { ComponentType } from "react";
  import { ViewStyle, TextStyle } from "react-native";

  interface CalendarPickerProps {
    onDateChange: (date: Date, type: string) => void;
    allowRangeSelection?: boolean;
    selectedStartDate?: Date;
    selectedEndDate?: Date;
    minDate?: Date;
    selectedDayStyle?: ViewStyle;
    selectedDayTextStyle?: TextStyle;
    selectedRangeStyle?: ViewStyle;
    textStyle?: TextStyle;
    dayTextStyle?: TextStyle;
    monthTitleStyle?: TextStyle;
    yearTitleStyle?: TextStyle;
    [key: string]: any;
  }

  const CalendarPicker: ComponentType<CalendarPickerProps>;
  export default CalendarPicker;
}
