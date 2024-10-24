import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../main/profileScreen/themeContext";
import * as Haptics from "expo-haptics";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

const Welcome: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { theme } = useTheme();

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.slide}>
      {/* Uncomment the image if needed */}
      {/* <Image
          style={currentStyles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Traveling_yhxq.png")}
        /> */}
      <Text style={currentStyles.appName}>Jetset</Text>
      <Text style={currentStyles.paragraph}>Discover. Dream. Explore.</Text>

      {/* Buttons */}
      <View style={currentStyles.buttonContainer}>
        <Pressable
          style={currentStyles.button}
          onPress={() => {
            navigation.navigate("Carousel");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }}
        >
          <Text style={currentStyles.buttonText}>Continue</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            navigation.navigate("UserAuth");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }}
        >
          <Text style={currentStyles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingBottom: 40,
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
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#A463FF",
    width: "80%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const darkStyles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: 10,
    paddingBottom: 40,
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
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#737373",
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#A463FF",
    width: "80%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  arrowButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
  },
});
