import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import React, { useContext, useCallback, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useTheme } from "../../../../context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { CreateTripContext } from "../../../../context/createTripContext";
import { Ionicons } from "@expo/vector-icons";

type WhereToNavigationProp = StackNavigationProp<RootStackParamList, "WhereTo">;

// Interface for extended Google Place Details including photo information
interface ExtendedGooglePlaceDetail extends GooglePlaceDetail {
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

// Interface for storing location information
interface LocationInfo {
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  photoRef?: string | null;
  url?: string;
}

// Interface for Google Places Autocomplete data
interface PlaceData {
  description: string;
  [key: string]: any;
}

const WhereTo: React.FC = () => {
  const navigation = useNavigation<WhereToNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [photoRef, setPhotoRef] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
        headerTitle: "",
        headerStyle: {
          backgroundColor: "transparent",
        },
      });
    }, [navigation])
  );

  // Handle selection of a place from Google Places Autocomplete
  const handlePlaceSelect = async (
    data: PlaceData,
    details: ExtendedGooglePlaceDetail | null
  ) => {
    if (!details) return;

    // Extract photo reference from the place details
    const photoReference = details.photos?.[0]?.photo_reference || null;

    // Create location info object with place details
    const locationInfo: LocationInfo = {
      name: data.description,
      coordinates: details.geometry.location,
      photoRef: photoReference,
      url: details.url,
    };

    // Update trip data with new location info
    setTripData({
      ...tripData,
      locationInfo,
    });

    // Store photo reference in AsyncStorage if available
    if (photoReference) {
      try {
        await AsyncStorage.setItem("photoRef", photoReference);
        setPhotoRef(photoReference);
      } catch (error) {
        console.error("Error saving photo reference:", error);
      }
    }

    // Navigate to date selection screen
    navigation.navigate("ChooseDate");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
              Where would you like to go? ✈️
            </Text>
            <Text
              style={[styles.subheading, { color: currentTheme.textSecondary }]}
            >
              Search for a city, region, or country
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Search destinations..."
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
                container: {
                  flex: 0,
                  width: "100%",
                  zIndex: 1,
                },
                textInputContainer: {
                  backgroundColor: "transparent",
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  marginHorizontal: 0,
                  paddingHorizontal: 0,
                },
                textInput: {
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  fontSize: 18,
                  fontFamily: "outfit",
                  height: 55,
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginTop: 0,
                  marginBottom: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  borderWidth: 1,
                  borderColor: "grey",
                },
                listView: {
                  backgroundColor: currentTheme.background,
                  borderRadius: 12,
                  marginTop: 10,
                  marginHorizontal: 0,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                },
                row: {
                  backgroundColor: currentTheme.background,
                  padding: 15,
                  height: "auto",
                  minHeight: 50,
                },
                separator: {
                  height: 1,
                  backgroundColor: `${currentTheme.textSecondary}20`,
                  marginLeft: 15,
                  marginRight: 15,
                },
                description: {
                  color: currentTheme.textPrimary,
                  fontSize: 16,
                  fontFamily: "outfit",
                },
                powered: {
                  display: "none",
                },
                poweredContainer: {
                  display: "none",
                },
              }}
            />
          </View>

          <View style={styles.dividerContainer}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: currentTheme.textSecondary },
              ]}
            />
            <Text
              style={[
                styles.dividerText,
                { color: currentTheme.textSecondary },
              ]}
            >
              Don't know?
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: currentTheme.textSecondary },
              ]}
            />
          </View>

          <Pressable
            onPress={() => navigation.navigate("ChoosePlaces")}
            style={({ pressed }) => [
              styles.helpButton,
              {
                backgroundColor: pressed
                  ? currentTheme.alternate
                  : currentTheme.background,
                borderColor: currentTheme.alternate,
              },
            ]}
          >
            <Ionicons
              name="compass-outline"
              size={24}
              color={currentTheme.textPrimary}
              style={styles.buttonIcon}
            />
            <Text
              style={[styles.buttonText, { color: currentTheme.textPrimary }]}
            >
              Help me choose
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 100,
    marginBottom: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    opacity: 0.8,
  },
  searchContainer: {
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.2,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "outfit-medium",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
});

export default WhereTo;
