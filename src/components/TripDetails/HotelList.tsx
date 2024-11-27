import { View, Text, FlatList } from "react-native";
import React from "react";
import HotelCard from "./hotelCard";
import { useTheme } from "../../context/themeContext";

// Define the interface for the 'hotelList' prop
interface HotelListProps {
  hotelList: Array<{
    hotelName: string;
    rating: number;
    price: number;
    geoCoordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
}

const HotelList: React.FC<HotelListProps> = ({ hotelList }) => {
  const { currentTheme } = useTheme();

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
          color: currentTheme.textPrimary,
        }}
      >
        🏨 Hotel Recommendations
      </Text>

      <FlatList
        data={hotelList}
        style={{
          marginTop: 10,
        }}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item }) => <HotelCard item={item} />}
      />
    </View>
  );
};

export default HotelList;
