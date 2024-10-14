import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../main/profileScreen/themeContext";
import * as Haptics from "expo-haptics";
import { AntDesign } from "@expo/vector-icons";

type CarouselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Carousel"
>;

const Carousel: React.FC = () => {
  const navigation = useNavigation<CarouselScreenNavigationProp>();
  let swiperRef: any;
  const { theme } = useTheme();

  const currentStyles = theme === "dark" ? darkStyles : styles;

  const handleNextSlide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    swiperRef.scrollBy(1);
  };

  return (
    <Swiper
      ref={(ref) => (swiperRef = ref)}
      style={currentStyles.wrapper}
      showsButtons={false}
      loop={false}
      activeDotColor="#A463FF"
      dotColor="#c8c8c8"
    >
      <View style={currentStyles.slide}>
        {/* <Image
          style={currentStyles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Journey_re_ec5q.png")}
        /> */}
        <Text style={currentStyles.title}>Create your dream travel list</Text>
        <Text style={currentStyles.paragraph}>
          Curate your own personalized travel bucket list
        </Text>
        {/* Right Arrow Icon to move slide */}
        <Pressable style={currentStyles.arrowButton} onPress={handleNextSlide}>
          <AntDesign name="rightcircle" size={36} color="#fff" />
        </Pressable>
      </View>

      <View style={currentStyles.slide}>
        {/* <Image
          style={currentStyles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_travel_together_re_kjf2.png")}
        /> */}
        <Text style={currentStyles.title}>
          Plan trips and explore destinations
        </Text>
        <Text style={currentStyles.paragraph}>
          Simple tools and a powerful interface to help you plan your dream
          trip.
        </Text>
        {/* Right Arrow Icon to move slide */}
        <Pressable style={currentStyles.arrowButton} onPress={handleNextSlide}>
          <AntDesign name="rightcircle" size={36} color="#fff" />
        </Pressable>
      </View>

      <View style={currentStyles.slide}>
        {/* <Image
          style={currentStyles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_mobile_photos_psm5.png")}
        /> */}
        <Text style={currentStyles.title}>Capture Memories</Text>
        <Text style={currentStyles.paragraph}>
          Upload and share your photos
        </Text>
        {/* Right Arrow Icon to move slide */}
        <Pressable style={currentStyles.arrowButton} onPress={handleNextSlide}>
          <AntDesign name="rightcircle" size={36} color="#fff" />
        </Pressable>
      </View>

      {/* Last Slide with Different Formatting */}
      <View style={currentStyles.slide}>
        {/* <Image
          style={currentStyles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_enter_uhqk.png")}
        /> */}
        <Text style={currentStyles.specialTitle}>
          Become <Text style={{ color: "#A463FF" }}>Jetset</Text> Today
        </Text>
        <Text style={currentStyles.specialParagraph}>
          Join our community to start planning your travel list and explore the
          world
        </Text>
        <View style={currentStyles.buttonContainer}>
          <Pressable
            style={currentStyles.authButton}
            onPress={() => {
              navigation.navigate("UserAuth");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Text style={currentStyles.buttonText}>Get Started</Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  image: {
    position: "absolute",
    top: 80,
    width: "95%",
    height: "65%",
    resizeMode: "contain",
  },
  appName: {
    fontSize: 72,
    fontWeight: "bold",
    marginBottom: 100,
    color: "#A463FF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#000",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
    marginBottom: 150,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: "#A463FF",
    width: "70%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
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

const darkStyles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  skipText: {
    fontSize: 16,
    color: "#fff",
  },
  image: {
    position: "absolute",
    top: 80,
    width: "95%",
    height: "65%",
    resizeMode: "contain",
  },
  appName: {
    fontSize: 72,
    fontWeight: "bold",
    marginBottom: 100,
    color: "#A463FF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#fff",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
    marginBottom: 150,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: "#A463FF",
    width: "70%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  specialTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  specialParagraph: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
    paddingHorizontal: 30,
    color: "#fff",
  },
  arrowButton: {
    position: "absolute",
    bottom: 90,
    right: 40,
  },
});
