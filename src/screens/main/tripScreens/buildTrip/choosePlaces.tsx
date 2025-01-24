import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/themeContext";
import { MainButton } from "../../../../components/ui/button";
import { CreateTripContext } from "../../../../context/createTripContext";

type ChoosePlacesNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChoosePlaces"
>;

const ChoosePlaces: React.FC = () => {
  const navigation = useNavigation<ChoosePlacesNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

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

  const handleContinue = () => {
    if (selectedDestination) {
      const selectedPlace = destinations.find(
        (dest) => dest.id === selectedDestination
      );
      const updatedTripData = {
        ...tripData,
        destinationType: selectedPlace?.label,
      };
      setTripData(updatedTripData);
      console.log("Updated Trip Data:", updatedTripData);
      navigation.navigate("ChooseDate");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
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

      <View style={styles.buttonContainer}>
        <MainButton
          onPress={handleContinue}
          buttonText="Continue"
          width={"70%"}
          disabled={!selectedDestination}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 100,
    alignItems: "flex-start",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
  destinationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 30,
    gap: 20,
  },
  destinationButton: {
    alignItems: "center",
    width: 150,
  },
  destinationImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  selectedDestination: {
    opacity: 0.7,
  },
  destinationLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});

export default ChoosePlaces;
