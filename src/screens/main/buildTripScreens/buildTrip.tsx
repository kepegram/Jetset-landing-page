import {
  TextInput,
  View,
  Pressable,
  Text,
  ImageBackground,
} from "react-native";
import { useTheme } from "../../../context/themeContext";
import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateTripContext } from "../../../context/createTripContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/appNav";
import CalendarPicker from "react-native-calendar-picker";
import moment, { Moment } from "moment";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";

type BuildTripNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BuildTrip"
>;

interface ExtendedGooglePlaceDetail extends GooglePlaceDetail {
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

const BuildTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Moment | undefined>();
  const [endDate, setEndDate] = useState<Moment | undefined>();
  const [tripName, setTripName] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showSelectDates, setShowSelectDates] = useState(false);
  const navigation = useNavigation<BuildTripNavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  const isFormValid =
    tripData.locationInfo && tripName && selectedOption !== null;

  useEffect(() => {
    const loadDates = async () => {
      const storedStartDate = await AsyncStorage.getItem("startDate");
      const storedEndDate = await AsyncStorage.getItem("endDate");
      if (storedStartDate) {
        setStartDate(moment(storedStartDate));
      }
      if (storedEndDate) {
        setEndDate(moment(storedEndDate));
      }
    };
    loadDates();
  }, []);

  const handleOptionPress = (option: number) => {
    if (option === 2) {
      setShowSelectDates(true); // Show SelectDates component when option 2 is pressed
    } else {
      setSelectedOption(option);
    }
  };

  const onDateChange = (date: Date, type: string) => {
    console.log(date, type);
    if (type === "START_DATE") {
      setStartDate(moment(date));
      AsyncStorage.setItem("startDate", moment(date).toISOString());
    } else {
      setEndDate(moment(date));
      AsyncStorage.setItem("endDate", moment(date).toISOString());
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

    // Close the CalendarPicker
    setShowSelectDates(false);
  };

  const handleTripNameChange = async (text: string) => {
    setTripName(text);
    console.log(text);
    await AsyncStorage.setItem("tripName", text);
  };

  const handleWhoIsGoingPress = (option: number) => {
    setSelectedOption(option);
    console.log(
      option === 1
        ? "Solo selected"
        : option === 2
        ? "Couple selected"
        : "Group selected"
    );
  };

  const handlePlaceSelect = (
    data: any,
    details: ExtendedGooglePlaceDetail | null
  ) => {
    setTripData({
      locationInfo: {
        name: data.description,
        coordinates: details?.geometry.location,
        photoRef: details?.photos?.[0]?.photo_reference,
        url: details?.url,
      },
    });
    console.log(tripData.locationInfo);
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <ImageBackground
        source={{
          uri: tripData.locationInfo?.photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : require("../../../assets/placeholder.jpeg"), // Use placeholder.jpg instead of undefined
        }}
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            paddingBottom: 60,
          }}
        >
          <Text
            style={{
              color: "silver",
              fontSize: 15,
              marginBottom: 5,
              paddingLeft: 32,
              alignSelf: "flex-start",
            }}
          >
            I want to go to...
          </Text>
        </View>
      </ImageBackground>

      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        textInputProps={{
          placeholderTextColor: "white",
          fontSize: 34,
          returnKeyType: "search",
        }}
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            alignSelf: "center",
            width: "90%",
            position: "absolute", // Changed to absolute positioning
            top: -60, // Adjusted to position it above the text inputs
            zIndex: 1, // Ensure it appears above other components
          },
          textInput: {
            height: 50,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
          listView: {
            backgroundColor: currentTheme.background, // Ensure dropdown matches theme
            zIndex: 1,
            paddingLeft: 20,
          },
        }}
      />

      {showSelectDates ? ( // Render SelectDates component if showSelectDates is true
        <View style={{ padding: 30, marginBottom: 170 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Pressable onPress={() => setShowSelectDates(false)}>
              <Ionicons name="close" size={30} color={currentTheme.icon} />
            </Pressable>
          </View>
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
      ) : (
        <View
          style={{
            alignItems: "center",
            padding: 30,
            marginBottom: 170,
          }}
        >
          <View style={{ width: "100%" }}>
            <View style={{ width: "100%", marginBottom: 20 }}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={currentTheme.textSecondary}
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <TextInput
                placeholder="When?"
                placeholderTextColor={currentTheme.textSecondary}
                onFocus={() => setFocusedInput(2)}
                onBlur={() => setFocusedInput(null)}
                style={{
                  height: 50,
                  borderBottomColor:
                    focusedInput === 2
                      ? currentTheme.alternate
                      : currentTheme.accentBackground,
                  borderBottomWidth: focusedInput === 2 ? 2 : 1,
                  paddingLeft: 40,
                  width: "100%",
                  position: "relative",
                }}
                value={
                  startDate && endDate
                    ? `${startDate.format("MM/DD/YYYY")} - ${endDate.format(
                        "MM/DD/YYYY"
                      )}`
                    : undefined
                } // Set the input value for startDate-endDate
                onPress={() => handleOptionPress(2)} // Handle press for option 2
              />
            </View>
            <View style={{ width: "100%", marginBottom: 20 }}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color={currentTheme.textSecondary}
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <TextInput
                placeholder="Budget?"
                placeholderTextColor={currentTheme.textSecondary}
                onFocus={() => setFocusedInput(3)}
                onBlur={() => setFocusedInput(null)}
                style={{
                  height: 50,
                  borderBottomColor:
                    focusedInput === 3
                      ? currentTheme.alternate
                      : currentTheme.accentBackground,
                  borderBottomWidth: focusedInput === 3 ? 2 : 1,
                  paddingLeft: 40,
                  width: "100%",
                  position: "relative",
                }}
              />
            </View>
            <View style={{ width: "100%", marginBottom: 20 }}>
              <TextInput
                placeholder="Trip Name"
                placeholderTextColor={currentTheme.textSecondary}
                onChangeText={handleTripNameChange}
                onFocus={() => setFocusedInput(4)}
                onBlur={() => setFocusedInput(null)}
                style={{
                  height: 50,
                  borderBottomColor:
                    focusedInput === 4
                      ? currentTheme.alternate
                      : currentTheme.accentBackground,
                  borderBottomWidth: focusedInput === 4 ? 2 : 1,
                  paddingLeft: 10,
                  width: "100%",
                }}
              />
            </View>
            <Text
              style={{
                color: currentTheme.textPrimary,
                marginBottom: 20,
                alignSelf: "flex-start",
              }}
            >
              Who's going?
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "space-between",
                width: "80%",
                marginBottom: 20,
              }}
            >
              {[1, 2, 3].map((option) => (
                <Pressable
                  key={option}
                  onPress={() => handleWhoIsGoingPress(option)} // Use the new handler
                  style={{
                    borderColor: currentTheme.alternate,
                    borderWidth: 1,
                    paddingVertical: 8,
                    borderRadius: 5,
                    backgroundColor:
                      selectedOption === option
                        ? currentTheme.alternate
                        : currentTheme.background,
                    flex: 1,
                    marginHorizontal: 5,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedOption === option
                          ? "white"
                          : currentTheme.textPrimary,
                      textAlign: "center",
                    }}
                  >
                    {option === 1
                      ? "Solo"
                      : option === 2
                      ? "Couple"
                      : "Group (3+)"}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={() => navigation.navigate("ReviewTrip")}
              style={{
                backgroundColor: isFormValid
                  ? currentTheme.alternate
                  : currentTheme.accentBackground,
                padding: 15,
                borderRadius: 5,
                width: "80%",
                alignItems: "center",
                marginTop: 20,
                alignSelf: "center",
              }}
              disabled={!isFormValid}
            >
              <Text
                style={{
                  color: isFormValid ? "white" : currentTheme.textSecondary,
                  fontSize: 16,
                }}
              >
                Start My Trip
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default BuildTrip;
