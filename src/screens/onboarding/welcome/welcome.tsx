import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useColorScheme,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

const Welcome: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  let swiperRef: any;
  const colorScheme = useColorScheme();

  return (
    <Swiper
      ref={(ref) => (swiperRef = ref)}
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      activeDotColor="#A463FF"
      dotColor="#c8c8c8"
    >
      <View style={[styles.slide, colorScheme === "dark" && styles.darkSlide]}>
        {/* <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Traveling_yhxq.png")}
        /> */}
        <Text style={styles.appName}>Jetset</Text>
        <Text
          style={[styles.paragraph, colorScheme === "dark" && styles.darkText]}
        >
          Discover. Dream. Explore.
        </Text>
      </View>

      <View style={[styles.slide, colorScheme === "dark" && styles.darkSlide]}>
        <Pressable
          style={styles.skipButton}
          onPress={() => swiperRef.scrollBy(3)} // Navigate to the last slide
        >
          <Text
            style={[styles.skipText, colorScheme === "dark" && styles.darkText]}
          >
            Skip
          </Text>
        </Pressable>

        {/* <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Journey_re_ec5q.png")}
        /> */}
        <Text style={[styles.title, colorScheme === "dark" && styles.darkText]}>
          Create your dream travel list
        </Text>
        <Text
          style={[styles.paragraph, colorScheme === "dark" && styles.darkText]}
        >
          Curate your own personalized travel bucket list
        </Text>
      </View>

      <View style={[styles.slide, colorScheme === "dark" && styles.darkSlide]}>
        <Pressable
          style={styles.skipButton}
          onPress={() => swiperRef.scrollBy(2)} // Navigate to the last slide
        >
          <Text
            style={[styles.skipText, colorScheme === "dark" && styles.darkText]}
          >
            Skip
          </Text>
        </Pressable>
        {/* <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_travel_together_re_kjf2.png")}
        /> */}
        <Text style={[styles.title, colorScheme === "dark" && styles.darkText]}>
          Plan trips and explore destinations
        </Text>
        <Text
          style={[styles.paragraph, colorScheme === "dark" && styles.darkText]}
        >
          Simple tools and a powerful interface to help you plan your dream
          trip.
        </Text>
      </View>

      <View style={[styles.slide, colorScheme === "dark" && styles.darkSlide]}>
        <Pressable
          style={styles.skipButton}
          onPress={() => swiperRef.scrollBy(1)} // Navigate to the last slide
        >
          <Text
            style={[styles.skipText, colorScheme === "dark" && styles.darkText]}
          >
            Skip
          </Text>
        </Pressable>
        {/* <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_mobile_photos_psm5.png")}
        /> */}
        <Text style={[styles.title, colorScheme === "dark" && styles.darkText]}>
          Capture Memories
        </Text>
        <Text
          style={[styles.paragraph, colorScheme === "dark" && styles.darkText]}
        >
          Upload and share your photos
        </Text>
      </View>

      {/* Last Slide with Different Formatting */}
      <View style={[styles.slide, colorScheme === "dark" && styles.darkSlide]}>
        {/* <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_enter_uhqk.png")}
        /> */}
        <Text
          style={[
            styles.specialTitle,
            colorScheme === "dark" && styles.darkText,
          ]}
        >
          Become <Text style={{ color: "#A463FF" }}>Jetset</Text> Today
        </Text>
        <Text
          style={[
            styles.specialParagraph,
            colorScheme === "dark" && styles.darkText,
          ]}
        >
          Join our community to start planning your travel list and explore the
          world
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.authButton}
            onPress={() => navigation.navigate("UserAuth")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </Swiper>
  );
};

export default Welcome;

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
  darkSlide: {
    backgroundColor: "#121212",
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
  darkText: {
    color: "#fff", 
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
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  skipText: {
    fontSize: 16,
    color: "black",
  },
});
