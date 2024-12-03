import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../context/themeContext";

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
      <ImageBackground
        source={require("../../../assets/onboarding-imgs/pexels-vince-2265876.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.slide1}>
          <View style={styles.slide1textContainer}>
            <Text style={[styles.title1, { color: "white" }]}>
              Create your dream travel list
            </Text>
            <Text
              style={[styles.paragraph1, { color: currentTheme.textSecondary }]}
            >
              Curate your own personalized travel bucket list
            </Text>
          </View>
        </View>
      </ImageBackground>

      <ImageBackground
        source={require("../../../assets/onboarding-imgs/hiker.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.slide2}>
          <View style={styles.slide2textContainer}>
            <Text style={[styles.title2, { color: "white" }]}>
              Plan trips and explore destinations
            </Text>
            <Text
              style={[styles.paragraph2, { color: currentTheme.textSecondary }]}
            >
              Simple tools and a powerful interface to help you plan your dream
              trip.
            </Text>
          </View>
        </View>
      </ImageBackground>

      <ImageBackground
        source={require("../../../assets/onboarding-imgs/city.jpeg")}
        style={styles.backgroundImage}
      >
        <View style={styles.slide3}>
          <View style={styles.title3Container}>
            <Text style={[styles.title3, { color: "white" }]}>
              Become{" "}
              <Text style={{ fontSize: 50, color: currentTheme.alternate }}>
                Jetset
              </Text>{" "}
              Today
            </Text>
          </View>
          <Text
            style={[styles.paragraph3, { color: currentTheme.textSecondary }]}
          >
            Join our community to start planning your travel list and explore
            the world
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.authButton,
                { backgroundColor: currentTheme.buttonBackground },
              ]}
              onPress={() => {
                navigation.navigate("SignUp");
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
      </ImageBackground>
    </Swiper>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  wrapper: {},
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  // Slide 1
  slide1: {
    padding: 20,
  },
  slide1textContainer: {
    top: "150%",
  },
  title1: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  paragraph1: {
    fontSize: 16,
    paddingHorizontal: 20,
  },

  // Slide 2
  slide2: {
    padding: 20,
  },
  slide2textContainer: {
    top: "150%",
  },
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  paragraph2: {
    fontSize: 16,
    paddingHorizontal: 20,
  },

  // Slide 3
  slide3: {
    padding: 20,
    justifyContent: "flex-end",
    flex: 1,
  },
  slide3textContainer: {
    top: "150%",
  },
  title3Container: {
    marginBottom: 20,
  },
  title3: {
    fontSize: 28,
    fontWeight: "bold",
  },
  paragraph3: {
    fontSize: 18,
    marginBottom: 50,
    paddingHorizontal: 30,
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
  arrowButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
  },
});
