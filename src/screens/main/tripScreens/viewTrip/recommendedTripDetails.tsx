import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation, useRoute } from "@react-navigation/native";
import HotelList from "../../../../components/tripDetails/hotelList";
import PlannedTrip from "../../../../components/tripDetails/plannedTrip";
import { MainButton } from "../../../../components/ui/button";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RecommendedTripDetails"
>;

interface RouteParams {
  trip: string;
  photoRef: string;
}

const RecommendedTripDetails: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { trip, photoRef } = route.params as RouteParams;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [tripDetails, setTripDetails] = useState<any>(null);
  const [isHearted, setIsHearted] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, height * 0.2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerBackground: () => (
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: headerOpacity,
              backgroundColor: currentTheme.background,
            },
          ]}
        />
      ),
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </Pressable>
      ),
    });
  }, [navigation, currentTheme.background]);

  useEffect(() => {
    try {
      const parsedTrip = JSON.parse(trip);
      setTripDetails(parsedTrip);
    } catch (error) {
      console.error("Error parsing trip details:", error);
    }
  }, [trip]);

  const handleHeartPress = async () => {
    setIsHearted(!isHearted);
    if (!isHearted) {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        try {
          const tripDocRef = doc(
            FIREBASE_DB,
            `users/${user.uid}/userTrips`,
            tripDetails.travelPlan.destination
          );
          await setDoc(tripDocRef, tripDetails);
          Alert.alert("Success", "Trip saved successfully!");
          navigation.navigate("MyTripsMain");
        } catch (error) {
          Alert.alert("Error", "Failed to save trip. Please try again.");
        }
      } else {
        Alert.alert("Sign In Required", "Please sign in to save trips.");
      }
    }
  };

  if (!tripDetails) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <MaterialCommunityIcons
          name="airplane-clock"
          size={50}
          color={currentTheme.alternate}
        />
        <Text style={[styles.loadingText, { color: currentTheme.textPrimary }]}>
          Loading trip details...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
              : "https://via.placeholder.com/800",
          }}
          style={styles.image}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <BlurView
          intensity={90}
          style={[
            styles.contentContainer,
            { backgroundColor: `${currentTheme.background}CC` },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text
              style={[
                styles.destinationTitle,
                { color: currentTheme.textPrimary },
              ]}
            >
              {tripDetails?.travelPlan?.destination || "Unknown Location"}
            </Text>
          </View>

          <View style={styles.tripMetaContainer}>
            <View
              style={[
                styles.tripMetaItem,
                { backgroundColor: `${currentTheme.alternate}20` },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color={currentTheme.alternate}
              />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {tripDetails?.travelPlan?.numberOfDays} days
              </Text>
            </View>
            <View
              style={[
                styles.tripMetaItem,
                { backgroundColor: `${currentTheme.alternate}20` },
              ]}
            >
              <Ionicons
                name="moon-outline"
                size={22}
                color={currentTheme.alternate}
              />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {tripDetails?.travelPlan?.numberOfNights} nights
              </Text>
            </View>
          </View>

          <HotelList hotelList={tripDetails?.travelPlan?.hotels} />
          <PlannedTrip details={tripDetails?.travelPlan} />
        </BlurView>
      </Animated.ScrollView>

      <BlurView intensity={90} style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text
            style={[styles.airlineName, { color: currentTheme.textPrimary }]}
          >
            {tripDetails?.travelPlan?.flights?.airlineName || "Unknown Airline"}{" "}
            ✈️
          </Text>
          <Text style={[styles.price, { color: currentTheme.alternate }]}>
            ${tripDetails?.travelPlan?.flights?.flightPrice || "N/A"}
          </Text>
        </View>
        <MainButton
          onPress={handleHeartPress}
          buttonText={isHearted ? "Saved! ♥" : "Save Trip"}
          width={width * 0.45}
          style={[
            styles.saveButton,
            {
              backgroundColor: isHearted
                ? currentTheme.alternate
                : currentTheme.alternate,
            },
          ]}
        />
      </BlurView>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  loadingText: {
    fontFamily: "outfit-medium",
    fontSize: 18,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 100,
    marginTop: height * 0.45,
  },
  contentContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerContainer: {
    marginBottom: 20,
  },
  destinationTitle: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    letterSpacing: 0.5,
  },
  tripMetaContainer: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 15,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tripMetaText: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    marginLeft: 8,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  priceContainer: {
    flex: 1,
  },
  airlineName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginBottom: 4,
  },
  price: {
    fontFamily: "outfit-bold",
    fontSize: 24,
  },
  saveButton: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    borderRadius: 15,
  },
});

export default RecommendedTripDetails;
