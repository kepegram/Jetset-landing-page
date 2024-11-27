import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import moment from "moment";
import { useTheme } from "../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface UpcomingTripsCardProps {
  userTrips: Array<{
    tripData: string;
    tripPlan: string;
    id: string;
  }>;
}

const UpcomingTripsCard: React.FC<UpcomingTripsCardProps> = ({ userTrips }) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  if (!userTrips || userTrips.length === 0) return <Text>None</Text>;

  const parseData = (data: string) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse data:", error);
        return {};
      }
    }
    return data;
  };

  const today = moment().startOf("day");

  const sortedTrips = userTrips
    .map((trip) => ({
      ...trip,
      parsedTripData: parseData(trip.tripData),
      parsedTripPlan: parseData(trip.tripPlan),
    }))
    .sort((a, b) => {
      const dateA = moment(a.parsedTripData.startDate);
      const dateB = moment(b.parsedTripData.startDate);
      return dateA.diff(dateB);
    });

  const UpcomingTrip = sortedTrips.find((trip) => {
    const startDate = moment(trip.parsedTripData.startDate).startOf("day");
    const endDate = moment(trip.parsedTripData.endDate).endOf("day");
    return startDate.isAfter(today) && endDate.isAfter(today);
  })?.parsedTripData;

  const UpcomingPlan = sortedTrips.find((trip) => {
    const startDate = moment(trip.parsedTripData.startDate).startOf("day");
    const endDate = moment(trip.parsedTripData.endDate).endOf("day");
    return startDate.isAfter(today) && endDate.isAfter(today);
  })?.parsedTripPlan;

  if (!UpcomingTrip) return null;

  return (
    <View style={{ marginVertical: 20, width: 250 }}>
      {UpcomingTrip?.locationInfo?.photoRef ? (
        <Pressable
          onPress={() =>
            navigation.navigate("TripDetails", {
              trip: JSON.stringify({
                ...UpcomingTrip,
                travelPlan: UpcomingPlan?.travelPlan || {},
              }),
            })
          }
        >
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${UpcomingTrip.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
            }}
            style={{
              width: "100%",
              height: 240,
              borderRadius: 15,
            }}
          />
        </Pressable>
      ) : (
        <Image
          source={require("../../assets/placeholder.jpeg")}
          style={{
            width: "100%",
            height: 240,
            borderRadius: 15,
          }}
        />
      )}
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 24,
            color: currentTheme.textPrimary,
          }}
        >
          {UpcomingTrip?.locationInfo?.name || "No Location Name"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: currentTheme.textSecondary,
            }}
          >
            {UpcomingTrip?.startDate
              ? moment(UpcomingTrip.startDate).format("MMM DD yyyy")
              : "No Start Date"}{" "}
            -{" "}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: currentTheme.textSecondary,
            }}
          >
            {UpcomingTrip?.endDate
              ? moment(UpcomingTrip.endDate).format("MMM DD yyyy")
              : "No End Date"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UpcomingTripsCard;
