import { View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "../../../context/themeContext";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";

const Map: React.FC = () => {
  const { currentTheme } = useTheme();
  const [geoCoordinates, setGeoCoordinates] = useState<
    Array<{ latitude: number; longitude: number; destinationName: string }>
  >([]);

  useEffect(() => {
    const fetchGeoCoordinates = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const querySnapshot = await getDocs(
            collection(FIREBASE_DB, `users/${user.uid}/userTrips`)
          );
          const coordinates = querySnapshot.docs
            .map((doc) => {
              const data = doc.data();
              const coord = data.tripData?.locationInfo?.coordinates;
              const destinationName =
                data.tripData?.locationInfo?.name || "Unknown Destination";
              if (coord && coord.lat !== undefined && coord.lng !== undefined) {
                return {
                  latitude: coord.lat,
                  longitude: coord.lng,
                  destinationName,
                };
              }
              return null;
            })
            .filter((coord) => coord !== null);
          console.log("Fetched geoCoordinates:", coordinates); // Log the fetched geo coordinates
          setGeoCoordinates(coordinates);
        }
      } catch (error) {
        console.error("Failed to fetch geoCoordinates:", error);
      }
    };

    fetchGeoCoordinates();
  }, []);

  const calculateRegion = () => {
    if (geoCoordinates.length === 0) {
      return {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const latitudes = geoCoordinates.map((coord) => coord.latitude);
    const longitudes = geoCoordinates.map((coord) => coord.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: maxLat - minLat + 0.1,
      longitudeDelta: maxLng - minLng + 0.1,
    };
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: currentTheme.background,
      }}
    >
      <MapView
        style={{ width: "100%", height: "100%" }}
        region={calculateRegion()}
      >
        {geoCoordinates.map((coordinate, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}
            title={coordinate.destinationName}
          />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
