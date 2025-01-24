import { View, Text, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { CreateTripContext } from "../../../../context/createTripContext";

type SearchPlacesNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchPlaces"
>;

interface ExtendedGooglePlaceDetail extends GooglePlaceDetail {
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

const SearchPlaces: React.FC = () => {
  const navigation = useNavigation<SearchPlacesNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [photoRef, setPhotoRef] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  const handlePlaceSelect = async (
    data: any,
    details: ExtendedGooglePlaceDetail | null
  ) => {
    const photoReference = details?.photos?.[0]?.photo_reference || null;
    setTripData({
      ...tripData,
      locationInfo: {
        name: data.description,
        coordinates: details?.geometry.location,
        photoRef: photoReference,
        url: details?.url,
      },
    });
    if (photoReference) {
      await AsyncStorage.setItem("photoRef", photoReference);
      setPhotoRef(photoReference);
    }
    console.log(tripData.locationInfo);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: currentTheme.background,
        padding: 20,
      }}
    >
      <Text style={{ color: currentTheme.textPrimary }}>SearchPlaces</Text>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        textInputProps={{
          placeholderTextColor: "white",
          fontSize: 34,
          returnKeyType: "search",
          style: {
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 5,
            paddingHorizontal: 10,
          },
        }}
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            alignSelf: "center",
            width: "90%",
            position: "absolute",
            top: "50%",
            transform: [{ translateY: -25 }],
            zIndex: 1,
          },
          textInput: {
            height: 50,
            color: "white",
            backgroundColor: "transparent",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "black",
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
          listView: {
            backgroundColor: currentTheme.background,
            zIndex: 99,
          },
        }}
      />
      <Pressable onPress={() => navigation.navigate("ChooseDate")}>
        <Text style={{ color: currentTheme.textPrimary }}>Continue</Text>
      </Pressable>
    </View>
  );
};

export default SearchPlaces;
