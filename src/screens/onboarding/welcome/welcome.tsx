import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
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

  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      activeDotColor="#A463FF"
      dotColor="#c8c8c8"
    >
      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Traveling_yhxq.png")}
        />
        <Text style={styles.appName}>
          <Text style={{ color: "orange" }}>Jetset</Text>
        </Text>
        <Text style={styles.paragraph}>Discover. Dream. Explore.</Text>
      </View>

      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Journey_re_ec5q.png")}
        />
        <Text style={styles.title}>Create your dream travel list</Text>
        <Text style={styles.paragraph}>
          Curate your own personalized travel bucket list
        </Text>
      </View>

      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_travel_together_re_kjf2.png")}
        />
        <Text style={styles.title}>Plan trips and explore destinations</Text>
        <Text style={styles.paragraph}>
          Simple tools and a powerful interface to help you plan your dream
          trip.
        </Text>
      </View>

      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_mobile_photos_psm5.png")}
        />
        <Text style={styles.title}>Capture Memories</Text>
        <Text style={styles.paragraph}>Upload and share your photos</Text>
      </View>

      {/* Last Slide with Different Formatting */}
      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_enter_uhqk.png")}
        />
        <Text style={styles.specialTitle}>
          Become <Text style={{ color: "orange" }}>Jetset</Text> Today
        </Text>
        <Text style={styles.specialParagraph}>
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
    paddingBottom: 40, // Reduced padding
  },

  image: {
    position: "absolute",
    top: 80,
    width: "95%",
    height: "65%",
    resizeMode: "contain",
  },

  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#A463FF", // Keep this for the rest of the app name
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },

  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
    marginBottom: 100, // Reduced margin between image and text
    paddingHorizontal: 20,
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30, // Reduced bottom padding
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

  // Special styles for the last slide
  specialTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#A463FF",
    marginBottom: 20,
  },

  specialParagraph: {
    fontSize: 18, // Larger paragraph font
    textAlign: "center",
    marginBottom: 50, // Extra margin for breathing room
    paddingHorizontal: 30,
  },
});
