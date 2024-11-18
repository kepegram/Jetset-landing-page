import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GetPhotoRef } from "../../api/googlePlaceApi";
import { useTheme } from "../../context/themeContext";

// Define an interface for the place prop
interface Place {
  placeName: string;
  placeDetails: string;
  ticketPricing: string;
  timeToTravel: string;
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

  return (
    <View
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
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 14,
            color: currentTheme.textSecondary,
          }}
        >
          {place.placeDetails}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                marginTop: 5,
                color: currentTheme.textSecondary,
              }}
            >
              🎟️ Ticket Price:
              <Text
                style={{
                  fontFamily: "outfit-bold",
                  color: currentTheme.textSecondary,
                }}
              >
                {" "}
                {place?.ticketPricing}
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                marginTop: 5,
                color: currentTheme.textSecondary,
              }}
            >
              ⏱️ Time to Travel:{" "}
              <Text
                style={{
                  fontFamily: "outfit-bold",
                  color: currentTheme.textSecondary,
                }}
              >
                {place?.timeToTravel}
              </Text>
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: currentTheme.alternate,
              padding: 8,
              borderRadius: 7,
            }}
          >
            <Ionicons name="navigate" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PlaceCard;
