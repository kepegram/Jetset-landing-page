import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../api/googlePlaceApi";
import { useTheme } from "../../context/themeContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Place {
  placeName: string;
  placeDetails: string;
  placeExtendedDetails: string;
  placeUrl: string;
  timeToTravel: string;
  geoCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface PlaceCardProps {
  place: Place;
  onPhotoRefReady?: (photoRef: string) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onPhotoRefReady }) => {
  const { currentTheme } = useTheme();
  const [photoRef, setPhotoRef] = useState<string | undefined>();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  const GetGooglePhotoRef = async () => {
    const result = await GetPhotoRef(place.placeName);
    setPhotoRef(result);
    if (result && onPhotoRefReady) {
      onPhotoRefReady(result);
    }
  };

  const handlePress = () => {
    navigation.navigate("IteneraryDetail", {
      place: {
        ...place,
        photoRef,
      },
    });
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
        source={
          photoRef
            ? {
                uri:
                  "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
                  photoRef +
                  "&key=" +
                  process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
              }
            : require("../../assets/app-imgs/place-placeholder.jpg")
        }
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
