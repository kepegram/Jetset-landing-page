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
    <Swiper style={styles.wrapper} showsButtons={false}>
      <View style={styles.slide1}>
        <Text style={styles.text}>Welcome to myApp</Text>
      </View>
      <View style={styles.slide2}>
        <Text style={styles.text}>Beautiful</Text>
      </View>
      <View style={styles.slide3}>
        <Text style={styles.text}>And simple</Text>
      </View>
      <View style={styles.slide4}>
        <Text style={styles.text}>Continue Here</Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable
            style={styles.signupButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <Pressable
            style={styles.guestButton}
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
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  slide4: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92FFC3",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
    width: "80%",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  signupButton: {
    backgroundColor: "#3F51B5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  guestButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
