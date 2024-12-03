import { View, Text, Button } from "react-native";
import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateTripContext } from "../../../context/createTripContext";
import { Dropdown } from "react-native-element-dropdown";

// Define the type for tripData
interface TripData {
  budget: string | null;
  travelerType: string | null;
  accommodationType: string | null;
  activityLevel: string | null;
  preferredClimate: string | null;
}

const Home: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setTripData } = useContext(CreateTripContext);
  const [preferences, setPreferences] = useState<TripData>({
    budget: null,
    travelerType: null,
    accommodationType: null,
    activityLevel: null,
    preferredClimate: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchPreferences = async () => {
    try {
      const budget = await AsyncStorage.getItem("budget");
      const travelerType = await AsyncStorage.getItem("travelerType");
      const accommodationType = await AsyncStorage.getItem("accommodationType");
      const activityLevel = await AsyncStorage.getItem("activityLevel");
      const preferredClimate = await AsyncStorage.getItem("preferredClimate");

      const parsedPreferences: TripData = {
        budget: budget || null,
        travelerType: travelerType || null,
        accommodationType: accommodationType || null,
        activityLevel: activityLevel || null,
        preferredClimate: preferredClimate || null,
      };

      setPreferences(parsedPreferences);
      setTripData((prevTripData: TripData) => {
        const updatedTripData = { ...prevTripData, ...parsedPreferences };
        console.log("Trip data after fetching preferences:", updatedTripData);
        return updatedTripData;
      });
      console.log("Fetched and set preferences:", parsedPreferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPreferences();
    }, [])
  );

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem("preferences", JSON.stringify(preferences));
      setTripData((prevTripData: TripData) => {
        const updatedTripData = { ...prevTripData, ...preferences };
        console.log("Trip data after saving preferences:", updatedTripData);
        return updatedTripData;
      });
      console.log("Saved preferences:", preferences);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const budgetOptions = [
    { label: "Cheap", value: "Cheap" },
    { label: "Moderate", value: "Moderate" },
    { label: "Lavish", value: "Lavish" },
  ];

  const travelerTypes = [
    { label: "Adventurous", value: "Adventurous" },
    { label: "Foodie", value: "Foodie" },
  ];

  const accommodationTypes = [
    { label: "Hotel", value: "Hotel" },
    { label: "Apartment", value: "Apartment" },
    { label: "Hostel", value: "Hostel" },
  ];

  const activityLevels = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  const preferredClimates = [
    { label: "Tropical", value: "Tropical" },
    { label: "Temperate", value: "Temperate" },
    { label: "Polar", value: "Polar" },
  ];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: currentTheme.background,
        padding: 20,
      }}
    >
      <View style={{ position: "absolute", top: "7%", left: "4%" }}>
        <Text style={{ fontSize: 45, fontWeight: "bold" }}>Jetset</Text>
      </View>
      {!isEditing ? (
        <View>
          <Text style={{ color: currentTheme.textPrimary, marginBottom: 10 }}>
            Preferences: {JSON.stringify(preferences)}
          </Text>
          <Button title="Edit Preferences" onPress={() => setIsEditing(true)} />
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <View style={{ alignSelf: "flex-start" }}>
            <Button title="Cancel" onPress={() => setIsEditing(false)} />
          </View>
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Budget:
          </Text>
          <Dropdown
            data={budgetOptions}
            labelField="label"
            valueField="value"
            placeholder="Select budget"
            value={preferences.budget}
            onChange={(item) =>
              setPreferences((prev) => ({ ...prev, budget: item.value }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              padding: 10,
              marginBottom: 20,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Traveler Type:
          </Text>
          <Dropdown
            data={travelerTypes}
            labelField="label"
            valueField="value"
            placeholder="Select traveler type"
            value={preferences.travelerType}
            onChange={(item) =>
              setPreferences((prev) => ({ ...prev, travelerType: item.value }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              padding: 10,
              marginBottom: 20,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Accommodation Type:
          </Text>
          <Dropdown
            data={accommodationTypes}
            labelField="label"
            valueField="value"
            placeholder="Select accommodation type"
            value={preferences.accommodationType}
            onChange={(item) =>
              setPreferences((prev) => ({
                ...prev,
                accommodationType: item.value,
              }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              padding: 10,
              marginBottom: 20,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Activity Level:
          </Text>
          <Dropdown
            data={activityLevels}
            labelField="label"
            valueField="value"
            placeholder="Select activity level"
            value={preferences.activityLevel}
            onChange={(item) =>
              setPreferences((prev) => ({
                ...prev,
                activityLevel: item.value,
              }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              padding: 10,
              marginBottom: 20,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text style={{ color: currentTheme.textPrimary, marginBottom: 10 }}>
            Preferred Climate:
          </Text>
          <Dropdown
            data={preferredClimates}
            labelField="label"
            valueField="value"
            placeholder="Select preferred climate"
            value={preferences.preferredClimate}
            onChange={(item) =>
              setPreferences((prev) => ({
                ...prev,
                preferredClimate: item.value,
              }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              padding: 10,
              marginBottom: 20,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Button title="Save Preferences" onPress={savePreferences} />
        </View>
      )}
    </View>
  );
};

export default Home;
