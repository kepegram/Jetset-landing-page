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
        ticketPricing?: string; // Made ticketPricing optional
        timeToTravel: string;
      }[];
    };
  } | null;
}

const PlannedTrip: React.FC<PlannedTripProps> = ({ details }) => {
  const { currentTheme } = useTheme();

  if (!details || typeof details !== "object") {
    return (
      <View>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "outfit",
            color: "red",
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
          marginBottom: 10,
          fontFamily: "outfit-bold",
          color: currentTheme.textPrimary,
        }}
      >
        🏕️ Plan Details
      </Text>

      {Object.entries(details).map(([day, { plan }]) => (
        <View key={day}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 17,
              marginTop: 10,
              marginBottom: 10,
              color: currentTheme.textPrimary,
            }}
          >
            Day {parseInt(day) + 1}
          </Text>
          {Array.isArray(plan) && plan.length > 0 ? (
            plan.map((place, index) => (
              <PlaceCard
                key={index}
                place={{
                  ...place,
                  ticketPricing: place.ticketPricing || "N/A", // Check for ticketPricing
                }}
              />
            ))
          ) : (
            <Text style={{ color: "red" }}>
              No places planned for this day.
            </Text> // Handle case where plan is empty or undefined
          )}
        </View>
      ))}
    </View>
  );
};

export default PlannedTrip;
