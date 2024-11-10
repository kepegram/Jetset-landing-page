import React, { useState, useEffect, useRef } from "react";
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
import { useTheme } from "../../../context/themeContext";
import { FIREBASE_DB } from "../../../../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "../../../navigation/appNav";

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
  const { currentTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { item } = route.params ?? {};
  const [image, setImage] = useState<string | null>(item?.image || null);
  const stateOrCountry = item?.state || item?.country || "Unknown location";
  const city = item?.city || "No city available";
  const population = item?.population || "N/A";
  const longitude = item?.longitude;
  const latitude = item?.latitude;

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
    const fetchImages = async () => {
      const countryImages = await fetchPexelsImages(item.country);
      const cityImages = await fetchPexelsImages(item.city);

      // Skip the first image in each set
      const additionalCountryImages = countryImages.slice(1);
      const additionalCityImages = cityImages.slice(1);

      // Merge the additional images and use a Set to filter out duplicates
      const allAdditionalImages = [
        ...additionalCountryImages,
        ...additionalCityImages,
      ];
      const uniqueImages = Array.from(new Set(allAdditionalImages));

      // Limit the number of images to 4
      const limitedImages = uniqueImages.slice(0, 4);

      setExtraImages(limitedImages);

      // Set item.image if it's not already set
      if (!item.image && limitedImages.length > 0) {
        setImage(limitedImages[0]); // Set the first image from the fetched images as default
      }
    };

    if (item.country && item.city) {
      fetchImages();
    }
  }, [item]);

  const addToPlanner = async (item) => {
    try {
      // Check if the image field is undefined
      if (!item.image) {
        throw new Error("Image is undefined");
      }

      await addDoc(collection(FIREBASE_DB, "bucketlist"), {
        country: item.country,
        city: item.city,
        image: item.image,
        timestamp: new Date(),
      });

      Alert.alert("Planner", `${item.country} added to planner.`, [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Error",
        "There was a problem adding the trip to your planner. " + error.message
      );
    }
  };

  const renderDotIndicators = () => {
    const totalItems = 1 + extraImages.length;
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalItems }, (_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index ? styles.activeDot : {}]}
          />
        ))}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const newIndex = Math.round(contentOffsetX / SNAP_INTERVAL);
            setCurrentIndex(newIndex);
          }}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {longitude && latitude && (
            <View style={[styles.scrollItem, styles.mapContainer]}>
              <MapView
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.map}
                scrollEnabled={false}
                zoomEnabled={true}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker coordinate={{ latitude, longitude }} title={city} />
              </MapView>
            </View>
          )}

          {image && (
            <Pressable
              onPress={() => {
                setSelectedImage(image);
                setModalVisible(true);
              }}
              style={styles.scrollItem}
            >
              <Image source={{ uri: image }} style={styles.image} />
            </Pressable>
          )}

          {extraImages.map((extraImage, index) =>
            extraImage ? (
              <Pressable
                key={index}
                onPress={() => {
                  setSelectedImage(extraImage);
                  setModalVisible(true);
                }}
                style={styles.scrollItem}
              >
                <Image source={{ uri: extraImage }} style={styles.image} />
              </Pressable>
            ) : null
          )}
        </ScrollView>

        {/* Render dot indicators */}
        {renderDotIndicators()}

        <View style={styles.details}>
          <Text style={[styles.city, { color: currentTheme.textPrimary }]}>
            {city}
          </Text>
          <Text style={[styles.country, { color: currentTheme.textSecondary }]}>
            {stateOrCountry}
          </Text>
          <Text
            style={[styles.infoText, { color: currentTheme.textSecondary }]}
          >
            Population: {population}
          </Text>
        </View>

        <Pressable
          style={[styles.addButton, { backgroundColor: currentTheme.primary }]}
          onPress={() => addToPlanner(item)}
        >
          <Text
            style={[styles.addButtonText, { color: currentTheme.buttonText }]}
          >
            Add to Planner
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            { backgroundColor: currentTheme.background },
          ]}
          onPress={() => setModalVisible(false)}
        >
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
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
  },
  scrollContent: {
    alignItems: "center",
    marginTop: 20,
  },
  horizontalScroll: {
    height: 350,
  },
  horizontalScrollContent: {
    paddingHorizontal: 10,
  },
  scrollItem: {
    width: width - 40,
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
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  details: {
    padding: 20,
    alignItems: "center",
    marginTop: 30,
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  country: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: "#ffc071",
  },
  addButton: {
    borderRadius: 35,
    padding: 15,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
