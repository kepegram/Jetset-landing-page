import { View, Text, Button } from "react-native";
import React, { useCallback, useState } from "react";
import { useTheme } from "../../../context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { FIREBASE_DB } from "../../../../firebase.config";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { Dropdown } from "react-native-element-dropdown";

type PreferencesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Preferences"
>;

type PreferencesScreenRouteProp = RouteProp<RootStackParamList, "Preferences">;

const Preferences: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  const route = useRoute<PreferencesScreenRouteProp>();
  const { navigateToAppNav } = route.params;
  const [userName, setUserName] = useState("");

  const [preferences, setPreferences] = useState({
    budget: "",
    travelerType: "",
    accommodationType: "",
    activityLevel: "",
    preferredClimate: "",
  });

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const user = getAuth().currentUser;
        if (user) {
          try {
            const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserName(data?.name || "");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      };

      fetchUserData();
    }, [])
  );

  const completePreferences = async () => {
    await AsyncStorage.setItem("preferencesSet", "true");
    await AsyncStorage.setItem("budget", preferences.budget);
    await AsyncStorage.setItem("travelerType", preferences.travelerType);
    await AsyncStorage.setItem(
      "accommodationType",
      preferences.accommodationType
    );
    await AsyncStorage.setItem("activityLevel", preferences.activityLevel);
    await AsyncStorage.setItem(
      "preferredClimate",
      preferences.preferredClimate
    );
    navigateToAppNav();
    navigation.navigate("AppNav");
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
    { label: "Moderate", value: "Moderate" },
    { label: "High", value: "High" },
  ];

  const preferredClimates = [
    { label: "Warm", value: "Warm" },
    { label: "Cold", value: "Cold" },
    { label: "Mild", value: "Mild" },
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
        backgroundColor: currentTheme.background,
        padding: 20,
      }}
    >
      <Text
        style={{
          color: currentTheme.textPrimary,
          fontSize: 34,
          fontWeight: "bold",
          marginTop: 50,
          marginBottom: 10,
        }}
      >
        Welcome, {userName} 👋
      </Text>
      <Text
        style={{
          color: currentTheme.textPrimary,
          fontSize: 16,
        }}
      >
        Set your travel preferences below to get started with Jetset!
      </Text>

      <View
        style={{
          marginTop: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
            width: "80%",
            borderColor: currentTheme.textPrimary,
            borderWidth: 1,
            padding: 10,
            marginBottom: 20,
            alignSelf: "flex-start",
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
            width: "80%",
            borderColor: currentTheme.textPrimary,
            borderWidth: 1,
            padding: 10,
            marginBottom: 20,
            alignSelf: "flex-start",
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
            width: "80%",
            borderColor: currentTheme.textPrimary,
            borderWidth: 1,
            padding: 10,
            marginBottom: 20,
            alignSelf: "flex-start",
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
            setPreferences((prev) => ({ ...prev, activityLevel: item.value }))
          }
          style={{
            width: "80%",
            borderColor: currentTheme.textPrimary,
            borderWidth: 1,
            padding: 10,
            marginBottom: 20,
            alignSelf: "flex-start",
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
            width: "80%",
            borderColor: currentTheme.textPrimary,
            borderWidth: 1,
            padding: 10,
            marginBottom: 20,
            alignSelf: "flex-start",
          }}
          placeholderStyle={{ color: currentTheme.textPrimary }}
          selectedTextStyle={{ color: currentTheme.textPrimary }}
        />
        <Button
          title="Save Preferences"
          onPress={completePreferences}
          disabled={!allPreferencesSelected}
        />
      </View>
    </View>
  );
};

export default Preferences;
