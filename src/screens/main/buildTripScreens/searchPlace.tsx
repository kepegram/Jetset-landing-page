import React, { useContext, useEffect, useState } from "react";
import { View, Pressable, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { CreateTripContext } from "../../../context/CreateTripContext";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { RootStackParamList } from "../../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";

// Extend GooglePlaceDetail to include 'photos'
interface ExtendedGooglePlaceDetail extends GooglePlaceDetail {
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

type SearchPlaceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SearchPlace"
>;

const SearchPlace: React.FC = () => {
  const { currentTheme } = useTheme();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const navigation = useNavigation<SearchPlaceScreenNavigationProp>();
  const [placeSelected, setPlaceSelected] = useState(false); // Track if a place has been selected

  useEffect(() => {
    console.log(tripData);
  }, [tripData]);

  const handlePlaceSelect = (
    data: any,
    details: ExtendedGooglePlaceDetail | null
  ) => {
    console.log("Unique ID:", uuidv4());
    console.log(data, details);

    setTripData({
      locationInfo: {
        name: data.description,
        coordinates: details?.geometry.location,
        photoRef: details?.photos?.[0]?.photo_reference,
        url: details?.url,
      },
    });
    setPlaceSelected(true);
  };

  return (
    <View
      style={{
        padding: 25,
        backgroundColor: currentTheme.background,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 40,
          marginBottom: 60,
          color: currentTheme.textPrimary,
        }}
      >
        Where to?
      </Text>
      <GooglePlacesAutocomplete
        placeholder="Search Destinations"
        textInputProps={{
          placeholderTextColor: currentTheme.textSecondary,
          returnKeyType: "search",
        }}
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
          language: "en",
        }}
        styles={{
          textInput: {
            backgroundColor: currentTheme.background,
            color: currentTheme.textPrimary,
            fontSize: 20,
          },
          predefinedPlacesDescription: {
            color: currentTheme.textPrimary,
          },
          listView: {
            backgroundColor: currentTheme.background,
          },
          description: {
            color: currentTheme.textPrimary,
            fontSize: 20,
          },
          row: {
            backgroundColor: currentTheme.background,
          },
        }}
      />

      {placeSelected && (
        <Pressable
          onPress={() => navigation.navigate("SelectTraveler")}
          style={{
            padding: 15,
            backgroundColor: currentTheme.alternate,
            borderRadius: 15,
            width: "90%",
            alignItems: "center",
            alignSelf: "center",
            position: "absolute",
            top: 300,
          }}
        >
          <Text
            style={{
              color: currentTheme.buttonText,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            Proceed to select traveler
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default SearchPlace;
