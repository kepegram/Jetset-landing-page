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

interface CurrentTripCardProps {
  userTrips: Array<{
    tripData: string;
    tripPlan: string;
    id: string; // Added trip ID to the interface
  }>;
}

const CurrentTripCard: React.FC<CurrentTripCardProps> = ({ userTrips }) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  if (!userTrips || userTrips.length === 0) return null;

  // Safely parse tripData and tripPlan
  const parseData = (data: string) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse data:", error);
        return {}; // Return fallback object
      }
    }
    return data; // Already an object
  };

  const CurrentTrip = parseData(userTrips[userTrips.length - 1]?.tripData);
  const CurrentPlan = parseData(userTrips[userTrips.length - 1]?.tripPlan);

  return (
    <View style={{ marginVertical: 20, width: "100%" }}>
      {CurrentTrip?.locationInfo?.photoRef ? (
        <Pressable
          onPress={() =>
            navigation.navigate("TripDetails", {
              trip: JSON.stringify({
                ...CurrentTrip,
                travelPlan: CurrentPlan?.travelPlan || {},
              }),
            })
          }
        >
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${CurrentTrip.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
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
          {CurrentTrip?.tripName || "No Location Available"}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 20,
            color: currentTheme.textSecondary,
            marginTop: 5,
          }}
        >
          {CurrentTrip?.locationInfo?.name || "No Location Name"}
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
            {CurrentTrip?.startDate
              ? moment(CurrentTrip.startDate).format("MMM DD yyyy")
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
            {CurrentTrip?.startDate
              ? moment(CurrentTrip.endDate).format("MMM DD yyyy")
              : "No Start Date"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentTripCard;
