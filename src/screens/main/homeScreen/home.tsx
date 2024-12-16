import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import { CreateTripContext } from "../../../context/createTripContext";
import { Dropdown } from "react-native-element-dropdown";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../../components/ui/button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import {
  budgetOptions,
  travelerTypes,
  preferredClimates,
  accommodationTypes,
  activityLevels,
} from "../../../constants/constants";
import { RECOMMEND_TRIP_AI_PROMPT } from "../../../api/ai-prompt";
import { chatSession } from "../../../../AI-Model";
// import * as Location from 'expo-location';

// Define the type for tripData
interface TripData {
  budget: string | null;
  travelerType: string | null;
  accommodationType: string | null;
  activityLevel: string | null;
  preferredClimate: string | null;
}

interface RecommendedTrip {
  id: string;
  name: string;
  description: string;
  photoRef: string | null;
  fullResponse: string;
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
  const [recommendedTrips, setRecommendedTrips] = useState<RecommendedTrip[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState("Your Location");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
        await generateRecommendedTrips(); // Fetch new recommended trips after saving preferences
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const generateRecommendedTrips = async () => {
    try {
      setIsLoading(true);
      const trips = [];
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const userTripsCollection = collection(
        FIREBASE_DB,
        `users/${user.uid}/suggestedTrips`
      );

      for (let i = 0; i < 3; i++) {
        const FINAL_PROMPT = RECOMMEND_TRIP_AI_PROMPT.replace(
          "{budget}",
          preferences.budget || "Modest"
        )
          .replace("{travelerType}", preferences.travelerType || "Cultural")
          .replace(
            "{accommodationType}",
            preferences.accommodationType || "Hotel"
          )
          .replace("{activityLevel}", preferences.activityLevel || "Medium")
          .replace(
            "{preferredClimate}",
            preferences.preferredClimate || "Mild"
          );

        console.log("Generated AI Prompt for Recommended Trip:", FINAL_PROMPT);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        const responseText = await result.response.text();
        console.log("AI Response for Recommended Trip:", responseText);

        if (!responseText) {
          console.error("AI response is empty or undefined");
          continue;
        }

        const tripResp = JSON.parse(responseText);
        const placeName = tripResp.travelPlan.destination;

        // Fetch photo reference using Google Places API
        const photoResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
            placeName
          )}&inputtype=textquery&fields=photos&key=${
            process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY
          }`
        );
        const photoData = await photoResponse.json();
        const photoRef =
          photoData.candidates[0]?.photos[0]?.photo_reference || null;

        const trip = {
          id: `trip-${i}`,
          name: placeName,
          description:
            tripResp.travelPlan.itinerary[0]?.places[0]?.placeDetails ||
            "No description available",
          photoRef,
          fullResponse: responseText, // Store the full AI response
        };

        trips.push(trip);
        await addDoc(userTripsCollection, trip);
      }
      setRecommendedTrips(trips);
    } catch (error) {
      console.error("Error generating recommended trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndGenerateTrips = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const userTripsCollection = collection(
        FIREBASE_DB,
        `users/${user.uid}/suggestedTrips`
      );
      const userTripsSnapshot = await getDocs(userTripsCollection);

      if (!userTripsSnapshot.empty) {
        const trips = userTripsSnapshot.docs.map(
          (doc) => doc.data() as RecommendedTrip
        );
        setRecommendedTrips(trips);
        return;
      }

      // If no valid stored trips, generate new ones
      await generateRecommendedTrips();
    } catch (error) {
      console.error("Error checking and generating trips:", error);
    }
  };

  const clearStorageAndFetchNewTrips = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const userTripsCollection = collection(
        FIREBASE_DB,
        `users/${user.uid}/suggestedTrips`
      );
      const userTripsSnapshot = await getDocs(userTripsCollection);

      const batch = writeBatch(FIREBASE_DB);
      userTripsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      await generateRecommendedTrips();
    } catch (error) {
      console.error("Error clearing storage and fetching new trips:", error);
    }
  };

  // const getUserLocation = async () => {
  //   try {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       console.error('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     const user = getAuth().currentUser;
  //     if (user) {
  //       const locationData = {
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //       };
  //       await setDoc(
  //         doc(FIREBASE_DB, `users/${user.uid}/userLocation`, user.uid),
  //         locationData
  //       );
  //       setUserLocation(`Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`);
  //       setIsLocationEditing(false);
  //     }
  //   } catch (error) {
  //     console.error("Error getting user location:", error);
  //   }
  // };

  useFocusEffect(
    useCallback(() => {
      fetchPreferences();
      checkAndGenerateTrips();
    }, [])
  );

  const allPreferencesSelected =
    preferences.budget &&
    preferences.travelerType &&
    preferences.accommodationType &&
    preferences.activityLevel &&
    preferences.preferredClimate;

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: currentTheme.background,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 40,
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
            // getUserLocation();
            console.log("Location pressed");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginTop: 10,
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
              marginLeft: 5,
            }}
          >
            {userLocation}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={currentTheme.textPrimary}
            style={{ marginLeft: 5 }}
          />
        </Pressable>
      </View>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 0,
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 40,
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
            {/* Preferences */}
            <View style={{ marginTop: 150 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: currentTheme.textPrimary,
                  alignSelf: "flex-start",
                }}
              >
                About you:
              </Text>

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
                  marginBottom: 10,
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

            {/* Recommended Trips Section */}

            <View style={{ width: "100%", padding: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: currentTheme.textPrimary,
                  }}
                >
                  Recommended Trips
                </Text>
                <Pressable onPress={clearStorageAndFetchNewTrips}>
                  <Ionicons
                    name="refresh"
                    size={28}
                    color={currentTheme.textPrimary}
                  />
                </Pressable>
              </View>
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={currentTheme.alternate}
                />
              ) : (
                <FlatList
                  horizontal
                  data={recommendedTrips}
                  keyExtractor={(trip) => trip.id}
                  renderItem={({ item: trip }) => (
                    <Pressable
                      onPress={() => {
                        const tripInfo = trip.fullResponse;
                        console.log(
                          "Navigating to TripDetails with tripInfo:",
                          tripInfo
                        );
                        navigation.navigate("RecommendedTripDetails", {
                          trip: tripInfo,
                          photoRef: trip.photoRef,
                        });
                      }}
                      style={{
                        backgroundColor: currentTheme.accentBackground,
                        borderRadius: 10,
                        marginRight: 20,
                        width: 260,
                      }}
                    >
                      {trip.photoRef && (
                        <Image
                          source={{
                            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${trip.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
                          }}
                          style={{
                            width: 250,
                            height: 150,
                            borderRadius: 10,
                            marginBottom: 10,
                            alignSelf: "center",
                          }}
                        />
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          marginBottom: 10,
                        }}
                      >
                        <Ionicons
                          name="location-outline"
                          size={20}
                          color={currentTheme.textPrimary}
                          style={{ marginRight: 5 }}
                        />
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: currentTheme.textPrimary,
                            alignSelf: "flex-start",
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {trip.name}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>
            <Button
              title="Start Booking!"
              onPress={() => navigation.navigate("BuildTrip")}
              color={currentTheme.alternate}
            />
          </View>
        ) : (
          <View style={{ width: "100%", marginTop: 200, padding: 20 }}>
            <Pressable
              onPress={() => setIsEditing(false)}
              style={{
                position: "absolute",
                top: "-10%",
              }}
            >
              <Ionicons
                name="close"
                size={35}
                color={currentTheme.textPrimary}
              />
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
                setPreferences((prev) => ({
                  ...prev,
                  travelerType: item.value,
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
      </ScrollView>
    </View>
  );
};

export default Home;
