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
    tripData: string; // Assuming tripData is stored as a JSON string
  }>;
}

const UserTripMainCard: React.FC<UserTripMainCardProps> = ({ userTrips }) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  if (!userTrips || userTrips.length === 0) return null;

  // Safely parse tripData only if it's a string
  const parseTripData = (tripData: string) => {
    if (typeof tripData === "string") {
      try {
        return JSON.parse(tripData);
      } catch (error) {
        console.error("Failed to parse tripData:", error);
        return {}; // Return a fallback empty object
      }
    }
    return tripData; // Already an object
  };

  const LatestTrip = parseTripData(userTrips[userTrips.length - 1]?.tripData);

  return (
    <View style={{ marginTop: 20 }}>
      {LatestTrip?.locationInfo?.photoRef ? (
        <Pressable
          onPress={() =>
            navigation.navigate("TripDetails", {
              trip: JSON.stringify(LatestTrip),
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
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: currentTheme.textSecondary,
            }}
          >
            Traveling: {LatestTrip?.traveler?.title || "Unknown"}
          </Text>
        </View>
        <Text
          style={{
            color: currentTheme.textSecondary,
            textAlign: "center",
            fontFamily: "outfit-medium",
            fontSize: 15,
            marginTop: 20,
          }}
        >
          All your plans
        </Text>
      </View>
      {userTrips.map(({ tripData }: { tripData: string }, index: number) => (
        <UserTripListCard trip={{ tripData }} key={index} />
      ))}
    </View>
  );
};

export default UserTripMainCard;
