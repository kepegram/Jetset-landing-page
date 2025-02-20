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
import { MainButton } from "../../../components/ui/button";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

type CarouselScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Carousel"
>;

const CarouselScreen: React.FC = () => {
  const navigation = useNavigation<CarouselScreenNavigationProp>();
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle slide changes
  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };

  // Handle button presses
  const handleGetStarted = () => {
    navigation.navigate("SignUp");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  // Handle reaching final slide
  const handleMomentumEnd = (index: number) => {
    // Remove haptics code
  };

  const slides = [
    {
      image: require("../../../assets/onboarding-imgs/ai-planning.jpeg"),
      title: "AI-Powered Travel Planning 🤖",
      subtitle:
        "Let our smart AI create personalized travel plans just for you. From duration to budget, we've got you covered.",
      emoji: "✨",
    },
    {
      image: require("../../../assets/onboarding-imgs/city.jpeg"),
      title: "Interactive Trip Planning 🗺️",
      subtitle:
        "Visualize your journey with interactive maps and real-time updates. Plan smarter, travel better.",
      emoji: "📍",
    },
    {
      image: require("../../../assets/onboarding-imgs/itinerary.jpeg"),
      title: "Smart Itineraries 📱",
      subtitle:
        "Get day-by-day plans with estimated times, costs, and local insights. Everything you need in one place.",
      emoji: "⏰",
    },
    {
      image: require("../../../assets/onboarding-imgs/offline.jpeg"),
      title: "Always Available 🌐",
      subtitle:
        "Access your trips offline. Stay organized even without internet connection.",
      emoji: "💫",
    },
    {
      image: require("../../../assets/onboarding-imgs/ready.jpeg"),
      title: "Ready for Adventure?",
      subtitle:
        "Join our community of travelers and start planning your next unforgettable journey.",
      emoji: "🚀",
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
            <Animated.View
              entering={FadeIn.duration(800)}
              style={styles.dotsContainer}
            >
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex && styles.activeDot,
                    {
                      backgroundColor:
                        i === activeIndex ? "#fff" : "rgba(255,255,255,0.4)",
                    },
                  ]}
                />
              ))}
            </Animated.View>

            <View style={styles.bottomContent}>
              <Animated.View
                entering={FadeIn.duration(1000)}
                style={styles.textContainer}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </Animated.View>

              {index === slides.length - 1 ? (
                <Animated.View
                  entering={FadeIn.delay(500).duration(800)}
                  style={styles.buttonContainer}
                >
                  <MainButton
                    onPress={handleGetStarted}
                    buttonText="Get Started"
                    width="100%"
                    style={styles.getStartedButton}
                    textColor="black"
                  />
                  <MainButton
                    onPress={handleLogin}
                    buttonText="I already have an account"
                    width="100%"
                    style={styles.loginButton}
                    textColor="white"
                  />
                </Animated.View>
              ) : (
                <View style={styles.swipeIndicator}>
                  <Text style={styles.swipeText}>Swipe to continue</Text>
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
        onSnapToItem={handleSlideChange}
        onProgressChange={(_, absoluteProgress) => {
          const slideIndex = Math.round(absoluteProgress);
          handleMomentumEnd(slideIndex);
        }}
        defaultIndex={0}
        enabled={true}
      />
    </View>
  );
};

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
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
  },
  bottomContent: {
    paddingBottom: Platform.OS === "ios" ? 50 : 40,
  },
  textContainer: {
    padding: 32,
    paddingBottom: 20,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "#F5F5F5",
    lineHeight: 26,
    textAlign: "center",
    opacity: 0.9,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    width: "100%",
    gap: 12,
  },
  getStartedButton: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 16,
  },
  loginButton: {
    backgroundColor: "transparent",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  swipeIndicator: {
    alignItems: "center",
    marginTop: 20,
  },
  swipeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CarouselScreen;
