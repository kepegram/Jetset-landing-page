import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../api/googlePlaceApi";
import { useTheme } from "../../context/themeContext";

// Define the interface for the 'item' prop
interface HotelCardProps {
  item: {
    hotelName: string;
    rating: number;
    price: number;
  };
}

const HotelCard: React.FC<HotelCardProps> = ({ item }) => {
  const { currentTheme } = useTheme();
  const [photoRef, setPhotoRef] = useState<string | undefined>();

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  const GetGooglePhotoRef = async () => {
    const result = await GetPhotoRef(item.hotelName);
    setPhotoRef(result);
  };

  return (
    <View
      style={{
        marginRight: 20,
        width: 180,
      }}
    >
      <Image
        source={{
          uri:
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
            photoRef +
            "&key=" +
            process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
        }}
        style={{
          width: 180,
          height: 120,
          borderRadius: 15,
        }}
      />
      <View
        style={{
          padding: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 17,
            color: currentTheme.textPrimary,
          }}
          numberOfLines={1}
        >
          {item.hotelName}
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
              color: currentTheme.textSecondary,
            }}
          >
            Rating: {item.rating} ⭐
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              color: currentTheme.textSecondary,
            }}
          >
            Price: ${item.price}/night
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HotelCard;
