import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import moment from "moment";
import { useTheme } from "../../context/themeContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface PastTripListCardProps {
  trip: {
    tripData: string;
    tripPlan: string;
    id: string;
  };
}

const PastTripListCard: React.FC<PastTripListCardProps> = ({ trip }) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const formatData = (data: string) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing data:", error);
        return {};
      }
    }
    return data;
  };

  const tripData = formatData(trip.tripData);
  const tripPlan = formatData(trip.tripPlan);
  const endDate = tripData.endDate ? moment(tripData.endDate) : null;

  // Only display the trip if the end date is in the past
  if (endDate && endDate.isBefore(moment(), 'day')) {
    const daysFromToday = moment().diff(endDate, 'days');
    return (
      <Pressable
        onPress={() => {
          navigation.navigate("TripDetails", {
            trip: JSON.stringify({
              ...tripData,
              travelPlan: tripPlan?.travelPlan || {},
            }),
          });
        }}
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: tripData.locationInfo?.photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
              : "https://via.placeholder.com/100",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 15,
          }}
        />
        {/* Trip Data */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 18,
              color: currentTheme.textPrimary,
            }}
          >
            {tripData.locationInfo?.name || "No Location Available"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 14,
                color: currentTheme.textSecondary,
              }}
            >
              {`Ended ${daysFromToday} days ago`}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // If no past trips, display nothing
  return null;
};

export default PastTripListCard;
