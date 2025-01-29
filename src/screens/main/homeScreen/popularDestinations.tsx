import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "../../../context/themeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

type RouteParams = {
  destination: {
    name: string;
    description: string;
    image: number;
  };
};

const PopularDestinations: React.FC = () => {
  const { currentTheme } = useTheme();
  const route = useRoute();
  const { destination } = route.params as RouteParams;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
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
                { backgroundColor: `${currentTheme.alternate}20` },
              ]}
            >
              <Ionicons name="star" size={22} color={currentTheme.alternate} />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                4.8
              </Text>
            </View>
            <View
              style={[
                styles.tripMetaItem,
                { backgroundColor: `${currentTheme.alternate}20` },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={22}
                color={currentTheme.alternate}
              />
              <Text
                style={[
                  styles.tripMetaText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Best time to visit
              </Text>
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

          <TouchableOpacity
            style={[
              styles.exploreButton,
              { backgroundColor: currentTheme.alternate },
            ]}
            onPress={() => {
              /* Handle explore press */
            }}
          >
            <Text style={styles.exploreButtonText}>Explore More</Text>
          </TouchableOpacity>
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
    flexDirection: "row",
    marginBottom: 25,
    gap: 15,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tripMetaText: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    marginLeft: 8,
  },
  descriptionContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "outfit",
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
