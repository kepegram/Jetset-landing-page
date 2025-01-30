import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { useTheme } from "../../../context/themeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { CreateTripContext } from "../../../context/createTripContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";

const { height } = Dimensions.get("window");

type RouteParams = {
  destination: {
    name: string;
    description: string;
    image: number;
    bestTimeToVisit: string;
  };
};

type PopularDestinationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PopularDestinations"
>;

const PopularDestinations: React.FC = () => {
  const { currentTheme } = useTheme();
  const route = useRoute();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const { destination } = route.params as RouteParams;
  const navigation = useNavigation<PopularDestinationsScreenNavigationProp>();

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
          <Ionicons name="chevron-back" size={28} color="white" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.imageContainer}>
        <Image
          source={destination.image}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BlurView
          intensity={90}
          style={[
            styles.contentContainer,
            { backgroundColor: `${currentTheme.background}CC` },
          ]}
        >
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.destinationTitle,
                  { color: currentTheme.textPrimary },
                ]}
              >
                {destination.name}
              </Text>
            </View>
          </View>

          <View style={styles.tripMetaContainer}>
            <View
              style={[
                styles.tripMetaItem,
                { backgroundColor: `${currentTheme.alternate}10` },
              ]}
            >
              <View style={styles.tripMetaIconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={currentTheme.alternate}
                />
              </View>
              <View style={styles.tripMetaTextContainer}>
                <Text
                  style={[
                    styles.tripMetaLabel,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  Best Time to Visit
                </Text>
                <Text
                  style={[
                    styles.tripMetaText,
                    { color: currentTheme.textPrimary },
                  ]}
                >
                  {destination.bestTimeToVisit}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.descriptionContainer,
              { backgroundColor: `${currentTheme.accentBackground}80` },
            ]}
          >
            <Text
              style={[
                styles.descriptionTitle,
                { color: currentTheme.textPrimary },
              ]}
            >
              About
            </Text>
            <Text
              style={[styles.description, { color: currentTheme.textPrimary }]}
            >
              {destination.description}
            </Text>
          </View>

          <Pressable
            style={[
              styles.exploreButton,
              { backgroundColor: currentTheme.alternate },
            ]}
            onPress={() => {
              /* Handle explore press */
            }}
          >
            <Text style={styles.exploreButtonText}>Start Planning!</Text>
          </Pressable>
        </BlurView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  backButton: {
    marginLeft: 16,
    padding: 12,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scrollContent: {
    paddingBottom: 100,
    marginTop: height * 0.45,
  },
  contentContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerContainer: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  destinationTitle: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    letterSpacing: 0.5,
  },
  tripMetaContainer: {
    marginBottom: 25,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  tripMetaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tripMetaTextContainer: {
    flex: 1,
  },
  tripMetaLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "outfit-medium",
  },
  tripMetaText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
  descriptionContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  exploreButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});

export default PopularDestinations;
