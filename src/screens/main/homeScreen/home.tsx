import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import { CreateTripContext } from "../../../context/createTripContext";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { RECOMMEND_TRIP_AI_PROMPT } from "../../../api/ai-prompt";
import { chatSession } from "../../../../AI-Model";
// import * as Location from 'expo-location';

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
  const [userName, setUserName] = useState("");
  const [recommendedTrips, setRecommendedTrips] = useState<RecommendedTrip[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState("Your Location");
  const [preferences, setPreferences] = useState<TripData>({
    budget: null,
    travelerType: null,
    accommodationType: null,
    activityLevel: null,
    preferredClimate: null,
  });
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
      checkAndGenerateTrips();
      fetchPreferences();
    }, [])
  );

  const isRecommendedTrip = (
    trip: RecommendedTrip | { id: string }
  ): trip is RecommendedTrip => {
    return (trip as RecommendedTrip).fullResponse !== undefined;
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.header, { backgroundColor: currentTheme.background }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.greetingText, { color: currentTheme.textPrimary }]}>
            {getGreeting()}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            // Handle location press
            // getUserLocation();
            console.log("Location pressed");
          }}
          style={styles.locationPressable}
        >
          <Ionicons
            name="location-outline"
            size={20}
            color={currentTheme.textPrimary}
          />
          <Text style={[styles.locationText, { color: currentTheme.textPrimary }]}>
            {userLocation}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={currentTheme.textPrimary}
            style={styles.chevronIcon}
          />
        </Pressable>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.recommendedTripsContainer}>
          <View style={styles.recommendedTripsHeader}>
            <Text style={[styles.recommendedTripsTitle, { color: currentTheme.textPrimary }]}>
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
            <ActivityIndicator size="large" color={currentTheme.alternate} />
          ) : (
            <FlatList
              horizontal
              data={[...recommendedTrips, { id: "dont-like-button" }]}
              keyExtractor={(trip) => trip.id}
              renderItem={({ item: trip }) =>
                trip.id === "dont-like-button" ? (
                  <View style={styles.dontLikeButtonContainer}>
                    <Button
                      title="Don't like? Build your own here!"
                      onPress={() => navigation.navigate("BuildTrip")}
                      color={currentTheme.alternate}
                    />
                  </View>
                ) : (
                  isRecommendedTrip(trip) && (
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
                      style={[styles.tripCard, { backgroundColor: currentTheme.accentBackground }]}
                    >
                      {trip.photoRef && (
                        <Image
                          source={{
                            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${trip.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
                          }}
                          style={styles.tripImage}
                        />
                      )}
                      <View style={styles.tripInfoContainer}>
                        <Ionicons
                          name="location-outline"
                          size={20}
                          color={currentTheme.textPrimary}
                          style={styles.tripLocationIcon}
                        />
                        <Text
                          style={[styles.tripName, { color: currentTheme.textPrimary }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {trip.name}
                        </Text>
                      </View>
                    </Pressable>
                  )
                )
              }
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 40,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  locationPressable: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 5,
  },
  chevronIcon: {
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
    paddingTop: 140,
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  recommendedTripsContainer: {
    width: "100%",
    padding: 20,
  },
  recommendedTripsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  recommendedTripsTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  dontLikeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tripCard: {
    borderRadius: 10,
    marginRight: 20,
    width: 260,
  },
  tripImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  tripInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tripLocationIcon: {
    marginRight: 5,
  },
  tripName: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});

export default Home;
