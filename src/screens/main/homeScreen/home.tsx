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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { usePopularDestinations } from "../../../constants/constants";
import {
  RECOMMEND_TRIP_AI_PROMPT,
  SPECIFIC_CITY_TRIP_AI_PROMPT,
} from "../../../api/ai-prompt";
import { chatSession } from "../../../../AI-Model";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [terrainTrips, setTerrainTrips] = useState<RecommendedTrip[]>([]);
  const [cityTrips, setCityTrips] = useState<RecommendedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTerrainLoading, setIsTerrainLoading] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);
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
          id: `trip-${i}-${new Date().getTime()}`,
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
      await AsyncStorage.setItem("lastFetchTime", new Date().toISOString());
      console.log("Stored current time as last fetch time.");
    } catch (error) {
      console.error("Error generating recommended trips:", error);
    } finally {
      setIsLoading(false);
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

  const checkTimeAndFetchReccomendedTrips = async () => {
    try {
      const lastFetchTime = await AsyncStorage.getItem("lastFetchTime");
      if (lastFetchTime) {
        const lastFetchDate = new Date(lastFetchTime);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - lastFetchDate.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        console.log(
          `Time difference since last fetch: ${hoursDifference} hours`
        );
        if (hoursDifference >= 12) {
          console.log(
            "More than 12 hours since last fetch, fetching new trips."
          );
          await clearStorageAndFetchNewTrips();
        } else {
          console.log(
            "Less than 12 hours since last fetch, using stored trips."
          );
        }
      } else {
        console.log("No last fetch time found, generating new trips.");
        await generateRecommendedTrips();
      }
    } catch (error) {
      console.error("Error checking time and fetching trips:", error);
    }
  };

  const generateSetTerrainTrip = async (terrainType: string) => {
    try {
      setIsTerrainLoading(true);
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const terrainTripsCollection = collection(
        FIREBASE_DB,
        `users/${user.uid}/terrainTrips`
      );

      const FINAL_PROMPT = SPECIFIC_CITY_TRIP_AI_PROMPT.replace(
        "{terrainType}",
        terrainType
      )
        .replace("{travelerType}", preferences.travelerType)
        .replace("{accommodationType}", preferences.accommodationType)
        .replace("{activityLevel}", preferences.activityLevel)
        .replace("{preferredClimate}", preferences.preferredClimate);

      console.log("Generated AI Prompt for Terrain Trip:", FINAL_PROMPT);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text();
      console.log("AI Response for Terrain Trip:", responseText);

      if (!responseText) {
        console.error("AI response is empty or undefined");
        return;
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
        id: `trip-${terrainType}-${new Date().getTime()}`,
        name: placeName,
        description:
          tripResp.travelPlan.itinerary[0]?.places[0]?.placeDetails ||
          "No description available",
        photoRef,
        fullResponse: responseText, // Store the full AI response
      };

      await addDoc(terrainTripsCollection, trip);
      setTerrainTrips([trip]);

      // Navigate to the RecommendedTripDetails screen with the generated trip information
      const tripInfo = trip.fullResponse;
      console.log("Navigating to TripDetails with tripInfo:", tripInfo);
      navigation.navigate("RecommendedTripDetails", {
        trip: tripInfo,
        photoRef: trip.photoRef,
      });
    } catch (error) {
      console.error("Error generating recommended trips:", error);
    } finally {
      setIsTerrainLoading(false);
    }
  };

  const generateSetCityTrip = async (cityName: string) => {
    try {
      setIsCityLoading(true);
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const cityTripsCollection = collection(
        FIREBASE_DB,
        `users/${user.uid}/cityTrips`
      );

      for (let i = 0; i < 3; i++) {
        const FINAL_PROMPT = SPECIFIC_CITY_TRIP_AI_PROMPT.replace(
          "{cityName}",
          cityName
        )
          .replace("{travelerType}", preferences.travelerType)
          .replace("{accommodationType}", preferences.accommodationType)
          .replace("{activityLevel}", preferences.activityLevel)
          .replace("{preferredClimate}", preferences.preferredClimate);

        console.log("Generated AI Prompt for City Trip:", FINAL_PROMPT);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        const responseText = await result.response.text();
        console.log("AI Response for City Trip:", responseText);

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
          id: `trip-${i}-${new Date().getTime()}`,
          name: placeName,
          description:
            tripResp.travelPlan.itinerary[0]?.places[0]?.placeDetails ||
            "No description available",
          photoRef,
          fullResponse: responseText, // Store the full AI response
        };
        await addDoc(cityTripsCollection, trip);
      }

      const cityTripsSnapshot = await getDocs(cityTripsCollection);
      const cityTrips = cityTripsSnapshot.docs.map(
        (doc) => doc.data() as RecommendedTrip
      );

      setCityTrips(cityTrips);

      // Navigate to the RecommendedTripDetails screen with the generated trip information
      if (cityTrips.length > 0) {
        const tripInfo = cityTrips[0].fullResponse;
        console.log("Navigating to TripDetails with tripInfo:", tripInfo);
        navigation.navigate("RecommendedTripDetails", {
          trip: tripInfo,
          photoRef: cityTrips[0].photoRef,
        });
      }
    } catch (error) {
      console.error("Error generating recommended trips:", error);
    } finally {
      setIsCityLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkTimeAndFetchReccomendedTrips();
      fetchPreferences();
    }, [])
  );

  const isRecommendedTrip = (
    trip: RecommendedTrip | { id: string }
  ): trip is RecommendedTrip => {
    return (trip as RecommendedTrip).fullResponse !== undefined;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[{ backgroundColor: currentTheme.background }]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/travel.jpg")}
              style={styles.image}
            />
            <View style={styles.overlay} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.subGreetingText}>
              Where would you like to go?
            </Text>
            <View style={styles.terrainContainer}>
              {[
                { label: "Beach", icon: "umbrella-beach" },
                { label: "Mountain", icon: "mountain" },
                {
                  label: "City",
                  icon: "city",
                },
                { label: "Country", icon: "globe-americas" },
              ].map(({ label, icon }) => (
                <Pressable
                  key={label}
                  onPress={() => generateSetTerrainTrip(label)}
                  style={[
                    styles.button,
                    { borderColor: currentTheme.alternate },
                  ]}
                >
                  <FontAwesome5 name={icon} size={28} color="white" />
                  <Text style={styles.buttonText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.recommendedTripsContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search for places"
            textInputProps={{
              placeholderTextColor: currentTheme.textPrimary,
            }}
            onPress={(data, details = null) => {
              console.log(data, details);
              if (details) {
                setTripData((prevTripData: TripData) => ({
                  ...prevTripData,
                  name: data.description,
                }));
                navigation.navigate("BuildTrip");
              }
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
              language: "en",
            }}
            styles={{
              textInput: [
                styles.searchInput,
                { color: currentTheme.textPrimary },
                { backgroundColor: currentTheme.background },
              ],
              listView: { backgroundColor: currentTheme.background },
            }}
          />
          <FlatList
            horizontal
            data={usePopularDestinations()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => generateSetCityTrip(item.name)}
                style={styles.popularDestinationContainer}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.popularDestinationImage}
                />
                <Text
                  style={[
                    styles.popularDestinationText,
                    { color: currentTheme.textPrimary },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
            showsHorizontalScrollIndicator={false}
          />
          <View style={styles.recommendedTripsHeader}>
            <Text
              style={[
                styles.recommendedTripsTitle,
                { color: currentTheme.textPrimary },
              ]}
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
                      style={[
                        styles.tripCard,
                        { backgroundColor: currentTheme.accentBackground },
                      ]}
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
                          style={[
                            styles.tripName,
                            { color: currentTheme.textPrimary },
                          ]}
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
          {isTerrainLoading && (
            <ActivityIndicator size="large" color={currentTheme.alternate} />
          )}
          {isCityLoading && (
            <ActivityIndicator size="large" color={currentTheme.alternate} />
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
    width: "100%",
    height: 330,
    zIndex: -1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  image: {
    width: "100%",
    height: 330,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  headerContent: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  greetingText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  subGreetingText: {
    fontSize: 18,
    color: "white",
    fontWeight: "normal",
    alignSelf: "flex-start",
  },
  terrainContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(5, 5, 5, 0.6)",
    borderRadius: 15,
    borderWidth: 1,
    width: 90,
    height: 120,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  recommendedTripsContainer: {
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
  },
  searchInput: {
    width: "100%",
    padding: 10,
    height: 70,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popularDestinationContainer: {
    alignItems: "center",
    marginRight: 10,
    marginBottom: 20,
  },
  popularDestinationImage: {
    width: 80,
    height: 80,
    borderRadius: 55,
  },
  popularDestinationText: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
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
