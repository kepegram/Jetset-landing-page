import {
  TextInput,
  View,
  Pressable,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../../context/themeContext";
import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateTripContext } from "../../../../context/createTripContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import CalendarPicker from "react-native-calendar-picker";
import moment, { Moment } from "moment";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { MainButton } from "../../../../components/ui/button";
import Slider from "@react-native-community/slider";
import { Dropdown } from "react-native-element-dropdown";

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
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Moment | undefined>();
  const [endDate, setEndDate] = useState<Moment | undefined>();
  const [showSelectDates, setShowSelectDates] = useState(false);
  const [photoRef, setPhotoRef] = useState<string | null>(null);
  const [whoIsGoing, setWhoIsGoing] = useState<number>(1);
  const [travelerType, setTravelerType] = useState<string>("Average");
  const [accommodationType, setAccommodationType] = useState<string>("Hotel");
  const [activityLevel, setActivityLevel] = useState<string>("Normal");
  const navigation = useNavigation<BuildTripNavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  useEffect(() => {
    const loadDatesAndPhotoRef = async () => {
      const storedStartDate = await AsyncStorage.getItem("startDate");
      const storedEndDate = await AsyncStorage.getItem("endDate");
      const storedPhotoRef = await AsyncStorage.getItem("photoRef");
      if (storedStartDate) {
        setStartDate(moment(storedStartDate));
      }
      if (storedEndDate) {
        setEndDate(moment(storedEndDate));
      }
      if (storedPhotoRef) {
        setPhotoRef(storedPhotoRef);
      }
    };
    loadDatesAndPhotoRef();
  }, []);

  const handlePlaceSelect = async (
    data: any,
    details: ExtendedGooglePlaceDetail | null
  ) => {
    const photoReference = details?.photos?.[0]?.photo_reference || null;
    setTripData({
      ...tripData,
      locationInfo: {
        name: data.description,
        coordinates: details?.geometry.location,
        photoRef: photoReference,
        url: details?.url,
      },
    });
    if (photoReference) {
      await AsyncStorage.setItem("photoRef", photoReference);
      setPhotoRef(photoReference);
    }
    console.log(tripData.locationInfo);
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
    if (!startDate || !endDate) {
      alert("Please select Start and End Date");
      return;
    }

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

    setShowSelectDates(false);
  };

  const handleWhoIsGoingChange = (value: number) => {
    setWhoIsGoing(value);
    let whoIsGoingText = "Group";
    if (value === 1) {
      whoIsGoingText = "Solo";
    } else if (value === 2) {
      whoIsGoingText = "Couple";
    }
    setTripData({
      ...tripData,
      whoIsGoing: whoIsGoingText,
    });
  };

  const isFormValid =
    tripData.locationInfo &&
    startDate &&
    endDate &&
    tripData.whoIsGoing !== null;

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <ImageBackground
        source={{
          uri: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : require("../../../assets/placeholder.jpeg"),
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
            position: "absolute",
            top: -60,
            zIndex: 1,
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
            backgroundColor: currentTheme.background,
            zIndex: 99,
          },
        }}
      />

      {showSelectDates ? (
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
          <MainButton
            style={{ marginTop: 20 }}
            buttonText="Continue"
            onPress={OnDateSelectionContinue}
            width="100%"
            backgroundColor={currentTheme.alternate}
          />
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            padding: 30,
            marginBottom: 170,
          }}
        >
          {/* Location */}

          <View style={{ width: "100%" }}>
            <View style={{ width: "100%", marginBottom: 20 }}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color={currentTheme.textSecondary}
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <TextInput
                placeholder="When?"
                placeholderTextColor={currentTheme.textSecondary}
                onFocus={() => setShowSelectDates(true)}
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
                  color: currentTheme.textSecondary,
                  fontSize: 18,
                }}
                value={
                  startDate && endDate
                    ? `${startDate.format("MM/DD/YYYY")} - ${endDate.format(
                        "MM/DD/YYYY"
                      )}`
                    : ""
                }
              />
            </View>

            {/* Who's going? */}

            <View style={{ width: "100%", marginBottom: 20 }}>
              <Ionicons
                name="people-outline"
                size={22}
                color={currentTheme.textSecondary}
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <Text
                style={{
                  color: currentTheme.textSecondary,
                  marginBottom: 30,
                  alignSelf: "flex-start",
                  paddingLeft: 40,
                  paddingTop: 10,
                  fontSize: 18,
                }}
              >
                Who's going?
              </Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={6}
                step={1}
                value={whoIsGoing}
                onValueChange={handleWhoIsGoingChange}
                minimumTrackTintColor={currentTheme.alternate}
                maximumTrackTintColor={currentTheme.accentBackground}
                thumbTintColor={currentTheme.alternate}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 0,
                }}
              >
                {[...Array(6)].map((_, index) => (
                  <Text
                    key={index}
                    style={{
                      color: currentTheme.textSecondary,
                      fontSize: 18,
                      textAlign: "center",
                      width: `${100 / 6}%`,
                    }}
                  >
                    {index < 5 ? index + 1 : "6+"}
                  </Text>
                ))}
              </View>
              <Text
                style={{
                  color: currentTheme.textSecondary,
                  alignSelf: "center",
                  marginTop: 10,
                }}
              >
                {whoIsGoing === 1
                  ? "Solo"
                  : whoIsGoing === 2
                  ? "A couple"
                  : "A group"}
              </Text>
            </View>

            {/* Traveler Type */}
            <View style={{ width: "100%", marginBottom: 20 }}>
              <Ionicons
                name="person-outline"
                size={22}
                color={currentTheme.textSecondary}
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <Text
                style={{
                  color: currentTheme.textSecondary,
                  marginBottom: 10,
                  alignSelf: "flex-start",
                  paddingLeft: 40,
                  paddingTop: 10,
                  fontSize: 18,
                }}
              >
                Traveler Type
              </Text>
              <Dropdown
                data={[
                  { label: "Average", value: "Average" },
                  { label: "Adventurous", value: "Adventurous" },
                  { label: "Relaxed", value: "Relaxed" },
                ]}
                labelField="label"
                valueField="value"
                value={travelerType}
                onChange={(item) => setTravelerType(item.value)}
                containerStyle={{ height: 50, width: "100%" }}
                style={{ backgroundColor: currentTheme.background }}
                itemTextStyle={{ color: currentTheme.textSecondary }}
                selectedTextStyle={{ color: currentTheme.textSecondary }}
                placeholderStyle={{ color: currentTheme.textSecondary }}
              />
            </View>

            {/* Accommodation Type */}
            <View style={{ width: "100%", marginBottom: 20 }}>
              <Ionicons
                name="bed-outline"
                size={22}
                color={currentTheme.textSecondary}
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <Text
                style={{
                  color: currentTheme.textSecondary,
                  marginBottom: 10,
                  alignSelf: "flex-start",
                  paddingLeft: 40,
                  paddingTop: 10,
                  fontSize: 18,
                }}
              >
                Accommodation Type
              </Text>
              <Dropdown
                data={[
                  { label: "Hotel", value: "Hotel" },
                  { label: "Hostel", value: "Hostel" },
                  { label: "Airbnb", value: "Airbnb" },
                ]}
                labelField="label"
                valueField="value"
                value={accommodationType}
                onChange={(item) => setAccommodationType(item.value)}
                containerStyle={{ height: 50, width: "100%" }}
                style={{ backgroundColor: currentTheme.background }}
                itemTextStyle={{ color: currentTheme.textSecondary }}
                selectedTextStyle={{ color: currentTheme.textSecondary }}
                placeholderStyle={{ color: currentTheme.textSecondary }}
              />
            </View>

            {/* Activity Level */}
            <View style={{ width: "100%", marginBottom: 20 }}>
              <Ionicons
                name="walk-outline"
                size={22}
                color={currentTheme.textSecondary}
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <Text
                style={{
                  color: currentTheme.textSecondary,
                  marginBottom: 10,
                  alignSelf: "flex-start",
                  paddingLeft: 40,
                  paddingTop: 10,
                  fontSize: 18,
                }}
              >
                Activity Level
              </Text>
              <Dropdown
                data={[
                  { label: "Normal", value: "Normal" },
                  { label: "High", value: "High" },
                  { label: "Low", value: "Low" },
                ]}
                labelField="label"
                valueField="value"
                value={activityLevel}
                onChange={(item) => setActivityLevel(item.value)}
                containerStyle={{ height: 50, width: "100%" }}
                style={{ backgroundColor: currentTheme.background }}
                itemTextStyle={{ color: currentTheme.textSecondary }}
                selectedTextStyle={{ color: currentTheme.textSecondary }}
                placeholderStyle={{ color: currentTheme.textSecondary }}
              />
            </View>

            <MainButton
              buttonText="Start My Trip"
              onPress={() => {
                setTripData({
                  ...tripData,
                  travelerType,
                  accommodationType,
                  activityLevel,
                });
                navigation.navigate("ReviewTrip");
                console.log(
                  "LOCATION",
                  tripData.locationInfo,
                  "START DATE",
                  tripData.startDate,
                  "END DATE",
                  tripData.endDate,
                  "WHO IS GOING",
                  tripData.whoIsGoing,
                  "TRAVELER TYPE",
                  tripData.travelerType,
                  "ACCOMMODATION TYPE",
                  tripData.accommodationType,
                  "ACTIVITY LEVEL",
                  tripData.activityLevel
                );
              }}
              width="80%"
              backgroundColor={
                isFormValid
                  ? currentTheme.alternate
                  : currentTheme.accentBackground
              }
              style={{
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
            </MainButton>
          </View>
        </View>
      )}
    </View>
  );
};

export default BuildTrip;
