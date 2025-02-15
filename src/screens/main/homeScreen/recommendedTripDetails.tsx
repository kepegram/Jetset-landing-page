import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  ScrollView,
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
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
          <Text style={[styles.price, { color: currentTheme.alternate }]}>
            ${tripDetails?.travelPlan?.flights?.flightPrice || "N/A"}
          </Text>
        </View>
        <MainButton
          onPress={() => {
            console.log("Book Trip", tripDetails);
          }}
          buttonText={"Book Trip"}
          width={width * 0.45}
          style={[styles.saveButton]}
        />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayTitle: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "white",
  },
});

export default RecommendedTripDetails;
