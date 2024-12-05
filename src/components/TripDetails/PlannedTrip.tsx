import { View, Text, Modal } from "react-native";
import { useTheme } from "../../context/themeContext";
import React, { useState } from "react";
import PlaceCard from "./placeCard";
import MapView, { Marker } from "react-native-maps";
import { MainButton } from "../ui/button";

// Define an interface for the details prop
interface PlannedTripProps {
  details: {
    itinerary: {
      day: string;
      places: {
        placeName: string;
        placeDetails: string;
        ticketPrice: string;
        timeToTravel: string;
        geoCoordinates: {
          latitude: number;
          longitude: number;
        };
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
      <View>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "outfit",
            color: "red",
          }}
        >
          No Plan Details Available
        </Text>
      </View>
    );
  }

  const toggleMapModal = () => {
    setMapVisible(!isMapVisible);
  };

  // Calculate the initial region for the map
  const initialRegion =
    details.itinerary.length > 0 && details.itinerary[0].places.length > 0
      ? {
          latitude: details.itinerary[0].places[0].geoCoordinates.latitude,
          longitude: details.itinerary[0].places[0].geoCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      : null;

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginBottom: 10,
          fontFamily: "outfit-bold",
          color: currentTheme.textPrimary,
        }}
      >
        🏕️ Suggested Itinerary
      </Text>

      {details.itinerary.map(({ day, places }) => (
        <View key={day}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 17,
              marginTop: 10,
              marginBottom: 10,
              color: currentTheme.textPrimary,
            }}
          >
            {day}
          </Text>
          {Array.isArray(places) && places.length > 0 ? (
            places.map((place, index) => (
              <PlaceCard
                key={index}
                place={{
                  ...place,
                  placeDetails: place.placeDetails,
                  ticketPrice: place.ticketPrice,
                }}
              />
            ))
          ) : (
            <Text style={{ color: "red" }}>
              No places planned for this day.
            </Text>
          )}
        </View>
      ))}

      <Text style={{ color: currentTheme.textPrimary }}>
        Budget: {details.budget}
      </Text>
      <Text style={{ color: currentTheme.textPrimary }}>
        Destination: {details.destination}
      </Text>

      <MainButton
        buttonText="Show Itinerary on Map"
        width="100%"
        onPress={toggleMapModal}
        style={{ marginTop: 20 }}
      />

      <Modal visible={isMapVisible} onRequestClose={toggleMapModal}>
        <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
          {details.itinerary.map(({ places }) =>
            places.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.geoCoordinates.latitude,
                  longitude: place.geoCoordinates.longitude,
                }}
                title={place.placeName}
              />
            ))
          )}
        </MapView>
        <MainButton
          buttonText="Close Map"
          width="auto"
          onPress={toggleMapModal}
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            backgroundColor: currentTheme.alternate,
            padding: 10,
            borderRadius: 5,
          }}
        />
      </Modal>
    </View>
  );
};

export default PlannedTrip;
