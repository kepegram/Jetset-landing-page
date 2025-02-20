import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useContext, useCallback, useState } from "react";
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

  // Handle date selection from calendar
  const onDateChange = useCallback(
    async (date: Date, type: string) => {
      if (!date) return;

      const momentDate = moment(date);

      try {
        if (type === "START_DATE") {
          // Set start date and clear end date if it's before new start date
          setStartDate(momentDate);
          if (endDate && endDate.isBefore(momentDate)) {
            setEndDate(null);
          }
          await AsyncStorage.setItem("startDate", momentDate.toISOString());
        } else {
          // Validate and set end date
          if (startDate && momentDate.isBefore(startDate)) {
            return;
          }
          setEndDate(momentDate);
          await AsyncStorage.setItem("endDate", momentDate.toISOString());
        }
      } catch (error) {
        console.error("Error saving date to AsyncStorage:", error);
      }
    },
    [startDate, endDate]
  );

  // Handle continue button press after date selection
  const handleDateSelectionContinue = useCallback(() => {
    // Validate date selection
    if (!startDate || !endDate) {
      Alert.alert("Missing Dates", "Please select both start and end dates");
      return;
    }

    if (endDate.isBefore(startDate)) {
      Alert.alert("Invalid Dates", "End date cannot be before start date");
      return;
    }

    // Calculate total number of days
    const totalNoOfDays = endDate.diff(startDate, "days") + 1;

    // Update trip data with selected dates
    setTripData({
      ...tripData,
      startDate,
      endDate,
      totalNoOfDays,
    });

    navigation.navigate("WhosGoing");
  }, [startDate, endDate, tripData, setTripData, navigation]);

  // Add this new handler function after the other handlers
  const handleResetDates = useCallback(async () => {
    setStartDate(null);
    setEndDate(null);
    try {
      await AsyncStorage.removeItem("startDate");
      await AsyncStorage.removeItem("endDate");
    } catch (error) {
      console.error("Error clearing dates from AsyncStorage:", error);
    }
  }, []);

  const getDateRangeText = useCallback(() => {
    if (startDate && endDate) {
      const nights = endDate.diff(startDate, "days");
      return `${startDate.format("MMM D")} - ${endDate.format(
        "MMM D, YYYY"
      )} • ${nights} ${nights === 1 ? "night" : "nights"}`;
    }
    return "Select your travel dates";
  }, [startDate, endDate]);

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
              Choose your dates 📅
            </Text>
            <View style={styles.dateRangeWrapper}>
              <View
                style={[
                  styles.dateRangeContainer,
                  { backgroundColor: currentTheme.alternate + "20" },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={currentTheme.textSecondary}
                />
                <Text
                  style={[
                    styles.dateRangeText,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  {getDateRangeText()}
                </Text>
              </View>
              {(startDate || endDate) && (
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color={currentTheme.textSecondary}
                  onPress={handleResetDates}
                  style={[
                    styles.resetIcon,
                    { backgroundColor: currentTheme.alternate + "20" },
                  ]}
                />
              )}
            </View>
          </View>

          <View
            style={[
              styles.calendarWrapper,
              { backgroundColor: currentTheme.alternate + "10" },
            ]}
          >
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
                backgroundColor: `${currentTheme.alternate}50`,
              }}
              selectedDayStyle={{
                backgroundColor: currentTheme.alternate,
              }}
              selectedDayTextStyle={{
                color: "#FFFFFF",
                fontWeight: "600",
              }}
              textStyle={{ color: currentTheme.textPrimary }}
              dayTextStyle={{ color: currentTheme.textPrimary }}
              monthTitleStyle={{
                color: currentTheme.textPrimary,
                fontSize: 20,
                fontWeight: "700",
              }}
              yearTitleStyle={{
                color: currentTheme.textPrimary,
                fontSize: 20,
                fontWeight: "700",
              }}
              disabledDatesTextStyle={{ color: "rgba(128,128,128,0.5)" }}
              width={Dimensions.get("window").width - 40}
              height={420}
              scaleFactor={375}
            />
          </View>

          <View style={styles.buttonContainer}>
            <MainButton
              buttonText={startDate && endDate ? "Continue" : "Select Dates"}
              onPress={handleDateSelectionContinue}
              width="85%"
              backgroundColor={currentTheme.alternate}
              disabled={!startDate || !endDate}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 32,
  },
  subheading: {
    fontSize: 16,
    fontFamily: "outfit",
    opacity: 0.8,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    marginBottom: 8,
  },
  dateRangeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  dateRangeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  dateRangeText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  calendarWrapper: {
    flex: 1,
    marginTop: 32,
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
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
  resetIcon: {
    padding: 8,
    borderRadius: 8,
  },
});

export default ChooseDate;
