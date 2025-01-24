import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/themeContext";
import { MainButton } from "../../../../components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import { CreateTripContext } from "../../../../context/createTripContext";
import moment, { Moment } from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ChooseDateNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChooseDate"
>;

const ChooseDate: React.FC = () => {
  const navigation = useNavigation<ChooseDateNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  const onDateChange = (date: Date, type: string) => {
    const momentDate = moment(date);
    if (type === "START_DATE") {
      setStartDate(momentDate);
      AsyncStorage.setItem("startDate", momentDate.toISOString());
    } else {
      setEndDate(momentDate);
      AsyncStorage.setItem("endDate", momentDate.toISOString());
    }
  };

  const OnDateSelectionContinue = () => {
    if (!startDate || !endDate) {
      alert("Please select Start and End Date");
      return;
    }

    if (endDate.isBefore(startDate)) {
      alert("End date cannot be before start date");
      return;
    }

    const totalNoOfDays = endDate.diff(startDate, "days");
    const updatedTripData = {
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalNoOfDays: totalNoOfDays + 1,
    };
    setTripData(updatedTripData);
    console.log("Updated Trip Data:", updatedTripData);
    navigation.navigate("WhosGoing");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.subheading, { color: currentTheme.textSecondary }]}>
        When?
      </Text>
      <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
        Choose your dates
      </Text>
      <View style={styles.calendarContainer}>
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
          selectedDayTextStyle={styles.selectedDayText}
          dayTextStyle={{ color: currentTheme.textPrimary }}
          monthTitleStyle={{ color: currentTheme.textPrimary }}
          yearTitleStyle={{ color: currentTheme.textPrimary }}
          disabledDatesTextStyle={styles.disabledDates}
          textStyle={{ color: currentTheme.textPrimary }}
        />
        <MainButton
          style={styles.continueButton}
          buttonText="Continue"
          onPress={OnDateSelectionContinue}
          width="100%"
          backgroundColor={currentTheme.alternate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subheading: {
    fontSize: 16,
    marginTop: 100,
    marginBottom: 8,
    marginLeft: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 10,
  },
  calendarContainer: {
    padding: 30,
    marginTop: 40,
  },
  selectedDayText: {
    color: "white",
  },
  disabledDates: {
    color: "grey",
  },
  continueButton: {
    marginTop: 80,
  },
});

export default ChooseDate;
