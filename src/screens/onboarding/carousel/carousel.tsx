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
import { Ionicons } from '@expo/vector-icons';

type CarouselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Carousel"
>;

const Carousel: React.FC = () => {
  const navigation = useNavigation<CarouselScreenNavigationProp>();
  const { currentTheme } = useTheme();

  let swiperRef: Swiper | null = null;

  return (
    <Swiper
      ref={(ref) => (swiperRef = ref)}
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      activeDotColor={currentTheme.alternate}
      dotColor={currentTheme.inactive}
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
      paginationStyle={styles.paginationStyle} // Added this line
    >
      {/* Slide 1 */}

      <ImageBackground
        source={require("../../../assets/onboarding-imgs/city.jpeg")}
        style={styles.backgroundImage}
      >
        <View style={styles.slide1}>
          <View style={styles.slide1textContainer}>
            <Text style={[styles.title1, { color: "white" }]}>
              Create your dream travel list
            </Text>
            <Text style={[styles.paragraph1, { color: "#d1d1d1" }]}>
              Curate your own personalized travel bucket list
            </Text>
          </View>
          <Pressable
            style={styles.arrowButton}
            onPress={() => swiperRef?.scrollBy(1)}
          >
            <Ionicons name="arrow-forward" size={30} color="white" />
          </Pressable>
        </View>
      </ImageBackground>

      {/* Slide 2 */}

      <ImageBackground
        source={require("../../../assets/onboarding-imgs/igloo.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.slide2}>
          <View style={styles.shadow} />
          <View style={styles.slide2textContainer}>
            <Text style={[styles.title2, { color: "white" }]}>
              Plan trips and explore destinations
            </Text>
            <Text style={[styles.paragraph2, { color: "#d1d1d1" }]}>
              Simple tools and a powerful interface to help you plan your dream
              trip.
            </Text>
          </View>
          <Pressable
            style={styles.arrowButton}
            onPress={() => swiperRef?.scrollBy(1)}
          >
            <Ionicons name="arrow-forward" size={30} color="white" />
          </Pressable>
        </View>
      </ImageBackground>

      {/* Slide 3 */}

      <ImageBackground
        source={require("../../../assets/onboarding-imgs/beautiful.jpeg")}
        style={styles.backgroundImage}
      >
        <View style={styles.slide3}>
          <View style={styles.slide3textContainer}>
            <Text style={[styles.title3, { color: "white" }]}>
              Become{"\n"}
              <Text style={{ fontSize: 60, color: currentTheme.alternate }}>
                Jetset
              </Text>{"\n"}
              Today
            </Text>

            <Text style={[styles.paragraph3, { color: "#d1d1d1" }]}>
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
                  style={[
                    styles.buttonText,
                    { color: currentTheme.buttonText },
                  ]}
                >
                  Get Started
                </Text>
              </Pressable>
            </View>
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
  dotStyle: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  activeDotStyle: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  shadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  paginationStyle: {
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginBottom: 10,
  },
  arrowButton: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 25,
    bottom: 20,
    right: 30,
  },

  // Slide 1
  slide1: {
    padding: 20,
    flex: 1,
  },
  slide1textContainer: {
    top: "75%",
  },
  title1: {
    fontSize: 38,
    marginBottom: 25,
    fontWeight: "bold",
    textAlign: "left",
  },
  paragraph1: {
    fontSize: 16,
    textAlign: "left",
  },

  // Slide 2
  slide2: {
    padding: 20,
    flex: 1,
  },
  slide2textContainer: {
    top: "75%",
  },
  title2: {
    fontSize: 38,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "left",
  },
  paragraph2: {
    fontSize: 16,
    textAlign: "left",
  },

  // Slide 3
  slide3: {
    padding: 20,
    flex: 1,
  },
  slide3textContainer: {
    top: "65%",
  },
  title3: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "left",
  },
  paragraph3: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "left",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
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
});
