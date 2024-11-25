import { View, Text } from "react-native";
import { useTheme } from "../../context/themeContext";
import React from "react";
import PlaceCard from "./placeCard";

// Define an interface for the details prop
interface PlannedTripProps {
  details: {
    itinerary: {
      day: string;
      places: {
        placeName: string;
        details: string;
        timeToTravel: string;
      }[];
    }[];
    budget: string;
    destination: string;
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

      {details.itinerary.map(({ day, places }) => (
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
            {day}
          </Text>
          {Array.isArray(places) && places.length > 0 ? (
            places.map((place, index) => (
              <PlaceCard
                key={index}
                place={{
                  ...place,
                  details: place.details,
                }}
              />
            ))
          ) : (
            <Text style={{ color: "red" }}>
              No places planned for this day.
            </Text>
          )}
        </View>
      ))}

      <Text style={{ color: currentTheme.textPrimary }}>
        Budget: {details.budget}
      </Text>
      <Text style={{ color: currentTheme.textPrimary }}>
        Destination: {details.destination}
      </Text>
    </View>
  );
};

export default PlannedTrip;
