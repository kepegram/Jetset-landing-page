import { View, Text, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import CalendarPicker from "react-native-calendar-picker";
import moment, { Moment } from "moment";
import { CreateTripContext } from "../../../context/createTripContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

type SelectDatesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SelectDates"
>;

const SelectDates: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<SelectDatesScreenNavigationProp>();
  const [startDate, setStartDate] = useState<Moment | undefined>();
  const [endDate, setEndDate] = useState<Moment | undefined>();
  const { tripData, setTripData } = useContext(CreateTripContext);

  const onDateChange = (date: Date, type: string) => {
    console.log(date, type);
    if (type === "START_DATE") {
      setStartDate(moment(date));
    } else {
      setEndDate(moment(date));
    }
  };

  const OnDateSelectionContinue = () => {
    // Check if both startDate and endDate are selected
    if (!startDate || !endDate) {
      alert("Please select Start and End Date");
      return;
    }

    // Ensure that endDate is after startDate before calculating
    if (endDate.isBefore(startDate)) {
      alert("End date cannot be before start date");
      return;
    }

    const totalNoOfDays = endDate.diff(startDate, "days");
    console.log(totalNoOfDays + 1);
    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalNoOfDays: totalNoOfDays + 1,
    });

    navigation.navigate("SelectTraveler");
  };

  return (
    <View
      style={{
        marginTop: 30,
        backgroundColor: currentTheme.background,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 35,
          color: currentTheme.textPrimary,
        }}
      >
        When?
      </Text>

      <View
        style={{
          marginTop: 10,
        }}
      >
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          todayBackgroundColor={currentTheme.alternate}
          previousComponent={
            <Ionicons
              name="chevron-back"
              size={30}
              color={currentTheme.textPrimary}
            />
          }
          nextComponent={
            <Ionicons
              name="chevron-forward"
              size={30}
              color={currentTheme.textPrimary}
            />
          }
          selectedRangeStyle={{
            backgroundColor: currentTheme.alternate,
          }}
          selectedDayTextStyle={{
            color: "white",
          }}
          dayTextStyle={{
            color: currentTheme.textPrimary,
          }}
          monthTitleStyle={{
            color: currentTheme.textPrimary,
          }}
          yearTitleStyle={{
            color: currentTheme.textPrimary,
          }}
          disabledDatesTextStyle={{
            color: "grey",
          }}
          textStyle={{
            color: currentTheme.textPrimary,
          }}
        />
      </View>

      <Pressable
        onPress={OnDateSelectionContinue}
        style={{
          padding: 15,
          backgroundColor: currentTheme.alternate,
          borderRadius: 15,
          marginTop: 35,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: currentTheme.buttonText,
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </Pressable>
    </View>
  );
};

export default SelectDates;
