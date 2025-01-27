import { View, Text, StyleSheet, Dimensions } from "react-native";
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

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")}`;
    }
    return "Select your travel dates";
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.headerContainer}>
        <Text
          style={[styles.subheading, { color: currentTheme.textSecondary }]}
        >
          When?
        </Text>
        <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
          Choose your dates
        </Text>
        <Text
          style={[styles.dateRangeText, { color: currentTheme.textSecondary }]}
        >
          {getDateRangeText()}
        </Text>
      </View>

      <View style={styles.calendarWrapper}>
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          todayBackgroundColor={currentTheme.alternate}
          selectedStartDate={startDate?.toDate()}
          selectedEndDate={endDate?.toDate()}
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
          selectedDayStyle={{
            backgroundColor: currentTheme.alternate,
            borderRadius: 8,
          }}
          selectedDayTextStyle={styles.selectedDayText}
          dayTextStyle={{ color: currentTheme.textPrimary }}
          monthTitleStyle={{
            ...styles.monthTitle,
            color: currentTheme.textPrimary,
          }}
          yearTitleStyle={{
            ...styles.yearTitle,
            color: currentTheme.textPrimary,
          }}
          disabledDatesTextStyle={styles.disabledDates}
          textStyle={{ color: currentTheme.textPrimary }}
          width={Dimensions.get("window").width - 60}
        />
      </View>

      <View style={styles.buttonContainer}>
        <MainButton
          buttonText="Continue"
          onPress={OnDateSelectionContinue}
          width="85%"
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
  headerContainer: {
    marginTop: 100,
    paddingHorizontal: 10,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
  },
  heading: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dateRangeText: {
    fontSize: 16,
    marginTop: 8,
  },
  calendarWrapper: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 15,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  yearTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "600",
  },
  disabledDates: {
    color: "rgba(128,128,128,0.5)",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default ChooseDate;
