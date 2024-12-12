import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "../../../context/themeContext";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";

const Map: React.FC = () => {
  const { currentTheme } = useTheme();
  const [geoCoordinates, setGeoCoordinates] = useState<Array<{ latitude: number, longitude: number }>>([]);

  useEffect(() => {
    const fetchGeoCoordinates = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const querySnapshot = await getDocs(collection(FIREBASE_DB, `users/${user.uid}/userTrips`));
          const coordinates = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return data.tripData?.locationInfo?.coordinates;
          }).filter(coord => coord);
          console.log("Fetched geoCoordinates:", coordinates); // Log the fetched geo coordinates
          setGeoCoordinates(coordinates);
        }
      } catch (error) {
        console.error("Failed to fetch geoCoordinates:", error);
      }
    };

    fetchGeoCoordinates();
  }, []);

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
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {geoCoordinates.map((coordinate, index) => (
          <Marker
            key={index}
            coordinate={coordinate}
            title={`Trip ${index + 1}`}
          />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
