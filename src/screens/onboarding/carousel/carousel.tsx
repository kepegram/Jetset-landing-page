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
import { Ionicons } from '@expo/vector-icons';
import { MainButton } from "../../../components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';

type CarouselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Carousel"
>;

const { width, height } = Dimensions.get('window');

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
        colors={['transparent', 'rgba(0,0,0,0.8)']}
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
                style={styles.authButton}
                textColor={currentTheme.buttonText}
                backgroundColor={currentTheme.buttonBackground}
              />
            </View>
          ) : (
            <Pressable
              style={styles.arrowButton}
              onPress={() => swiperRef?.scrollBy(1)}
            >
              <Ionicons name="arrow-forward" size={30} color="white" />
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
        "Simple tools and a powerful interface to help you plan your dream trip."
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
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  slideContent: {
    padding: 24,
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "white",
    marginBottom: 16,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 18,
    color: "#E0E0E0",
    lineHeight: 26,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  activeDotStyle: {
    width: 24,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  paginationStyle: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 160, // Increased bottom spacing to avoid overlap
    left: 24,
    justifyContent: 'flex-start',
  },
  arrowButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 16,
    borderRadius: 30,
    bottom: Platform.OS === 'ios' ? -20 : -10,
    right: 24,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  authButton: {
    width: "100%",
  },
});
