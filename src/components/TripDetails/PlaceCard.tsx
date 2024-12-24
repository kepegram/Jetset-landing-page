import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../api/googlePlaceApi";
import { useTheme } from "../../context/themeContext";

// Define an interface for the place prop
interface Place {
  placeName: string;
  placeDetails: string;
  placeExtendedDetails: string;
  placeUrl: string;
}

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { currentTheme } = useTheme();
  const [photoRef, setPhotoRef] = useState<string | undefined>();

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  const GetGooglePhotoRef = async () => {
    const result = await GetPhotoRef(place.placeName);
    setPhotoRef(result);
  };

  const handlePress = () => {
    console.log("Place URL:", place.placeUrl);
    console.log("Place Details:", place.placeDetails);
    console.log("Place Extended Details:", place.placeExtendedDetails);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor: currentTheme.accentBackground,
        padding: 10,
        borderRadius: 15,
        borderColor: "gray",
        marginBottom: 20,
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
          width: "100%",
          height: 140,
          borderRadius: 15,
        }}
      />
      <View
        style={{
          marginTop: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            color: currentTheme.textPrimary,
          }}
        >
          {place?.placeName}
        </Text>
        <View style={{ marginTop: 5 }} />
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: currentTheme.textSecondary,
          }}
        >
          {place.placeDetails}
        </Text>
      </View>
    </Pressable>
  );
};

export default PlaceCard;
