import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState, useContext, useCallback, useRef } from "react";
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
import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { popularDestinations } from "../../../constants/popularDestinations";
import { RECOMMEND_TRIP_AI_PROMPT } from "../../../api/ai-prompt";
import { chatSession } from "../../../api/AI-Model";
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import RecommendedTripSkeleton from "../../../components/common/RecommendedTripSkeleton";

// Interface for extended Google Place Details including photo information
interface ExtendedGooglePlaceDetail extends GooglePlaceDetail {
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

// Interface for recommended trip data structure
interface RecommendedTrip {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  photoRef?: string | null;
  fullResponse: string;
}

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "HomeMain">;

const Home: React.FC = () => {
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [userName, setUserName] = useState("");
  const [recommendedTrips, setRecommendedTrips] = useState<RecommendedTrip[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const googlePlacesRef = useRef<any>(null);

  // Generate appropriate greeting based on time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return `Good Morning,`;
    } else if (currentHour < 18) {
      return `Good Afternoon,`;
    } else {
      return `Good Evening,`;
    }
  };

  // Fetch user's name from Firestore
  const getUserName = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData?.name || "");
      }
    } catch (error) {
      console.error("Error fetching username", error);
    }
  };

  const fetchPhotoReference = async (
    placeName: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
          placeName
        )}&inputtype=textquery&fields=photos&key=${
          process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY
        }`
      );
      const data = await response.json();
      return data.candidates[0]?.photos[0]?.photo_reference || null;
    } catch (error) {
      console.error("Error fetching photo reference:", error);
      return null;
    }
  };

  const isValidTripResponse = (response: any): boolean => {
    return (
      response &&
      response.travelPlan &&
      response.travelPlan.destination &&
      response.travelPlan.itinerary &&
      Array.isArray(response.travelPlan.itinerary)
    );
  };

  const generateSingleTrip = async (): Promise<RecommendedTrip | null> => {
    try {
      const result = await chatSession.sendMessage(RECOMMEND_TRIP_AI_PROMPT);
      const responseText = await result.response.text();

      if (!responseText) {
        throw new Error("Empty response from AI");
      }

      let tripResp;
      try {
        // Add input validation and cleaning
        const cleanedResponse = responseText
          .trim()
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
        tripResp = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return null;
      }

      // Validate response structure
      if (!isValidTripResponse(tripResp)) {
        console.error("Invalid trip response structure");
        return null;
      }

      const placeName = tripResp.travelPlan.destination;
      const photoRef = await fetchPhotoReference(placeName);

      return {
        id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: placeName,
        description:
          tripResp.travelPlan.itinerary[0]?.places[0]?.placeDetails ||
          tripResp.travelPlan.destinationDescription ||
          "No description available",
        photoRef,
        fullResponse: JSON.stringify(tripResp), // Store cleaned and validated response
      };
    } catch (error) {
      console.error("Error generating trip:", error);
      return null;
    }
  };

  const generateRecommendedTrips = async (isRefresh = false) => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      const user = getAuth().currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      const userTripsCollection = collection(
        FIREBASE_DB,
        `users/${user.uid}/suggestedTrips`
      );

      // If not refreshing, first try to load existing trips from Firebase
      if (!isRefresh) {
        const userTripsSnapshot = await getDocs(userTripsCollection);
        if (!userTripsSnapshot.empty) {
          const trips: RecommendedTrip[] = [];
          userTripsSnapshot.forEach((doc) => {
            const tripData = doc.data();
            trips.push(tripData as RecommendedTrip);
          });
          setRecommendedTrips(trips);
          setIsLoading(false);
          return;
        }
      }

      // Generate all trips in parallel
      const tripPromises = Array(3).fill(null).map(generateSingleTrip);
      const generatedTrips = await Promise.all(tripPromises);

      // Filter out any null results and store valid trips
      const validTrips = generatedTrips.filter(
        (trip): trip is RecommendedTrip => trip !== null
      );

      if (validTrips.length > 0) {
        // Batch write all trips to Firebase
        const batch = writeBatch(FIREBASE_DB);
        validTrips.forEach((trip) => {
          const newTripRef = doc(userTripsCollection);
          batch.set(newTripRef, trip);
        });

        await batch.commit();
        setRecommendedTrips(validTrips);
        await AsyncStorage.setItem("lastFetchTime", new Date().toISOString());
      }
    } catch (error) {
      console.error("Error in generateRecommendedTrips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the refresh button press handler
  const handleRefresh = () => {
    generateRecommendedTrips(true); // Pass true to indicate this is a refresh
  };

  // Type guard to check if a trip is a RecommendedTrip
  const isRecommendedTrip = (
    trip: RecommendedTrip | { id: string }
  ): trip is RecommendedTrip => {
    return (trip as RecommendedTrip).fullResponse !== undefined;
  };

  useFocusEffect(
    useCallback(() => {
      generateRecommendedTrips(false); // Pass false to indicate this is initial load
      getUserName();
    }, [])
  );

  return (
    <View testID="home-screen" style={{ flex: 1 }}>
      <ScrollView
        testID="home-scroll-view"
        style={[{ backgroundColor: currentTheme.background }]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View testID="home-header" style={styles.header}>
          <View testID="home-image-container" style={styles.imageContainer}>
            <Image
              testID="home-header-image"
              source={require("../../../assets/app-imgs/travel.jpg")}
              style={styles.image}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
              style={styles.overlay}
            />
          </View>
          <View testID="home-header-content" style={styles.headerContent}>
            <Text testID="home-greeting" style={styles.greetingText}>
              {getGreeting()}
            </Text>
            <Text testID="home-name" style={styles.greetingText}>
              {userName} 🌅
            </Text>
            <Text testID="home-subgreeting" style={styles.subGreetingText}>
              Let's plan your next adventure!
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.recommendedTripsContainer,
            { backgroundColor: currentTheme.background },
          ]}
        >
          <View testID="home-search-container" style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              ref={googlePlacesRef}
              placeholder="Where would you like to go?"
              textInputProps={{
                placeholderTextColor: currentTheme.textSecondary,
                selectionColor: currentTheme.alternate,
              }}
              fetchDetails={true}
              onPress={(
                data,
                details: ExtendedGooglePlaceDetail | null = null
              ) => {
                if (details) {
                  const photoReference =
                    details.photos?.[0]?.photo_reference || null;
                  setTripData({
                    locationInfo: {
                      name: data.description,
                      coordinates: details.geometry.location,
                      photoRef: photoReference,
                      url: details.url,
                    },
                  });
                  // Clear input
                  if (googlePlacesRef.current) {
                    googlePlacesRef.current.clear();
                  }
                  // @ts-ignore - Nested navigation type issue
                  navigation.navigate("MyTrips", {
                    screen: "ChooseDate",
                  });
                }
              }}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
                language: "en",
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInputContainer: {
                  backgroundColor: "transparent",
                },
                textInput: [
                  styles.searchInput,
                  {
                    color: currentTheme.textPrimary,
                    backgroundColor: currentTheme.accentBackground,
                  },
                ],
                listView: {
                  backgroundColor: currentTheme.accentBackground,
                  borderRadius: 12,
                  marginTop: 10,
                  marginHorizontal: 0,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                },
                row: {
                  backgroundColor: currentTheme.accentBackground,
                  padding: 15,
                  height: "auto",
                  minHeight: 50,
                },
                separator: {
                  backgroundColor: `${currentTheme.textSecondary}20`,
                  height: 1,
                },
                description: {
                  color: currentTheme.textPrimary,
                  fontSize: 16,
                },
                poweredContainer: {
                  backgroundColor: currentTheme.accentBackground,
                  borderTopWidth: 1,
                  borderColor: `${currentTheme.textSecondary}20`,
                },
                powered: {
                  tintColor: currentTheme.textSecondary,
                },
              }}
              renderLeftButton={() => (
                <View style={styles.searchIcon}>
                  <Ionicons
                    name="search"
                    size={24}
                    color={currentTheme.textSecondary}
                  />
                </View>
              )}
            />
          </View>
          <View style={styles.recommendedTripsHeader}>
            <Text
              style={[
                styles.recommendedTripsTitle,
                { color: currentTheme.textPrimary },
              ]}
            >
              Popular Destinations
            </Text>
          </View>
          <FlatList
            testID="popular-destinations-list"
            horizontal
            data={popularDestinations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                testID={`destination-item-${item.id}`}
                onPress={() => {
                  navigation.navigate("PopularDestinations", {
                    destination: item,
                  });
                }}
                style={({ pressed }) => [
                  styles.popularDestinationContainer,
                  {
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <Image
                  testID={`destination-image-${item.id}`}
                  source={item.image}
                  style={styles.popularDestinationImage}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={styles.popularDestinationGradient}
                />
                <Text
                  testID={`destination-name-${item.id}`}
                  style={styles.popularDestinationText}
                >
                  {item.name.split(",")[0]}
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
            <Pressable
              onPress={handleRefresh}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <Ionicons
                name="refresh"
                size={28}
                color={currentTheme.textPrimary}
              />
            </Pressable>
          </View>
          {isLoading ? (
            <View style={{ flexDirection: "row" }}>
              {[1, 2, 3].map((_, index) => (
                <RecommendedTripSkeleton
                  key={index}
                  loadingProgress={loadingProgress}
                  isFirstCard={index === 0}
                />
              ))}
            </View>
          ) : recommendedTrips.length > 0 ? (
            <FlatList
              testID="recommended-trips-list"
              horizontal
              data={[...recommendedTrips, { id: "dont-like-button" }]}
              keyExtractor={(trip) => trip.id}
              renderItem={({ item: trip }) => {
                if (trip.id === "dont-like-button") {
                  return (
                    <View style={styles.dontLikeButtonContainer}>
                      <Pressable
                        onPress={() => navigation.navigate("WhereTo")}
                        style={({ pressed }) => [
                          styles.dontLikeButton,
                          { backgroundColor: currentTheme.alternate },
                          { opacity: pressed ? 0.8 : 1 },
                        ]}
                      >
                        <Text style={styles.dontLikeButtonText}>
                          Create Your Own Adventure
                        </Text>
                      </Pressable>
                    </View>
                  );
                } else if (isRecommendedTrip(trip)) {
                  const tripInfo = JSON.parse(trip.fullResponse);
                  return (
                    <Pressable
                      testID={`trip-card-${trip.id}`}
                      onPress={() => {
                        navigation.navigate("RecommendedTripDetails", {
                          trip: trip.fullResponse,
                          photoRef: trip.photoRef ?? "",
                        });
                      }}
                      style={({ pressed }) => [
                        styles.tripCard,
                        {
                          backgroundColor: currentTheme.accentBackground,
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                      ]}
                    >
                      {trip.photoRef && (
                        <View style={styles.tripImageContainer}>
                          <Image
                            testID={`trip-image-${trip.id}`}
                            source={{
                              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${trip.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
                            }}
                            style={styles.tripImage}
                          />
                          <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.7)"]}
                            style={styles.tripImageGradient}
                          />
                        </View>
                      )}
                      <View style={styles.tripInfoContainer}>
                        <Ionicons
                          name="location-outline"
                          size={20}
                          color={currentTheme.textPrimary}
                          style={styles.tripLocationIcon}
                        />
                        <View style={styles.tripTextContainer}>
                          <Text
                            testID={`trip-name-${trip.id}`}
                            style={[
                              styles.tripName,
                              { color: currentTheme.textPrimary },
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {trip.name}
                          </Text>
                          <Text
                            testID={`trip-description-${trip.id}`}
                            style={[
                              styles.tripDescription,
                              { color: currentTheme.textSecondary },
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {tripInfo.travelPlan.destinationDescription}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                }
                return null;
              }}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noTripsContainer}>
              <Text style={[styles.noTripsText]}>
                Cannot generate trips right now.
                {"\n"}
                Create your own adventure or please try again later!
              </Text>
            </View>
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
    height: 280,
    zIndex: -1,
  },
  imageContainer: {
    position: "absolute",
    top: -30,
    left: 0,
    right: 0,
  },
  image: {
    width: "100%",
    height: 280,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  greetingText: {
    fontSize: 32,
    color: "white",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    fontWeight: "bold",
    alignSelf: "flex-start",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subGreetingText: {
    fontSize: 20,
    color: "white",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    alignSelf: "flex-start",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  recommendedTripsContainer: {
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -70,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 45,
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    position: "absolute",
    left: 15,
    top: 15,
    zIndex: 1,
  },
  popularDestinationContainer: {
    marginRight: 15,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  popularDestinationImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 15,
  },
  popularDestinationGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderRadius: 15,
  },
  popularDestinationText: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  recommendedTripsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  recommendedTripsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  dontLikeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.6,
    height: width * 0.8,
  },
  dontLikeButton: {
    padding: 15,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  dontLikeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  tripCard: {
    borderRadius: 15,
    marginRight: 20,
    width: width * 0.6,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tripImageContainer: {
    position: "relative",
  },
  tripImage: {
    width: "100%",
    height: width * 0.6,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tripImageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  tripInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
  },
  tripLocationIcon: {
    marginRight: 8,
    marginTop: 3,
  },
  tripTextContainer: {
    flex: 1,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  tripDescription: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
  noTripsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noTripsText: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    textAlign: "center",
    color: "grey",
  },
});

export default Home;
