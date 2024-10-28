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
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { item } = route.params ?? {};
  const image = item?.image || "https://via.placeholder.com/400";
  const country = item?.country || "Unknown country";
  const city = item?.city || "No city available";
  const population = item?.population || "N/A";
  const continent = item?.continent || "N/A";
  const longitude = item?.longitude;
  const latitude = item?.latitude;

  const currentStyles = theme === "dark" ? darkStyles : styles;

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
      setExtraImages([...countryImages, ...cityImages]);
    };

    if (item.country && item.city) {
      fetchImages();
    }
  }, [item]);

  const addToBucketlist = async (item) => {
    try {
      await addDoc(collection(FIREBASE_DB, "bucketlist"), {
        country: item.country,
        city: item.city,
        image: item.image,
        timestamp: new Date(),
      });

      Alert.alert("Bucketlist", `${item.country} added to bucket list.`, [
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

  // Function to render dot indicators
  const renderDotIndicators = () => {
    const totalImages = extraImages.length + 1;
    return (
      <View style={currentStyles.dotsContainer}>
        {Array.from({ length: totalImages }, (_, index) => (
          <View
            key={index}
            style={[
              currentStyles.dot,
              currentIndex === index ? currentStyles.activeDot : {},
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={currentStyles.container}>
      <ScrollView contentContainerStyle={currentStyles.scrollContent}>
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
                zoomEnabled={true}
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

        {/* Render dot indicators */}
        {renderDotIndicators()}

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
  scrollContent: {
    alignItems: "center",
    marginTop: 70,
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
    backgroundColor: "#A463FF",
  },
  addButton: {
    backgroundColor: "#A463FF",
    borderRadius: 35,
    height: 60,
    width: "90%",
    alignItems: "center",
    top: "5%",
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
  scrollContent: {
    alignItems: "center",
    marginTop: 70,
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
    backgroundColor: "#A463FF",
  },
  addButton: {
    backgroundColor: "#A463FF",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    alignItems: "center",
    top: "8%",
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
