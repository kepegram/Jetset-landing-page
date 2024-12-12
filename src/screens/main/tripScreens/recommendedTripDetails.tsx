import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Pressable,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import FlightInfo from "../../../components/tripDetails/flightInfo";
import HotelList from "../../../components/tripDetails/hotelList";
import PlannedTrip from "../../../components/tripDetails/plannedTrip";
import { MainButton } from "../../../components/ui/button";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface RouteParams {
  trip: string;
}

const RecommendedTripDetails: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { trip } = route.params as RouteParams;

  const [tripDetails, setTripDetails] = useState<any>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });

    // Parse trip details from JSON
    try {
      const parsedTrip = JSON.parse(trip);
      setTripDetails(parsedTrip);
    } catch (error) {
      console.error("Error parsing trip details:", error);
    }
  }, [trip, navigation]);

  if (!tripDetails) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: currentTheme.background,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 18,
            color: currentTheme.textPrimary,
          }}
        >
          Loading trip details...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image
          source={{
            uri: tripDetails?.photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripDetails.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
              : "https://via.placeholder.com/400",
          }}
          style={{
            width: "100%",
            height: 330,
          }}
        />
        <View
          style={{
            padding: 15,
            backgroundColor: currentTheme.background,
            marginTop: -30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 25,
                fontFamily: "outfit-bold",
                color: currentTheme.textPrimary,
              }}
            >
              {tripDetails?.travelPlan?.destination || "Unknown Location"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 18,
                color: currentTheme.textSecondary,
              }}
            >
              {tripDetails?.travelPlan?.numberOfDays} days
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 18,
                marginRight: 5,
                color: currentTheme.textSecondary,
              }}
            >
              {tripDetails?.travelPlan?.numberOfNights} nights
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                marginRight: 5,
                color: currentTheme.textSecondary,
              }}
            >
              Traveling as: {tripDetails?.whoIsGoing || "Unknown"}
            </Text>
            <Pressable onPress={() => Alert.alert("Edit Traveling As")}>
              <Ionicons
                name="pencil"
                size={18}
                color={currentTheme.textSecondary}
              />
            </Pressable>
          </View>

          {/* Hotels List */}
          <HotelList hotelList={tripDetails?.travelPlan?.hotels} />

          {/* Planned Trip */}
          <PlannedTrip details={tripDetails?.travelPlan} />
        </View>
      </ScrollView>

      {/* Flight Price and Booking */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: currentTheme.background,
          padding: 20,
          height: 110,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 18,
              color: currentTheme.textPrimary,
            }}
          >
            {tripDetails?.travelPlan?.flights?.airlineName || "Unknown Airline"}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: currentTheme.textSecondary,
            }}
          >
            ${tripDetails?.travelPlan?.flights?.flightPrice || "N/A"}
          </Text>
        </View>
        <MainButton
          onPress={() => {
            const url = tripDetails?.travelPlan?.flights?.airlineUrl;
            if (url) {
              Linking.openURL(url);
            } else {
              Alert.alert("Booking URL not available");
            }
          }}
          buttonText="Book Now"
          width={200}
        />
      </View>
    </View>
  );
};

export default RecommendedTripDetails;
