import { View, Text } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

// Define the type for trip details if you have a specific structure
type TripDetails = {
  location: string;
  address: string;
  // Add other properties as needed
};

const TripBuilder: React.FC = () => {
  const route = useRoute();
  const { tripDetails } = route.params as { tripDetails: TripDetails }; // Cast the params type

  return (
    <View>
      <Text>TripBuilder</Text>
      <Text>Location: {tripDetails.location}</Text>
      <Text>Address: {tripDetails.address}</Text>
      {/* Add other trip details as needed */}
    </View>
  );
};

export default TripBuilder;
