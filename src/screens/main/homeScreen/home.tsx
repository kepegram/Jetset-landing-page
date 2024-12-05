import { View, Text, Pressable } from "react-native";
import React, { useState, useContext, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import { CreateTripContext } from "../../../context/createTripContext";
import { Dropdown } from "react-native-element-dropdown";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../../components/ui/button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";

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
  const { setTripData, tripData } = useContext(CreateTripContext);
  const [preferences, setPreferences] = useState<TripData>({
    budget: null,
    travelerType: null,
    accommodationType: null,
    activityLevel: null,
    preferredClimate: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          doc(FIREBASE_DB, `users/${user.uid}/userPreferences`, user.uid),
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
    { label: "Modest", value: "Modest" },
    { label: "Lavish", value: "Lavish" },
  ];

  const travelerTypes = [
    { label: "Thrill-seeking", value: "Thrill-seeking" },
    { label: "Foodie", value: "Foodie" },
    { label: "Cultural", value: "Cultural" },
    { label: "Relaxed", value: "Relaxed" },
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

  useEffect(() => {
    console.log("Current trip data:", tripData);
  }, [tripData]);

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
          <Pressable
            onPress={() => {
              // Handle location press
              console.log("Location pressed");
            }}
            style={{
              position: "absolute",
              top: "10%",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={currentTheme.textPrimary}
            />
            <Text
              style={{
                fontSize: 16,
                color: currentTheme.textPrimary,
                marginLeft: 10,
              }}
            >
              Your Location
            </Text>
          </Pressable>

          <Text
            style={{
              fontSize: 20,
              color: currentTheme.textPrimary,
              alignSelf: "flex-start",
            }}
          >
            About you:
          </Text>

          {/* Preferences */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 30,
                color: currentTheme.textPrimary,
                marginBottom: 40,
              }}
            >
              You have a{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: currentTheme.alternate,
                  fontSize: 38,
                }}
              >
                {preferences.budget
                  ? preferences.budget.toLowerCase()
                  : "unknown"}
              </Text>{" "}
              budget
            </Text>
            <Text
              style={{
                fontSize: 30,
                color: currentTheme.textPrimary,
                marginBottom: 40,
                textAlign: "right",
              }}
            >
              and you are{" "}
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "bold",
                  color: currentTheme.alternate,
                }}
              >
                {preferences.travelerType
                  ? preferences.travelerType.toLowerCase()
                  : "unknown"}
              </Text>
              .
            </Text>
            <Text
              style={{
                fontSize: 30,
                color: currentTheme.textPrimary,
                marginBottom: 40,
              }}
            >
              You stay in{" "}
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "bold",
                  color: currentTheme.alternate,
                }}
              >
                {preferences.accommodationType
                  ? preferences.accommodationType.toLowerCase() + "s"
                  : "unknown"}
              </Text>
              ,
            </Text>
            <Text
              style={{
                fontSize: 30,
                color: currentTheme.textPrimary,
                marginBottom: 40,
                textAlign: "right",
              }}
            >
              your activity level is{" "}
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "bold",
                  color: currentTheme.alternate,
                }}
              >
                {preferences.activityLevel
                  ? preferences.activityLevel.toLowerCase()
                  : "unknown"}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 30,
                color: currentTheme.textPrimary,
                marginBottom: 40,
              }}
            >
              and you enjoy a{" "}
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "bold",
                  color: currentTheme.alternate,
                }}
              >
                {preferences.preferredClimate
                  ? preferences.preferredClimate.toLowerCase()
                  : "unknown"}
              </Text>{" "}
              climate.
            </Text>
          </View>
          <MainButton
            buttonText="Start Booking!"
            width="100%"
            onPress={() => navigation.navigate("BuildTrip")}
            style={{ alignSelf: "center" }}
          />
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <Pressable
            onPress={() => setIsEditing(false)}
            style={{
              position: "absolute",
              top: "-20%",
            }}
          >
            <Ionicons name="close" size={35} color={currentTheme.textPrimary} />
          </Pressable>
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
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
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
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
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
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
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
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
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
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <MainButton
            buttonText="Save Preferences"
            onPress={savePreferences}
            disabled={!allPreferencesSelected}
            style={{ width: "80%", marginTop: 20, alignSelf: "center" }}
          />
        </View>
      )}
    </View>
  );
};

export default Home;
