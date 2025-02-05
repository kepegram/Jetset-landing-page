import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Linking,
} from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "../../../../context/themeContext";
import { RootStackParamList } from "../../../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { MainButton } from "../../../../components/ui/button";

const { width, height } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HotelDetail"
>;
type RouteProps = RouteProp<RootStackParamList, "HotelDetail">;

const HotelDetail: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { hotel } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={"white"} />
        </Pressable>
      ),
    });
  }, [navigation, currentTheme]);

  const handleBooking = async () => {
    if (hotel.bookingUrl) {
      const canOpen = await Linking.canOpenURL(hotel.bookingUrl);
      if (canOpen) {
        await Linking.openURL(hotel.bookingUrl);
      }
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: hotel.photoRef
                ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=" +
                  hotel.photoRef +
                  "&key=" +
                  process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY
                : require("../../../../assets/app-imgs/place-placeholder.jpg"),
            }}
            style={styles.image}
          />
          <View
            style={[
              styles.imageOverlay,
              { backgroundColor: "rgba(0, 0, 0, 0.4)" },
            ]}
          >
            <Text style={styles.overlayTitle}>{hotel.hotelName}</Text>
          </View>
        </View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: currentTheme.background },
          ]}
        >
          <View style={styles.detailsContainer}>
            <View style={styles.hotelContainer}>
              <View style={styles.ratingPriceContainer}>
                <View
                  style={[
                    styles.ratingBox,
                    { backgroundColor: `${currentTheme.alternate}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.ratingText,
                      { color: currentTheme.alternate },
                    ]}
                  >
                    {hotel.rating} ⭐
                  </Text>
                </View>
                <Text
                  style={[
                    styles.priceText,
                    { color: currentTheme.textPrimary },
                  ]}
                >
                  ${hotel.price}
                  <Text
                    style={[
                      styles.perNight,
                      { color: currentTheme.textSecondary },
                    ]}
                  >
                    /night
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Description
              </Text>
              <Text
                style={[
                  styles.detailText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {hotel.description}
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Location
              </Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: hotel.geoCoordinates.latitude,
                    longitude: hotel.geoCoordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: hotel.geoCoordinates.latitude,
                      longitude: hotel.geoCoordinates.longitude,
                    }}
                    title={hotel.hotelName}
                  />
                </MapView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.bottomBar, { backgroundColor: currentTheme.background }]}
      >
        <View style={styles.priceContainer}>
          <Text style={[styles.hotelName, { color: currentTheme.textPrimary }]}>
            {hotel.hotelName} 🏨
          </Text>
          <Text style={[styles.price, { color: currentTheme.alternate }]}>
            ${hotel.price}
            <Text
              style={[styles.perNight, { color: currentTheme.textSecondary }]}
            >
              /night
            </Text>
          </Text>
        </View>
        <MainButton
          onPress={handleBooking}
          buttonText={hotel.bookingUrl ? "Book Now" : "Unavailable"}
          width={width * 0.45}
          style={[
            styles.bookButton,
            { backgroundColor: currentTheme.alternate },
            !hotel.bookingUrl && { opacity: 0.5 },
          ]}
          disabled={!hotel.bookingUrl}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    height: height * 0.5,
    width: width,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  overlayTitle: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    minHeight: height * 0.6,
  },
  detailsContainer: {
    padding: 20,
    gap: 24,
  },
  hotelContainer: {
    marginBottom: 20,
  },
  ratingPriceContainer: {
    gap: 12,
  },
  ratingBox: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 18,
    fontFamily: "outfit-medium",
  },
  priceText: {
    fontSize: 24,
    fontFamily: "outfit-bold",
  },
  perNight: {
    fontSize: 16,
    fontFamily: "outfit",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "outfit-bold",
  },
  detailText: {
    fontSize: 16,
    fontFamily: "outfit",
    lineHeight: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  priceContainer: {
    flex: 1,
  },
  hotelName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginBottom: 4,
  },
  price: {
    fontFamily: "outfit-bold",
    fontSize: 24,
  },
  bookButton: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    borderRadius: 15,
  },
});

export default HotelDetail;
