import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import moment from "moment";
import { useTheme } from "../../context/themeContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav"; // Ensure correct path

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface UserTripListCardProps {
  trip: {
    tripData: string; // Assuming tripData is a JSON string
  };
}

const UserTripListCard: React.FC<UserTripListCardProps> = ({ trip }) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const formatData = (data: string) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing tripData:", error);
        return {};
      }
    }
    return data;
  };

  const tripData = formatData(trip.tripData);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("TripDetails", { trip: JSON.stringify(tripData) });
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
      <View>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 18,
            color: currentTheme.textPrimary,
          }}
        >
          {tripData.locationInfo?.name || "No Location Available"}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: currentTheme.textSecondary,
          }}
        >
          {tripData.startDate
            ? moment(tripData.startDate).format("MMM DD yyyy")
            : "No Start Date"}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: currentTheme.textSecondary,
          }}
        >
          Traveling: {tripData.traveler?.title || "Unknown"}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserTripListCard;
