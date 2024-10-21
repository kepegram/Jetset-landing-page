import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Modal,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { useTheme } from "../profileScreen/themeContext";
import { FIREBASE_DB } from "../../../../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "../tabNavigator/appNav";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 40;
const ITEM_SPACING = 20;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING;

type DestinationDetailViewProps = {
  navigation: StackNavigationProp<RootStackParamList, "DestinationDetailView">;
  route: RouteProp<RootStackParamList, "DestinationDetailView">;
};

const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { item } = route.params ?? {};
  const image = item?.image || "https://via.placeholder.com/400";
  const country = item?.location || "Unknown location";
  const city = item?.address || "No address available";
  const population = item?.population || "N/A";
  const continent = item?.continent || "N/A";
  const longitude = item?.longitude;
  const latitude = item?.latitude;

  const currentStyles = theme === "dark" ? darkStyles : styles;

  // Function to fetch images from Pexels API
  const fetchPexelsImages = async (query: string) => {
    const PEXELS_API_KEY =
      "VpRUFZAwfA3HA4cwIoYVnHO51Lr36RauMaODMYPSTJpPGbRkmtFLa7pX";
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=3`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        return data.photos.map((photo: any) => photo.src.medium);
      }

      return [];
    } catch (error) {
      console.error("Error fetching images from Pexels: ", error);
      return [];
    }
  };

  useEffect(() => {
    // Fetch additional images when component mounts
    const fetchImages = async () => {
      const countryImages = await fetchPexelsImages(item.location);
      const cityImages = await fetchPexelsImages(item.address);

      setExtraImages([...countryImages, ...cityImages]);
    };

    if (item.location && item.address) {
      fetchImages();
    }
  }, [item]);

  const addToBucketlist = async (item) => {
    try {
      await addDoc(collection(FIREBASE_DB, "bucketlist"), {
        location: item.location,
        address: item.address,
        image: item.image,
        timestamp: new Date(),
      });

      Alert.alert("Bucketlist", `${item.location} added to bucket list.`, [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Error",
        "There was a problem adding the trip to your bucketlist."
      );
    }
  };

  return (
    <View style={currentStyles.container}>
      {/* Scroll Hint */}
      <View style={currentStyles.scrollHint}>
        <Text style={currentStyles.scrollHintText}>Swipe to explore</Text>
        <Ionicons
          name="arrow-forward"
          size={24}
          color={theme === "dark" ? "#ccc" : "#888"}
        />
      </View>

      <ScrollView contentContainerStyle={currentStyles.scrollContent}>
        <ScrollView
          horizontal
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          style={currentStyles.horizontalScroll}
          contentContainerStyle={currentStyles.horizontalScrollContent}
        >
          {longitude && latitude && (
            <View
              style={[currentStyles.scrollItem, currentStyles.mapContainer]}
            >
              <MapView
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={currentStyles.map}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker coordinate={{ latitude, longitude }} title={city} />
              </MapView>
            </View>
          )}

          <Pressable
            onPress={() => {
              setSelectedImage(image);
              setModalVisible(true);
            }}
            style={currentStyles.scrollItem}
          >
            <Image source={{ uri: image }} style={currentStyles.image} />
          </Pressable>

          {extraImages.map((extraImage, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setSelectedImage(extraImage);
                setModalVisible(true);
              }}
              style={currentStyles.scrollItem}
            >
              <Image source={{ uri: extraImage }} style={currentStyles.image} />
            </Pressable>
          ))}
        </ScrollView>

        <View style={currentStyles.details}>
          <Text style={currentStyles.city}>{city}</Text>
          <Text style={currentStyles.country}>{country}</Text>
          <Text style={currentStyles.infoText}>Population: {population}</Text>
          <Text style={currentStyles.infoText}>Continent: {continent}</Text>
        </View>

        <Pressable
          style={currentStyles.addButton}
          onPress={() => addToBucketlist(item)}
        >
          <Text style={currentStyles.addButtonText}>Add to Bucket List</Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={currentStyles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={currentStyles.modalImage}
            />
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

export default DestinationDetailView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollHint: {
    position: "absolute",
    top: 10,
    left: width / 2 - 50,
    alignItems: "center",
    zIndex: 1,
  },
  scrollHintText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: "#888",
  },
  scrollContent: {
    alignItems: "center",
    marginTop: 20,
  },
  horizontalScroll: {
    height: 350,
  },
  horizontalScrollContent: {
    paddingHorizontal: 10, // Add horizontal padding to the content
  },
  scrollItem: {
    width: width - 40, // Reduce width to account for padding
    height: 350,
    marginHorizontal: 10,
  },
  mapContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10, // Add border radius for consistency with images
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10, // Add border radius to images
  },
  details: {
    padding: 20,
    alignItems: "center",
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  country: {
    fontSize: 16,
    color: "#777",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#A463FF",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollHint: {
    position: "absolute",
    top: 10,
    left: width / 2 - 50,
    alignItems: "center",
    zIndex: 1,
  },
  scrollHintText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 5,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: "#ccc",
  },
  scrollContent: {
    alignItems: "center",
    marginTop: 70,
  },
  horizontalScroll: {
    height: 350,
  },
  horizontalScrollContent: {
    paddingHorizontal: 10, // Add horizontal padding to the content
  },
  scrollItem: {
    width: width - 40, // Reduce width to account for padding
    height: 350,
    marginHorizontal: 10,
  },
  mapContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10, // Add border radius for consistency with images
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10, // Add border radius to images
  },
  details: {
    padding: 20,
    alignItems: "center",
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  country: {
    fontSize: 16,
    color: "#777",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#A463FF",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
