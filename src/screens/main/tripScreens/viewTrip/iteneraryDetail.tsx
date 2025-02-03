import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  StatusBar,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../../../../context/themeContext";
import { RootStackParamList } from "../../../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "IteneraryDetail"
>;

type RouteProps = RouteProp<RootStackParamList, "IteneraryDetail">;

const IteneraryDetail: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { place } = route.params;

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

  const handleOpenUrl = async () => {
    if (place.placeUrl) {
      await Linking.openURL(place.placeUrl);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
            source={
              place.photoRef
                ? {
                    uri:
                      "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=" +
                      place.photoRef +
                      "&key=" +
                      process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
                  }
                : require("../../../../assets/app-imgs/place-placeholder.jpg")
            }
            style={styles.image}
          />
          <BlurView intensity={60} style={styles.imageOverlay}>
            <Text style={styles.overlayTitle}>{place.placeName}</Text>
          </BlurView>
        </Animated.View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: currentTheme.background },
          ]}
        >
          <View style={styles.detailsContainer}>
            <View
              style={[
                styles.infoBox,
                { backgroundColor: `${currentTheme.alternate}15` },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={24}
                color={currentTheme.alternate}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {place.timeToTravel}
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                About this place
              </Text>
              <Text
                style={[
                  styles.detailText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {place.placeDetails}
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                More Information
              </Text>
              <Text
                style={[
                  styles.detailText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {place.placeExtendedDetails}
              </Text>
            </View>

            {place.geoCoordinates && (
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
                      latitude: place.geoCoordinates.latitude,
                      longitude: place.geoCoordinates.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: place.geoCoordinates.latitude,
                        longitude: place.geoCoordinates.longitude,
                      }}
                      title={place.placeName}
                    />
                  </MapView>
                </View>
              </View>
            )}

            {place.placeUrl && (
              <Pressable
                style={[
                  styles.linkButton,
                  { backgroundColor: currentTheme.alternate },
                ]}
                onPress={handleOpenUrl}
              >
                <Ionicons name="map-outline" size={24} color="white" />
                <Text style={styles.linkButtonText}>View on Google Maps</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
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
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
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
  linkButton: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  linkButtonText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "white",
  },
});

export default IteneraryDetail;
