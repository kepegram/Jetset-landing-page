import { View, Text, StyleSheet, Dimensions, SafeAreaView } from "react-native";
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
      const nights = endDate.diff(startDate, "days");
      return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")} • ${nights} ${nights === 1 ? 'night' : 'nights'}`;
    }
    return "Select your travel dates";
  };

  return (
    <SafeAreaView
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
        <View style={[styles.dateRangeContainer, { backgroundColor: currentTheme.alternate + '20' }]}>
          <Ionicons name="calendar-outline" size={24} color={currentTheme.textSecondary} />
          <Text
            style={[styles.dateRangeText, { color: currentTheme.textSecondary }]}
          >
            {getDateRangeText()}
          </Text>
        </View>
      </View>

      <View style={[styles.calendarWrapper, { backgroundColor: currentTheme.alternate + '10' }]}>
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
              size={34}
              color={currentTheme.textPrimary}
            />
          }
          nextComponent={
            <Ionicons
              name="chevron-forward"
              size={34}
              color={currentTheme.textPrimary}
            />
          }
          selectedRangeStyle={{
            backgroundColor: currentTheme.alternate + '50',
          }}
          selectedDayStyle={{
            backgroundColor: currentTheme.alternate,
            borderRadius: 12,
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
          width={Dimensions.get("window").width - 40}
          height={420}
          scaleFactor={375}
        />
      </View>

      <View style={styles.buttonContainer}>
        <MainButton
          buttonText={startDate && endDate ? "Continue" : "Select Dates"}
          onPress={OnDateSelectionContinue}
          width="85%"
          backgroundColor={currentTheme.alternate}
          disabled={!startDate || !endDate}
        />
      </View>
    </SafeAreaView>
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
    marginBottom: 16,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  dateRangeText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  calendarWrapper: {
    marginTop: 24,
    alignItems: "center",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  selectedDayText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
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
