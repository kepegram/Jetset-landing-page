import { View, Text, Modal, Pressable, Button } from "react-native";
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
        geoCoordinates: {
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
      : undefined;

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

      <View
        style={{ marginTop: 10, alignItems: "flex-start", marginLeft: -10 }}
      >
        <Button
          title="Show Itinerary on Map"
          onPress={toggleMapModal}
          color={currentTheme.alternate}
        />
      </View>

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
        <Button
          title="Close Map"
          onPress={toggleMapModal}
          color={currentTheme.alternate}
        />
      </Modal>
    </View>
  );
};

export default PlannedTrip;
