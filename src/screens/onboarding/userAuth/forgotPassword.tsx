import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;

  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  const handlePasswordReset = async () => {
    setLoading(true);
    setFeedbackMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedbackMessage("Password reset link sent! If email exists in our system, check your email.");
      console.log("Password reset link sent to: ", email);
    } catch (err) {
      console.log(err);
      setFeedbackMessage("Failed to send reset link. Please try again.");
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
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>

          <Image
            source={require("../../../../assets/onboarding-imgs/undraw_Forgot_password_re_hxwm.png")}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>Forgot Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9f9f9f"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handlePasswordReset}
            >
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
          )}

          {feedbackMessage && (
            <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  image: {
    width: 450,
    height: 450,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
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
  feedbackMessage: {
    marginTop: 10,
    fontSize: 14,
    color: "#A463FF", // Change color to match your theme
    textAlign: "center",
  },
  loginLink: {
    color: "#A463FF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
