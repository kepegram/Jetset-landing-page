import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import moment from "moment";
import { useTheme } from "../../context/themeContext";
import UserTripListCard from "./userTripListCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface UserTripMainCardProps {
  userTrips: Array<{
    tripData: string;
    tripPlan: string;
  }>;
}

const UserTripMainCard: React.FC<UserTripMainCardProps> = ({ userTrips }) => {
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

  const LatestTrip = parseData(userTrips[userTrips.length - 1]?.tripData);
  const LatestPlan = parseData(userTrips[userTrips.length - 1]?.tripPlan);

  return (
    <View style={{ marginTop: 20 }}>
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
            justifyContent: "space-between",
            marginTop: 5,
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
              : "No Start Date"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: currentTheme.textSecondary,
              marginHorizontal: 10,
            }}
          />
          <Text
            style={{
              color: currentTheme.textSecondary,
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 15,
            }}
          >
            All your plans
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: currentTheme.textSecondary,
              marginHorizontal: 10,
            }}
          />
        </View>
      </View>
      {userTrips.map((trip, index) => {
        if (!trip || !trip.tripData || !trip.tripPlan) {
          console.warn(`Skipping invalid trip at index ${index}:`, trip);
          return null;
        }

        return (
          <UserTripListCard
            trip={{
              tripData: trip.tripData,
              tripPlan: trip.tripPlan,
            }}
            key={index}
          />
        );
      })}
    </View>
  );
};

export default UserTripMainCard;
