import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

const { width } = Dimensions.get("window");

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
          source={require("../../../../assets/onboarding-imgs/undraw_Mindfulness_8gqa.png")}
        />
        <Text style={styles.title}>Welcome to myApp</Text>
        <Text style={styles.paragraph}>
          Discover a new way to stay organized, productive, and efficient with
          our beautifully crafted app.
        </Text>
      </View>

      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_flying_drone.png")}
        />
        <Text style={styles.title}>Stay Connected</Text>
        <Text style={styles.paragraph}>
          Keep track of your tasks, manage your schedule, and stay on top of
          everything effortlessly.
        </Text>
      </View>

      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Woman_ffrd.png")}
        />
        <Text style={styles.title}>Achieve More</Text>
        <Text style={styles.paragraph}>
          With simple tools and a powerful interface, we help you achieve your
          goals with ease.
        </Text>
      </View>

      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_enter_uhqk.png")}
        />
        <Text style={styles.slide4title}>Get Started</Text>
        <Text style={styles.slide4paragraph}>
          Sign up to unlock the full experience or continue as a guest to
          explore the app.
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.authButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Login</Text>
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
    padding: 20,
  },

  image: {
    position: "absolute",
    top: 100,
    width: 450, // Responsive width
    height: 450,
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },

  slide4title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },

  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
    marginBottom: 150,
    paddingHorizontal: 20, // Add horizontal padding
  },

  slide4paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
    marginBottom: 40,
    paddingHorizontal: 20, // Add horizontal padding
  },

  buttonContainer: {
    width: "100%",
    marginBottom: 50,
    alignItems: "center",
  },

  authButton: {
    backgroundColor: "#A463FF",
    width: "70%",
    padding: 15,
    borderRadius: 25,
    marginBottom: 5,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  linkText: {
    color: "#000",
    fontSize: 17,
    marginTop: 10,
    fontWeight: "bold",
  },
});
