import { View, Text, Image, ScrollView, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import PlannedTrip from "../../../components/tripDetails/plannedTrip";
import moment from "moment";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CurrentTripDetails"
>;

interface RouteParams {
  trip: string;
  photoRef: string;
}

const CurrentTripDetails: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { trip, photoRef } = route.params as RouteParams;

  const [tripDetails, setTripDetails] = useState<any>(null);
  const [isHearted, setIsHearted] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

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

      // Calculate days left until the end of the trip
      const endDate = moment(parsedTrip.endDate);
      const today = moment().startOf("day");
      const daysRemaining = endDate.diff(today, "days");
      setDaysLeft(daysRemaining);
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
            uri: tripDetails?.locationInfo?.photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripDetails?.locationInfo?.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily: "outfit-bold",
                color: currentTheme.textPrimary,
              }}
            >
              {tripDetails?.travelPlan?.destination || "Unknown Location"}
            </Text>
            <Pressable onPress={() => setIsHearted(!isHearted)}>
              <Ionicons
                name={isHearted ? "heart" : "heart-outline"}
                size={30}
                color={isHearted ? "red" : currentTheme.textPrimary}
              />
            </Pressable>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              {daysLeft !== null
                ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`
                : "End date not available"}
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
          </View>

          {/* Planned Trip */}
          <PlannedTrip details={tripDetails?.travelPlan} />
        </View>
      </ScrollView>
    </View>
  );
};

export default CurrentTripDetails;
