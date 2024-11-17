import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav"; // Ensure correct path
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
import FlightInfo from "../../../components/tripDetails/flightInfo";
import HotelList from "../../../components/tripDetails/hotelList";
import PlannedTrip from "../../../components/tripDetails/plannedTrip";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface RouteParams {
  trip: string; // Trip data passed as a JSON string
}

const TripDetails: React.FC = () => {
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

    console.log("TRIP-------", trip);

    // Parse trip details from JSON
    try {
      setTripDetails(JSON.parse(trip));
    } catch (error) {
      console.error("Error parsing trip details:", error);
    }
  }, [trip, navigation]);

  if (!tripDetails) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: "outfit-medium", fontSize: 18 }}>
          Loading trip details...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image
        source={{
          uri: tripDetails?.locationInfo?.photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripDetails.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
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
          height: "100%",
          marginTop: -30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontFamily: "outfit-bold",
            color: currentTheme.textPrimary,
          }}
        >
          {tripDetails?.locationInfo?.name || "Unknown Location"}
        </Text>
        <View
          style={{
            flexDirection: "row",
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
            {moment(tripDetails?.startDate).format("MMM DD yyyy")}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
              color: currentTheme.textSecondary,
            }}
          >
            {" - "}
            {moment(tripDetails?.endDate).format("MMM DD yyyy")}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 17,
            color: currentTheme.textSecondary,
          }}
        >
          Traveling: {tripDetails?.traveler?.title || "Unknown"}
        </Text>

        {/* Flight Info */}
        <FlightInfo flightData={tripDetails?.travelPlan?.flights || []} />

        {/* Hotels List */}
        <HotelList hotelList={tripDetails?.travelPlan?.hotels || []} />

        {/* Planned Trip */}
        <PlannedTrip details={tripDetails?.travelPlan?.itinerary || {}} />
      </View>
    </ScrollView>
  );
};

export default TripDetails;
