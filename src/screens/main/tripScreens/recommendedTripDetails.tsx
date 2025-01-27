import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useRoute } from "@react-navigation/native";
import HotelList from "../../../components/tripDetails/hotelList";
import PlannedTrip from "../../../components/tripDetails/plannedTrip";
import { MainButton } from "../../../components/ui/button";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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

  const [tripDetails, setTripDetails] = useState<any>(null);
  const [isHearted, setIsHearted] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
      ),
    });

    try {
      const parsedTrip = JSON.parse(trip);
      setTripDetails(parsedTrip);
    } catch (error) {
      console.error("Error parsing trip details:", error);
    }
  }, [trip, navigation]);

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
          navigation.navigate("MyTripsMain");
        } catch (error) {
          console.error("Error saving trip details:", error);
        }
      } else {
        Alert.alert("User not authenticated");
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
        <Text style={[styles.loadingText, { color: currentTheme.textPrimary }]}>
          Loading trip details...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
              : "https://via.placeholder.com/400",
          }}
          style={styles.image}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={styles.gradient}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.contentContainer,
            { backgroundColor: currentTheme.background },
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
            <View style={styles.tripMetaItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={currentTheme.textSecondary}
              />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {tripDetails?.travelPlan?.numberOfDays} days
              </Text>
            </View>
            <View style={styles.tripMetaItem}>
              <Ionicons
                name="moon-outline"
                size={20}
                color={currentTheme.textSecondary}
              />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {tripDetails?.travelPlan?.numberOfNights} nights
              </Text>
            </View>
          </View>

          <HotelList hotelList={tripDetails?.travelPlan?.hotels} />
          <PlannedTrip details={tripDetails?.travelPlan} />
        </View>
      </ScrollView>

      <View
        style={[styles.bottomBar, { backgroundColor: currentTheme.background }]}
      >
        <View style={styles.priceContainer}>
          <Text
            style={[styles.airlineName, { color: currentTheme.textPrimary }]}
          >
            {tripDetails?.travelPlan?.flights?.airlineName || "Unknown Airline"}{" "}
            ✈️
          </Text>
          <Text style={[styles.price, { color: currentTheme.textSecondary }]}>
            ${tripDetails?.travelPlan?.flights?.flightPrice || "N/A"}
          </Text>
        </View>
        <MainButton
          onPress={handleHeartPress}
          buttonText={isHearted ? "Saved!" : "Save Trip"}
          width={width * 0.45}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    height: height * 0.45,
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
    height: 100,
  },
  backButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scrollContent: {
    paddingBottom: 100,
    marginTop: height * 0.4,
  },
  contentContainer: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerContainer: {
    marginBottom: 15,
  },
  destinationTitle: {
    fontSize: 28,
    fontFamily: "outfit-bold",
  },
  tripMetaContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  tripMetaText: {
    fontFamily: "outfit",
    fontSize: 16,
    marginLeft: 5,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  priceContainer: {
    flex: 1,
  },
  airlineName: {
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
  price: {
    fontFamily: "outfit",
    fontSize: 16,
  },
  saveButton: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default RecommendedTripDetails;
