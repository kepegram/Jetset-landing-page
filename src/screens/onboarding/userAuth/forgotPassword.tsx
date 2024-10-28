import {
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../context/themeContext";

const ForgotPassword: React.FC = () => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;

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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Forgot Password
        </Text>

        <Text style={[styles.inputHeader, { color: currentTheme.textPrimary }]}>
          Email
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentTheme.background,
              color: currentTheme.textPrimary,
              borderColor: currentTheme.inactive,
            },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={currentTheme.textSecondary}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color={currentTheme.primary} />
        ) : (
          <Pressable
            style={[
              styles.button,
              { backgroundColor: currentTheme.buttonBackground },
            ]}
            onPress={() => {
              handlePasswordReset();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Text
              style={[styles.buttonText, { color: currentTheme.buttonText }]}
            >
              Send Reset Link
            </Text>
          </Pressable>
        )}

        {feedbackMessage && (
          <Text
            style={[
              styles.feedbackMessage,
              { color: currentTheme.textSecondary },
            ]}
          >
            {feedbackMessage}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 50,
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackMessage: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
