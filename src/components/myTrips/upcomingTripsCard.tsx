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

  if (!userTrips || userTrips.length === 0) return null;

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
      return dateA.diff(today) - dateB.diff(today);
    });

  const LatestTrip = sortedTrips[0]?.parsedTripData;
  const LatestPlan = sortedTrips[0]?.parsedTripPlan;

  if (
    LatestTrip?.startDate &&
    moment(LatestTrip.startDate).isSame(today, "day")
  ) {
    return null;
  }

  return (
    <View style={{ marginVertical: 20, width: 250 }}>
      {LatestTrip?.locationInfo?.photoRef ? (
        <Pressable
          onPress={() =>
            navigation.navigate("TripDetails", {
              trip: JSON.stringify({
                ...LatestTrip,
                travelPlan: LatestPlan?.travelPlan || {},
              }),
            })
          }
        >
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${LatestTrip.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
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
            fontFamily: "outfit-medium",
            fontSize: 24,
            color: currentTheme.textPrimary,
          }}
        >
          {LatestTrip?.locationInfo?.name || "No Location Available"}
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
            {LatestTrip?.startDate
              ? moment(LatestTrip.startDate).format("MMM DD yyyy")
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
            {LatestTrip?.startDate
              ? moment(LatestTrip.endDate).format("MMM DD yyyy")
              : "No Start Date"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UpcomingTripsCard;
