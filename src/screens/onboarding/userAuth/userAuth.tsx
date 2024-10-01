import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Ionicons } from "@expo/vector-icons";

type UserAuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UserAuth"
>;

const UserAuth: React.FC = () => {
  const navigation = useNavigation<UserAuthScreenNavigationProp>();
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.authButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },

  authButton: {
    backgroundColor: "#A463FF",
    width: "70%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  linkText: {
    color: "#000",
    fontSize: 17,
    marginTop: 10,
    fontWeight: "bold",
  },
});
