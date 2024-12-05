import { View, Text, Button, Pressable } from "react-native";
import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import { CreateTripContext } from "../../../context/createTripContext";
import { Dropdown } from "react-native-element-dropdown";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { Ionicons } from "@expo/vector-icons";

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
  const [userName, setUserName] = useState("");

  const fetchPreferences = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const docRef = doc(
          FIREBASE_DB,
          `users/${user.uid}/userPreferences`,
          user.uid
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as TripData;
          setPreferences(data);
          setTripData((prevTripData: TripData) => {
            const updatedTripData = { ...prevTripData, ...data };
            return updatedTripData;
          });
        } else {
          console.log("No such document!");
        }

        const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData?.name || "");
        }
      }
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
      const user = getAuth().currentUser;
      if (user) {
        await setDoc(
          doc(FIREBASE_DB, `users/${user.uid}/userPreferences`),
          preferences
        );

        setTripData((prevTripData: TripData) => {
          const updatedTripData = { ...prevTripData, ...preferences };
          console.log("Trip data after saving preferences:", updatedTripData);
          return updatedTripData;
        });
        console.log("Saved preferences:", preferences);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return `Morning, ${userName} 🌅`;
    } else if (currentHour < 18) {
      return `Afternoon, ${userName} ☀️`;
    } else {
      return `Evening, ${userName} 🌙`;
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
    { label: "Cultural", value: "Cultural" },
    { label: "Relaxation", value: "Relaxation" },
  ];

  const accommodationTypes = [
    { label: "Hotel", value: "Hotel" },
    { label: "Hostel", value: "Hostel" },
    { label: "Airbnb", value: "Airbnb" },
    { label: "Camping", value: "Camping" },
  ];

  const activityLevels = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  const preferredClimates = [
    { label: "Warm", value: "Warm" },
    { label: "Mild", value: "Mild" },
    { label: "Cold", value: "Cold" },
  ];

  const allPreferencesSelected =
    preferences.budget &&
    preferences.travelerType &&
    preferences.accommodationType &&
    preferences.activityLevel &&
    preferences.preferredClimate;

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
      {!isEditing ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: "5%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: currentTheme.textPrimary,
              }}
            >
              {getGreeting()}
            </Text>
            <Pressable onPress={() => setIsEditing(true)}>
              <Ionicons
                name="pencil"
                size={30}
                color={currentTheme.textPrimary}
              />
            </Pressable>
          </View>
          <Text style={{ color: currentTheme.textPrimary, marginBottom: 10 }}>
            Preferences: {JSON.stringify(preferences)}
          </Text>
        </View>
      ) : (
        <View style={{ width: "100%" }}>
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
          <Button
            title="Save Preferences"
            onPress={savePreferences}
            disabled={!allPreferencesSelected}
          />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </View>
      )}
    </View>
  );
};

export default Home;
