import { View, Text, Pressable, Linking } from "react-native";
import React from "react";
import { useTheme } from "../../context/themeContext";

// Define an interface for flightData
interface FlightData {
  airlineName: string;
  airlineUrl: string;
  flightPrice: number;
}

interface FlightInfoProps {
  flightData: FlightData; // Type the prop correctly
}

const FlightInfo: React.FC<FlightInfoProps> = ({ flightData }) => {
  const { currentTheme } = useTheme();

  // Handle "Book Here" button click
  const handleBookClick = () => {
    if (flightData.airlineUrl) {
      Linking.openURL(flightData.airlineUrl);
      console.log(flightData.airlineUrl);
    } else {
      alert("Invalid url");
    }
  };

  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            color: currentTheme.textPrimary,
          }}
        >
          ✈️ Flights
        </Text>
        <Pressable
          onPress={handleBookClick}
          style={{
            backgroundColor: currentTheme.alternate,
            padding: 5,
            width: 100,
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: currentTheme.buttonText,
              fontFamily: "outfit",
            }}
          >
            Book Here
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 17,
          color: currentTheme.textSecondary,
        }}
      >
        Airline: {flightData.airlineName}
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 17,
          color: currentTheme.textSecondary,
        }}
      >
        Price: ${flightData.flightPrice} (approx.)
      </Text>
    </View>
  );
};

export default FlightInfo;
