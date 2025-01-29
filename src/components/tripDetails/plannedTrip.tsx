import { View, Text, Modal, Pressable, Button, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";
import React, { useState } from "react";
import PlaceCard from "./placeCard";
import MapView, { Marker } from "react-native-maps";

// Define an interface for the details prop
interface PlannedTripProps {
  details: {
    itinerary: {
      day: string;
      places: {
        placeName: string;
        placeDetails: string;
        timeToTravel: string;
        geoCoordinates?: {
          latitude: number;
          longitude: number;
        };
        placeExtendedDetails: string;
        placeUrl: string;
      }[];
    }[];
    budget: string;
    destination: string;
  } | null;
}

const PlannedTrip: React.FC<PlannedTripProps> = ({ details }) => {
  const { currentTheme } = useTheme();
  const [isMapVisible, setMapVisible] = useState(false);

  if (!details || typeof details !== "object") {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: currentTheme.error }]}>
          No Plan Details Available
        </Text>
      </View>
    );
  }

  const toggleMapModal = () => {
    setMapVisible(!isMapVisible);
  };

  // Calculate the initial region for the map with fallback coordinates
  const defaultLocation = {
    latitude: 37.7749, // San Francisco as default
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const initialRegion =
    details.itinerary.length > 0 &&
    details.itinerary[0].places.length > 0 &&
    details.itinerary[0].places[0].geoCoordinates
      ? {
          latitude: details.itinerary[0].places[0].geoCoordinates.latitude,
          longitude: details.itinerary[0].places[0].geoCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      : defaultLocation;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
        🏕️ Suggested Itinerary
      </Text>

      {details.itinerary.map(({ day, places }) => (
        <View key={day}>
          <Text style={[styles.dayText, { color: currentTheme.textPrimary }]}>
            {day}
          </Text>
          {Array.isArray(places) && places.length > 0 ? (
            places.map((place, index) => (
              <Pressable key={index} onPress={() => console.log(place)}>
                <PlaceCard
                  place={{
                    ...place,
                    placeDetails: place.placeDetails,
                    placeExtendedDetails: place.placeExtendedDetails,
                    placeUrl: place.placeUrl,
                  }}
                />
              </Pressable>
            ))
          ) : (
            <Text style={[styles.errorText, { color: currentTheme.error }]}>
              No places planned for this day.
            </Text>
          )}
        </View>
      ))}

      <View style={styles.infoContainer}>
        <Text style={{ color: currentTheme.textPrimary }}>
          Budget: {details.budget}
        </Text>
        <Text style={{ color: currentTheme.textPrimary }}>
          Destination: {details.destination}
        </Text>
      </View>

      <View style={styles.mapButtonContainer}>
        <Button
          title="Show Itinerary on Map"
          onPress={toggleMapModal}
          color={currentTheme.alternate}
        />
      </View>

      <Modal visible={isMapVisible} onRequestClose={toggleMapModal}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {details.itinerary.map(({ places }) =>
            places.map((place, index) => {
              if (
                !place.geoCoordinates?.latitude ||
                !place.geoCoordinates?.longitude
              ) {
                return null;
              }
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: place.geoCoordinates.latitude,
                    longitude: place.geoCoordinates.longitude,
                  }}
                  title={place.placeName}
                />
              );
            })
          )}
        </MapView>
        <View style={styles.closeButtonContainer}>
          <Button
            title="Close Map"
            onPress={toggleMapModal}
            color={currentTheme.alternate}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "outfit-bold",
  },
  dayText: {
    fontFamily: "outfit-medium",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "outfit",
    marginBottom: 10,
  },
  infoContainer: {
    marginTop: 15,
    gap: 5,
  },
  mapButtonContainer: {
    marginTop: 10,
    alignItems: "flex-start",
    marginLeft: -10,
  },
  map: {
    flex: 1,
  },
  closeButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default PlannedTrip;
