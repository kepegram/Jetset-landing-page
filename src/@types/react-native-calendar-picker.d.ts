declare module "react-native-calendar-picker" {
  import { Component } from "react";
  import { ViewStyle, TextStyle } from "react-native";

  interface CalendarPickerProps {
    onDateChange: (date: Date, type: string) => void;
    allowRangeSelection?: boolean;
    minDate?: Date;
    todayBackgroundColor?: string;
    previousComponent?: JSX.Element;
    nextComponent?: JSX.Element;
    selectedRangeStyle?: ViewStyle;
    selectedDayTextStyle?: TextStyle;
    dayTextStyle?: TextStyle;
    monthTitleStyle?: TextStyle;
    yearTitleStyle?: TextStyle;
    disabledDatesTextStyle?: TextStyle;
    textStyle?: TextStyle;
    selectedDayStyle?: ViewStyle;
    width?: number;
    selectedStartDate?: Date;
    selectedEndDate?: Date;
  }

  export default class CalendarPicker extends Component<CalendarPickerProps> {}
}
