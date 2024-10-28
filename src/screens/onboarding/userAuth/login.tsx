import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../../context/themeContext";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const Login: React.FC = () => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    setErrorMessage(null);

    if (email === "" || password === "") {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate("AppTabNav");
    } catch (err) {
      console.log(err);
      setErrorMessage("Login failed. Please try again.");
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
          Login
        </Text>
        <Text style={[styles.subTitle, { color: currentTheme.textSecondary }]}>
          Welcome back, please login below
        </Text>

        <View style={styles.loginContainer}>
          <Text
            style={[styles.inputHeader, { color: currentTheme.textPrimary }]}
          >
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.background,
                color: currentTheme.textPrimary,
                borderColor: currentTheme.alternate,
              },
            ]}
            placeholder="user@example.com"
            placeholderTextColor={currentTheme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <Pressable
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPasswordContainer}
          >
            <Text style={{ color: currentTheme.primary }}>
              Forgot Password?
            </Text>
          </Pressable>
          <Text
            style={[styles.inputHeader, { color: currentTheme.textPrimary }]}
          >
            Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  borderColor: currentTheme.alternate,
                },
              ]}
              placeholder="••••••••••"
              placeholderTextColor={currentTheme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              editable={!loading}
            />
            <Pressable
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color={currentTheme.icon}
              />
            </Pressable>
          </View>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: currentTheme.buttonBackground },
            ]}
            onPress={handleLogin}
          >
            <Text
              style={[styles.buttonText, { color: currentTheme.buttonText }]}
            >
              Login
            </Text>
          </Pressable>
          {errorMessage && (
            <Text style={[styles.errorText, { color: "red" }]}>
              {errorMessage}
            </Text>
          )}
          <View style={styles.dividerContainer}>
            <View
              style={[
                styles.divider,
                { backgroundColor: currentTheme.alternate },
              ]}
            />
            <Text
              style={[
                styles.dividerText,
                { color: currentTheme.textSecondary },
              ]}
            >
              or sign in with
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: currentTheme.alternate },
              ]}
            />
          </View>
          <View style={styles.socialIconsContainer}>
            <Pressable
              style={styles.iconButton}
              onPress={() => {
                console.log("Google Sign-In");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              }}
            >
              <Ionicons
                name="logo-google"
                size={22}
                color={currentTheme.icon}
              />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => {
                console.log("Apple Sign-In");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              }}
            >
              <Ionicons name="logo-apple" size={22} color={currentTheme.icon} />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text
            style={[styles.createAccountText, { color: currentTheme.primary }]}
          >
            Create an account
          </Text>
        </Pressable>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={currentTheme.primary} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;

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
    marginTop: 100,
  },
  subTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  loginContainer: { marginTop: 30 },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    top: 20,
    zIndex: 10,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    marginBottom: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  iconButton: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    width: 100,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 15,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 20,
  },
});
