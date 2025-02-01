import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../../components/ui/button";
import { LinearGradient } from "expo-linear-gradient";

type CarouselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Carousel"
>;

const { width, height } = Dimensions.get("window");

const CarouselScreen: React.FC = () => {
  const navigation = useNavigation<CarouselScreenNavigationProp>();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      image: require("../../../assets/onboarding-imgs/city.jpeg"),
      title: "Create your dream travel list",
      subtitle: "Curate your own personalized travel bucket list",
    },
    {
      image: require("../../../assets/onboarding-imgs/igloo.jpg"),
      title: "Plan trips and explore destinations",
      subtitle: "Simple AI tools to help you plan your dream trip.",
    },
    {
      image: require("../../../assets/onboarding-imgs/beautiful.jpeg"),
      title: "Become\nJetset\nToday",
      subtitle:
        "Join our community to start planning your travel list and explore the world",
    },
  ];

  const renderSlide = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.slide}>
      <ImageBackground
        source={item.image}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.contentContainer}>
            <View style={styles.dotsContainer}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeIndex && styles.activeDot]}
                />
              ))}
            </View>

            <View style={styles.bottomContent}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              {index === slides.length - 1 ? (
                <View style={styles.buttonContainer}>
                  <MainButton
                    onPress={() => navigation.navigate("SignUp")}
                    buttonText="Get Started"
                    width="100%"
                  />
                </View>
              ) : (
                <View style={styles.swipeIndicatorContainer}>
                  <Ionicons
                    name="chevron-forward"
                    size={28}
                    color="rgba(255,255,255,0.6)"
                  />
                  <Ionicons
                    name="chevron-forward"
                    size={28}
                    color="rgba(255,255,255,0.3)"
                    style={styles.secondArrow}
                  />
                </View>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        loop={false}
        width={width}
        height={height}
        data={slides}
        renderItem={renderSlide}
        onSnapToItem={setActiveIndex}
        defaultIndex={0}
      />
    </View>
  );
};

export default CarouselScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    flex: 1,
    width,
    height,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#fff",
  },
  bottomContent: {
    paddingBottom: Platform.OS === "ios" ? 50 : 40,
  },
  textContainer: {
    padding: 32,
    paddingBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "white",
    marginBottom: 16,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#F5F5F5",
    lineHeight: 26,
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    width: "100%",
  },
  swipeIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  secondArrow: {
    marginLeft: -15,
  },
});
