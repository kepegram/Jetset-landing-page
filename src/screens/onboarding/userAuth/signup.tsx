import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Create user with email and password
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = response.user;

      // Now, attempt to write the user data to Firestore
      const userRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore

      // Save the user's name and email to Firestore using their UID
      await setDoc(userRef, {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      // Optionally store the name locally in AsyncStorage
      await AsyncStorage.setItem("userName", name);
      
    } catch (err) {
      console.error("Error signing up:", err);

      // Delete the user if Firestore write fails
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user); // Remove the user if Firestore operation fails
      }

      Alert.alert("Error", "Sign Up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.container}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.navigate("UserAuth")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>

          <Image
            style={styles.image}
            source={require("../../../../assets/onboarding-imgs/undraw_Sign_up_n6im.png")}
          />

          <Text style={styles.title}>Sign Up</Text>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#9f9f9f"
            value={name}
            onChangeText={setName}
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9f9f9f"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9f9f9f"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Confirm Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#9f9f9f"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Sign Up Button */}
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Pressable style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
          )}

          {/* Login Link */}
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>
              Already have an account? Log In
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    color: "#000",
  },
  button: {
    backgroundColor: "#A463FF",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#A463FF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
