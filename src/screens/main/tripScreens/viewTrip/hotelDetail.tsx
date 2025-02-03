import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Linking,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../../../../context/themeContext";
import { RootStackParamList } from "../../../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { BlurView } from "expo-blur";
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
  const scrollY = useRef(new Animated.Value(0)).current;
  const { hotel } = route.params;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, height * 0.2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolateLeft: "extend",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerBackground: () => (
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: headerOpacity,
              backgroundColor: currentTheme.background,
            },
          ]}
        />
      ),
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BlurView intensity={80} style={styles.blurButton}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentTheme.textPrimary}
            />
          </BlurView>
        </Pressable>
      ),
    });
  }, [navigation, currentTheme.background]);

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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ scale: imageScale }] },
          ]}
        >
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
          <BlurView intensity={60} style={styles.imageOverlay}>
            <Text style={styles.overlayTitle}>{hotel.hotelName}</Text>
          </BlurView>
        </Animated.View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: currentTheme.background },
          ]}
        >
          <View style={styles.detailsContainer}>
            <View style={styles.hotelContainer}>
              <View
                style={[
                  styles.ratingBox,
                  { backgroundColor: `${currentTheme.alternate}20` },
                ]}
              >
                <Text
                  style={[styles.ratingText, { color: currentTheme.alternate }]}
                >
                  {hotel.rating} ⭐
                </Text>
              </View>
              <Text
                style={[styles.priceText, { color: currentTheme.textPrimary }]}
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

      <BlurView intensity={90} style={styles.bottomBar}>
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
      </BlurView>
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
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  backButton: {
    marginLeft: 16,
  },
  blurButton: {
    padding: 12,
    borderRadius: 25,
    overflow: "hidden",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingBox: {
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
    borderTopColor: "rgba(255,255,255,0.1)",
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
