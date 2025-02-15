import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import React, { useContext, useCallback, useState, useRef } from "react";
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
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

  const renderOptionCard = (
    icon: JSX.Element,
    title: string,
    description: string,
    onPress: () => void
  ) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        {
          backgroundColor: pressed
            ? `${currentTheme.alternate}15`
            : `${currentTheme.secondary}10`,
          borderColor: currentTheme.alternate,
        },
      ]}
    >
      <View style={styles.optionIconContainer}>{icon}</View>
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, { color: currentTheme.textPrimary }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.optionDescription,
            { color: currentTheme.textSecondary },
          ]}
        >
          {description}
        </Text>
      </View>
      <MaterialIcons
        name="arrow-forward-ios"
        size={20}
        color={currentTheme.textSecondary}
      />
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
            Start Your Journey ✈️
          </Text>
          <Text
            style={[styles.subheading, { color: currentTheme.textSecondary }]}
          >
            Where would you like to explore?
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
              container: styles.autocompleteContainer,
              textInputContainer: styles.textInputContainer,
              textInput: [
                styles.textInput,
                {
                  backgroundColor: `${currentTheme.secondary}15`,
                  color: currentTheme.textPrimary,
                  borderColor: `${currentTheme.alternate}30`,
                },
              ],
              listView: [
                styles.listView,
                {
                  backgroundColor: currentTheme.background,
                },
              ],
              row: [
                styles.row,
                {
                  backgroundColor: currentTheme.background,
                },
              ],
              separator: [
                styles.separator,
                {
                  backgroundColor: `${currentTheme.textSecondary}20`,
                },
              ],
              description: [
                styles.description,
                {
                  color: currentTheme.textPrimary,
                },
              ],
              powered: { display: "none" },
              poweredContainer: { display: "none" },
            }}
          />
        </View>

        <View style={styles.optionsContainer}>
          <Text
            style={[styles.optionsTitle, { color: currentTheme.textPrimary }]}
          >
            Other Ways to Plan
          </Text>

          {renderOptionCard(
            <MaterialIcons
              name="edit-calendar"
              size={24}
              color={currentTheme.alternate}
            />,
            "Build Manually",
            "Create your own custom itinerary",
            () => navigation.navigate("ManualTripBuilder")
          )}

          {renderOptionCard(
            <Ionicons
              name="compass-outline"
              size={24}
              color={currentTheme.alternate}
            />,
            "Get Recommendations",
            "Discover perfect destinations for you",
            () => navigation.navigate("ChoosePlaces")
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 32,
  },
  heading: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontFamily: "outfit",
    opacity: 0.8,
  },
  searchContainer: {
    marginBottom: 32,
  },
  autocompleteContainer: {
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
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "outfit",
    borderWidth: 1,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  listView: {
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
    padding: 15,
    height: "auto",
    minHeight: 50,
  },
  separator: {
    height: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  description: {
    fontSize: 16,
    fontFamily: "outfit",
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionsTitle: {
    fontSize: 20,
    fontFamily: "outfit-medium",
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: "outfit",
    opacity: 0.8,
  },
});

export default WhereTo;
