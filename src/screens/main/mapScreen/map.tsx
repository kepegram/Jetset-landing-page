import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState, useCallback, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "../../../context/themeContext";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { useFocusEffect } from "@react-navigation/native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import StartNewTripCard from "../../../components/myTrips/startNewTripCard";

const Map: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentTheme } = useTheme();
  const [geoCoordinates, setGeoCoordinates] = useState<
    Array<{ latitude: number; longitude: number; destinationName: string }>
  >([]);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<
    number | null
  >(null);
  const mapRef = useRef<MapView>(null);

  const fetchGeoCoordinates = useCallback(async () => {
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
        console.log("Fetched geoCoordinates:", coordinates);
        setGeoCoordinates(coordinates);
        if (coordinates.length > 0) {
          setSelectedLocationIndex(0);
        }
      }
    } catch (error) {
      console.error("Failed to fetch geoCoordinates:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGeoCoordinates();
    }, [fetchGeoCoordinates])
  );

  const calculateRegion = () => {
    if (geoCoordinates.length === 0) {
      return {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const firstTrip = geoCoordinates[0];
    return {
      latitude: firstTrip.latitude,
      longitude: firstTrip.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  const calculateBoundingRegion = () => {
    if (geoCoordinates.length === 0) {
      return calculateRegion();
    }

    const latitudes = geoCoordinates.map((coord) => coord.latitude);
    const longitudes = geoCoordinates.map((coord) => coord.longitude);

    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    return {
      latitude: (minLatitude + maxLatitude) / 2,
      longitude: (minLongitude + maxLongitude) / 2,
      latitudeDelta: maxLatitude - minLatitude + 0.1,
      longitudeDelta: maxLongitude - minLongitude + 0.1,
    };
  };

  const navigateToMarker = (
    latitude: number,
    longitude: number,
    index: number
  ) => {
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
    setSelectedLocationIndex(index);
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<{
    latitude: number;
    longitude: number;
    destinationName: string;
  }>) => {
    const index = geoCoordinates.findIndex((coord) => coord === item);
    return (
      <Pressable
        style={[
          styles.tripItem,
          index === selectedLocationIndex && styles.selectedTripItem,
          isActive && styles.activeItem,
        ]}
        onPress={() => navigateToMarker(item.latitude, item.longitude, index)}
      >
        <Text style={{ color: currentTheme.textPrimary }}>
          {item.destinationName}
        </Text>
        <Pressable onLongPress={drag} style={styles.dragIconContainer}>
          <Ionicons
            name="reorder-three-outline"
            size={24}
            color={currentTheme.textPrimary}
            style={styles.dragIcon}
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentTheme.background,
      }}
    >
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "80%" }}
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
      {geoCoordinates.length === 0 && (
        <View style={styles.overlay}>
          <StartNewTripCard
            navigation={navigation}
            textColor="white"
            subTextColor="white"
          />
        </View>
      )}
      {geoCoordinates.length > 0 && (
        <Pressable
          style={[
            styles.seeAllButton,
            { backgroundColor: currentTheme.alternate },
          ]}
          onPress={() =>
            mapRef.current?.animateToRegion(calculateBoundingRegion())
          }
        >
          <Text style={{ color: "white" }}>See All</Text>
        </Pressable>
      )}
      <DraggableFlatList
        data={geoCoordinates}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onDragEnd={({ data }) => setGeoCoordinates(data)}
        style={{ width: "100%", height: "20%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  tripItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedTripItem: {
    backgroundColor: "#e0e0e0",
  },
  activeItem: {
    backgroundColor: "#d0d0d0",
  },
  dragIconContainer: {
    padding: 5,
  },
  dragIcon: {
    marginLeft: 10,
  },
  seeAllButton: {
    position: "absolute",
    top: 50,
    right: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
});

export default Map;
