import { View, Text, Image, Pressable, Alert } from "react-native";
import React from "react";
import moment from "moment";
import { useTheme } from "../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebase.config";
import { doc, deleteDoc } from "firebase/firestore";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface CurrentTripsCardProps {
  userTrips: Array<{
    tripData: string;
    tripPlan: string;
    id: string; // Added trip ID to the interface
  }>;
  onTripDeleted: () => void;
}

const CurrentTripsCard: React.FC<CurrentTripsCardProps> = ({
  userTrips,
  onTripDeleted,
}) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const user = FIREBASE_AUTH.currentUser;

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

  const LatestTrip = parseData(userTrips[userTrips.length - 1]?.tripData);
  const LatestPlan = parseData(userTrips[userTrips.length - 1]?.tripPlan);

  return (
    <View style={{ marginVertical: 20, width: 250 }}>
      {LatestTrip?.locationInfo?.photoRef ? (
        <Pressable
          onPress={() =>
            navigation.navigate("TripDetails", {
              trip: JSON.stringify({
                ...LatestTrip,
                travelPlan: LatestPlan?.travelPlan || {}, // Combine LatestPlan details
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
            alignItems: "center", // Align items vertically centered
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

export default CurrentTripsCard;
