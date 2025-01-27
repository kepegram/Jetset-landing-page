import {
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useTheme } from "../../../context/themeContext";
import { MainButton } from "../../../components/ui/button";

const ForgotPassword: React.FC = () => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;

  const handlePasswordReset = async () => {
    if (!email) {
      setFeedbackMessage("Please enter your email address");
      return;
    }

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
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
            Forgot Password?
          </Text>
          <Text
            style={[styles.subtitle, { color: currentTheme.textSecondary }]}
          >
            Enter your email and we'll send you a link to reset your password
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text
            style={[styles.inputHeader, { color: currentTheme.textPrimary }]}
          >
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.accentBackground,
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
            autoComplete="email"
          />

          {feedbackMessage && (
            <Text
              style={[
                styles.feedbackMessage,
                {
                  color: feedbackMessage.includes("Failed")
                    ? currentTheme.error
                    : currentTheme.alternate,
                },
              ]}
            >
              {feedbackMessage}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={currentTheme.primary} />
            ) : (
              <MainButton
                onPress={handlePasswordReset}
                buttonText="Send Reset Link"
                width="100%"
              />
            )}
          </View>
        </View>
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
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    width: "100%",
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  feedbackMessage: {
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
