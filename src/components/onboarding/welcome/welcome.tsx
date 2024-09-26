import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
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
      activeDotColor="#e5e5e5"
      dotColor="#393939"
    >
      <View style={styles.slide1}>
        <Text style={styles.slide1text}>Welcome to myApp</Text>
      </View>
      <View style={styles.slide2}>
        <Text style={styles.slide2text}>Beautiful</Text>
      </View>
      <View style={styles.slide3}>
        <Text style={styles.slide3text}>Simple</Text>
      </View>
      <View style={styles.slide4}>
        <Text style={styles.slide4text}>Continue Here</Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.authButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable
            style={styles.authButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <Pressable
            style={styles.authButton}
            onPress={() => navigation.navigate("AppTabNav")}
          >
            <Text style={styles.buttonText}>Use as Guest</Text>
          </Pressable>
        </View>
      </View>
    </Swiper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  slide1text: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b5b5b5",
  },
  slide2text: {
    color: "#5f5f5f",
    fontSize: 30,
    fontWeight: "bold",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5f5f5f",
  },
  slide3text: {
    color: "#b5b5b5",
    fontSize: 30,
    fontWeight: "bold",
  },

  // User Auth Screen
  slide4: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  slide4text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
    width: "80%",
  },
  authButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
