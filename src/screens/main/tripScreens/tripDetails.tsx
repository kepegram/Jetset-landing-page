import { View, Text, Image, ScrollView, Alert, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
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

const TripDetails: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { trip } = route.params as RouteParams;

  const [tripDetails, setTripDetails] = useState<any>(null);

  const user = FIREBASE_AUTH.currentUser;

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

  const deleteTrip = async (tripId: string) => {
    try {
      Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            const tripDocRef = doc(
              FIREBASE_DB,
              `users/${user.uid}/userTrips/${tripId}`
            );
            await deleteDoc(tripDocRef);
            console.log(`Trip with ID ${tripId} deleted successfully.`);
            navigation.navigate("MyTripsMain");
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

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
            <Ionicons
              name="trash-bin-outline"
              size={24}
              color={currentTheme.textSecondary}
              onPress={() => deleteTrip(tripDetails.id)}
              style={{ marginLeft: 10 }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 5, marginTop: 5 }}>
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
              {"- "}
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
            Traveling as: {tripDetails?.whoIsGoing || "Unknown"}
          </Text>

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

export default TripDetails;
