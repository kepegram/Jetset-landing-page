import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Appearance,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../context/themeContext";

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

const ForgotPassword: React.FC = () => {
  const { theme } = useTheme();
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
      setFeedbackMessage(
        "Password reset link sent! If email exists in our system, check your email."
      );
      console.log("Password reset link sent to: ", email);
    } catch (err) {
      console.log(err);
      setFeedbackMessage("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <KeyboardAvoidingView
      style={currentStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={currentStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={currentStyles.title}>Forgot Password</Text>

        <Text style={currentStyles.inputHeader}>Email</Text>
        <TextInput
          style={currentStyles.input}
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
          <Pressable
            style={currentStyles.button}
            onPress={() => {
              handlePasswordReset();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Text style={currentStyles.buttonText}>Send Reset Link</Text>
          </Pressable>
        )}

        {feedbackMessage && (
          <Text style={currentStyles.feedbackMessage}>{feedbackMessage}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#000",
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#b3b3b3",
  },
  button: {
    backgroundColor: "black",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackMessage: {
    marginTop: 10,
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 50,
    color: "#fff",
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#1e1e1e",
    color: "#fff",
  },
  button: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackMessage: {
    marginTop: 10,
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});
