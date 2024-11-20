import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import { CreateTripContext } from "../../../context/createTripContext";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { useTheme } from "../../../context/themeContext";
import SetOrigin from "./setOrigin";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { RootStackParamList } from "../../../navigation/appNav";
import { StackNavigationProp } from "@react-navigation/stack";

// Extend GooglePlaceDetail to include 'photos'
interface ExtendedGooglePlaceDetail extends GooglePlaceDetail {
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

type SearchPlaceNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchPlace"
>;

const SearchPlace: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setTripData } = useContext(CreateTripContext);
  const [placeSelected, setPlaceSelected] = useState(false);
  const navigation = useNavigation<SearchPlaceNavigationProp>(); // Initialize navigation

  const handlePlaceSelect = (
    data: any,
    details: ExtendedGooglePlaceDetail | null
  ) => {
    setTripData({
      locationInfo: {
        name: data.description,
        coordinates: details?.geometry.location,
        photoRef: details?.photos?.[0]?.photo_reference,
        url: details?.url,
      },
    });
    setPlaceSelected(true);
    // navigation.navigate("BuildTrip");
  };

  return (
    <View
      style={{
        padding: 30,
        backgroundColor: currentTheme.background,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 40,
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
        <View style={{ marginTop: 20 }}>
          <SetOrigin />
        </View>
      )}
    </View>
  );
};

export default SearchPlace;
