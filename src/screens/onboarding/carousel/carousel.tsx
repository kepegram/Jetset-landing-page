import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../../components/ui/button";
import { LinearGradient } from "expo-linear-gradient";

type CarouselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Carousel"
>;

const { width, height } = Dimensions.get("window");

const Carousel: React.FC = () => {
  const navigation = useNavigation<CarouselScreenNavigationProp>();
  const { currentTheme } = useTheme();

  let swiperRef: Swiper | null = null;

  const renderSlide = (
    image: any,
    title: string,
    subtitle: string,
    isLastSlide: boolean = false
  ) => (
    <ImageBackground source={image} style={styles.backgroundImage}>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.gradient}
      >
        <View style={styles.slideContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {isLastSlide ? (
            <View style={styles.buttonContainer}>
              <MainButton
                onPress={() => navigation.navigate("SignUp")}
                buttonText="Get Started"
                width="100%"
              />
            </View>
          ) : (
            <Pressable
              style={styles.arrowButton}
              onPress={() => swiperRef?.scrollBy(1)}
            >
              <Ionicons name="chevron-forward" size={32} color="white" />
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );

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
      paginationStyle={styles.paginationStyle}
    >
      {renderSlide(
        require("../../../assets/onboarding-imgs/city.jpeg"),
        "Create your dream travel list",
        "Curate your own personalized travel bucket list"
      )}

      {renderSlide(
        require("../../../assets/onboarding-imgs/igloo.jpg"),
        "Plan trips and explore destinations",
        "Simple AI tools to help you plan your dream trip."
      )}

      {renderSlide(
        require("../../../assets/onboarding-imgs/beautiful.jpeg"),
        "Become\nJetset\nToday",
        "Join our community to start planning your travel list and explore the world",
        true
      )}
    </Swiper>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  wrapper: {},
  backgroundImage: {
    width,
    height,
    resizeMode: "cover",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 60 : 40,
  },
  slideContent: {
    padding: 32,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
    marginBottom: 20,
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    color: "#F5F5F5",
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
    marginRight: 6,
    opacity: 0.6,
  },
  activeDotStyle: {
    width: 20,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
    marginRight: 6,
  },
  paginationStyle: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 50,
    left: 32,
    justifyContent: "flex-start",
  },
  arrowButton: {
    position: "absolute",
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 40,
    bottom: Platform.OS === "ios" ? -30 : -20,
    right: 32,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  authButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
  },
});
