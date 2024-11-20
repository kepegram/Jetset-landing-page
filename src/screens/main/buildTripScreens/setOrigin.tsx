import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { CreateTripContext } from "../../../context/createTripContext";
import { useTheme } from "../../../context/themeContext";
import SelectDates from "./selectDates";

const SetOrigin: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setTripData, tripData } = useContext(CreateTripContext);
  const [originSelected, setOriginSelected] = useState(false);

  const handleOriginSelect = (data: any, details: any | null) => {
    setTripData({
      ...tripData,
      locationFromInfo: {
        name: data.description,
        coordinates: details?.geometry.location,
        url: details?.url,
      },
    });
    setOriginSelected(true);
  };

  return (
    <View
      style={{
        marginTop: 30,
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
        From?
      </Text>
      <GooglePlacesAutocomplete
        placeholder="Search Origins"
        textInputProps={{
          placeholderTextColor: currentTheme.textSecondary,
          returnKeyType: "search",
        }}
        fetchDetails={true}
        onPress={handleOriginSelect}
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

      {originSelected && (
        <View style={{ marginTop: 20 }}>
          <SelectDates />
        </View>
      )}
    </View>
  );
};

export default SetOrigin;
