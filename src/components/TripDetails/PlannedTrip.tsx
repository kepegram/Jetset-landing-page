import { View, Text } from "react-native";
import React from "react";
import PlaceCard from "./placeCard";
import { useTheme } from "../../context/themeContext";

// Define an interface for the details prop
interface PlannedTripProps {
  details: {
    [day: string]: {
      plan: {
        placeName: string;
        placeDetails: string;
        ticketPricing: string;
        timeToTravel: string;
      }[];
    };
  } | null; // Allow null or undefined for safety
}

const PlannedTrip: React.FC<PlannedTripProps> = ({ details }) => {
  const { currentTheme } = useTheme();

  if (!details || typeof details !== "object") {
    // Handle cases where details is null, undefined, or not an object
    return (
      <View>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "outfit",
            color: "red", // Optional styling to indicate missing data
          }}
        >
          No Plan Details Available
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: "outfit-bold",
          color: currentTheme.textPrimary,
        }}
      >
        🏕️ Plan Details
      </Text>

      {Object.entries(details)
        .reverse()
        .map(([day, { plan }]) => (
          <View key={day}>
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: 20,
                marginTop: 20,
              }}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>
            {plan.map((place, index) => (
              <PlaceCard key={index} place={place} />
            ))}
          </View>
        ))}
    </View>
  );
};

export default PlannedTrip;
