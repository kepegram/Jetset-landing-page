import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
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
    <ImageBackground
      source={require("../../../assets/onboarding-imgs/jetset-welcome.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.slide}>
        <Text style={styles.appName}>Jetset</Text>
        <Text style={styles.paragraph}>
          Dream. Discover. <Text style={styles.exploreText}>Explore.</Text>
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              navigation.navigate("Carousel");
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.altButtonText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  slide: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  appName: {
    fontSize: 72,
    fontWeight: "bold",
    bottom: "38%",
    color: "white",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#4a4a4a",
    bottom: "38%",
    paddingHorizontal: 20,
  },
  exploreText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "white",
    width: "80%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  altButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
