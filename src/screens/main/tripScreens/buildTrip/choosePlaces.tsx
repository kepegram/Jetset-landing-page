import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/themeContext";
import { MainButton } from "../../../../components/ui/button";
import { CreateTripContext } from "../../../../context/createTripContext";
import { SafeAreaView } from "react-native-safe-area-context";

type ChoosePlacesNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChoosePlaces"
>;

const { width, height } = Dimensions.get("window");

const ChoosePlaces: React.FC = () => {
  const navigation = useNavigation<ChoosePlacesNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  // Track selected destination type
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );

  // Predefined destination options with images and labels
  const destinations = [
    {
      id: "beach",
      image: require("../../../../assets/build-trip-imgs/beach.jpeg"),
      label: "Beach",
    },
    {
      id: "mountain",
      image: require("../../../../assets/build-trip-imgs/mountain.jpg"),
      label: "Mountain",
    },
    {
      id: "islands",
      image: require("../../../../assets/build-trip-imgs/island.jpg"),
      label: "Islands",
    },
    {
      id: "landmarks",
      image: require("../../../../assets/build-trip-imgs/landmark.jpg"),
      label: "Landmarks",
    },
  ];

  // Handle continue button press
  const handleContinue = () => {
    if (selectedDestination) {
      // Find selected destination details
      const selectedPlace = destinations.find(
        (dest) => dest.id === selectedDestination
      );

      // Update trip data with selected destination type
      const updatedTripData = {
        ...tripData,
        destinationType: selectedPlace?.label,
        locationInfo: {
          name: `${selectedPlace?.label} Destination`,
        },
      };
      setTripData(updatedTripData);
      console.log("Updated Trip Data:", updatedTripData);
      navigation.navigate("ChooseDate");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text
            style={[styles.subheading, { color: currentTheme.textSecondary }]}
          >
            Where to?
          </Text>
          <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
            Pick your destination
          </Text>
        </View>

        {/* Destination Options Grid */}
        <View style={styles.destinationsContainer}>
          {destinations.map((dest) => (
            <Pressable
              key={dest.id}
              onPress={() => setSelectedDestination(dest.id)}
              style={[
                styles.destinationButton,
                selectedDestination === dest.id && styles.selectedDestination,
              ]}
            >
              <Image source={dest.image} style={styles.destinationImage} />
              <Text
                style={[
                  styles.destinationLabel,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {dest.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <MainButton
            onPress={handleContinue}
            buttonText="Continue"
            width={"70%"}
            disabled={!selectedDestination}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "flex-start",
    marginTop: height * 0.04,
  },
  subheading: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
  },
  heading: {
    fontSize: width * 0.08,
    fontWeight: "bold",
  },
  destinationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.02,
  },
  destinationButton: {
    alignItems: "center",
    width: width * 0.42,
    marginBottom: height * 0.03,
  },
  destinationImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
  },
  selectedDestination: {
    opacity: 0.7,
  },
  destinationLabel: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default ChoosePlaces;
