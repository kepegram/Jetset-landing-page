import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../context/themeContext";
import * as Haptics from "expo-haptics";

type CarouselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Carousel"
>;

const Carousel: React.FC = () => {
  const navigation = useNavigation<CarouselScreenNavigationProp>();
  const { currentTheme } = useTheme();

  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      activeDotColor={currentTheme.alternate}
      dotColor={currentTheme.inactive}
    >
      <View
        style={[styles.slide, { backgroundColor: currentTheme.background }]}
      >
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Create your dream travel list
        </Text>
        <Text style={[styles.paragraph, { color: currentTheme.textSecondary }]}>
          Curate your own personalized travel bucket list
        </Text>
      </View>

      <View
        style={[styles.slide, { backgroundColor: currentTheme.background }]}
      >
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Plan trips and explore destinations
        </Text>
        <Text style={[styles.paragraph, { color: currentTheme.textSecondary }]}>
          Simple tools and a powerful interface to help you plan your dream
          trip.
        </Text>
      </View>

      <View
        style={[styles.slide, { backgroundColor: currentTheme.background }]}
      >
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Capture Memories
        </Text>
        <Text style={[styles.paragraph, { color: currentTheme.textSecondary }]}>
          Upload and share your photos
        </Text>
      </View>

      <View
        style={[styles.slide, { backgroundColor: currentTheme.background }]}
      >
        <Text
          style={[styles.specialTitle, { color: currentTheme.textPrimary }]}
        >
          Become{" "}
          <Text style={{ fontSize: 50, color: currentTheme.alternate }}>
            Jetset
          </Text>{" "}
          Today
        </Text>
        <Text
          style={[
            styles.specialParagraph,
            { color: currentTheme.textSecondary },
          ]}
        >
          Join our community to start planning your travel list and explore the
          world
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.authButton,
              { backgroundColor: currentTheme.primary },
            ]}
            onPress={() => {
              navigation.navigate("SignUp");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Text
              style={[styles.buttonText, { color: currentTheme.buttonText }]}
            >
              Get Started
            </Text>
          </Pressable>
        </View>
      </View>
    </Swiper>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 150,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  authButton: {
    width: "70%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  specialTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  specialParagraph: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
    paddingHorizontal: 30,
  },
  arrowButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
  },
});
