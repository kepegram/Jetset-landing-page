import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { MainButton } from "../../../components/ui/button";

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
          <MainButton
            onPress={() => {
              navigation.navigate("Carousel");
            }}
            buttonText="Sign Up"
            textColor="black"
            style={styles.button}
          />

          <MainButton
            onPress={() => {
              navigation.navigate("Login");
            }}
            buttonText="Login"
            style={styles.altButton}
          />
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
    marginBottom: 10,
  },
  button: {
    backgroundColor: "white",
    width: "80%",
    alignItems: "center",
  },
  altButton: {
    backgroundColor: "transparent",
    width: "80%",
    alignItems: "center",
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
