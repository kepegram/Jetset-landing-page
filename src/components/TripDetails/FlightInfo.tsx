import { View, Text, Pressable } from "react-native";
import React from "react";
import { useTheme } from "../../context/themeContext";

// Define an interface for flightData
interface FlightData {
  price: number;
  airline: string;
}

interface FlightInfoProps {
  flightData: FlightData; // Type the prop correctly
}

const FlightInfo: React.FC<FlightInfoProps> = ({ flightData }) => {
  const { currentTheme } = useTheme();

  return (
    <View
      style={{
        marginTop: 10,
        padding: 10,
      }}
    >
      <View
        style={{
          display: "flex",
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
          style={{
            backgroundColor: currentTheme.alternate,
            padding: 5,
            width: 100,
            borderRadius: 7,
            marginTop: 7,
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
          marginTop: 7,
          color: currentTheme.textSecondary,
        }}
      >
        Airline: {flightData.airline}
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 17,
          color: currentTheme.textSecondary,
        }}
      >
        Price: {flightData.price}
      </Text>
    </View>
  );
};

export default FlightInfo;
