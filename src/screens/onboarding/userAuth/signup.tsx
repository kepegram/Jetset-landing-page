import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../context/themeContext";
import * as Haptics from "expo-haptics";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

const SignUp: React.FC = () => {
  const { currentTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleSignUp = async () => {
    setErrorMessage(null);

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = response.user;

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem("userName", name);
    } catch (err: any) {
      console.error("Error signing up:", err);
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }
      if (err.code === "auth/weak-password") {
        setErrorMessage("Please assure password is at least 6 characters.");
      } else {
        setErrorMessage("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Sign Up
        </Text>

        <View style={styles.signUpContainer}>
          <Text
            style={[styles.inputHeader, { color: currentTheme.textPrimary }]}
          >
            Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentTheme.background,
                color: currentTheme.textPrimary,
                borderColor: currentTheme.secondary,
              },
            ]}
            placeholder="Jane Doe"
            placeholderTextColor={currentTheme.textSecondary}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

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
                borderColor: currentTheme.secondary,
              },
            ]}
            placeholder="example@mail.com"
            placeholderTextColor={currentTheme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

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
                  borderColor: currentTheme.secondary,
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
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </Pressable>
          </View>

          <Text
            style={[styles.inputHeader, { color: currentTheme.textPrimary }]}
          >
            Confirm Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  borderColor: currentTheme.secondary,
                },
              ]}
              placeholder="••••••••••"
              placeholderTextColor={currentTheme.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              autoCapitalize="none"
              editable={!loading}
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Ionicons
                name={confirmPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.button,
              { backgroundColor: currentTheme.buttonBackground },
            ]}
            onPress={() => {
              handleSignUp();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Text
              style={[styles.buttonText, { color: currentTheme.buttonText }]}
            >
              Sign Up
            </Text>
          </Pressable>
          {errorMessage && (
            <Text style={[styles.errorText, { color: "red" }]}>
              {errorMessage}
            </Text>
          )}
        </View>

        <View style={styles.dividerContainer}>
          <View
            style={[
              styles.divider,
              { backgroundColor: currentTheme.secondary },
            ]}
          />
          <Text
            style={[styles.dividerText, { color: currentTheme.textSecondary }]}
          >
            or sign up with
          </Text>
          <View
            style={[
              styles.divider,
              { backgroundColor: currentTheme.secondary },
            ]}
          />
        </View>

        <View style={styles.socialIconsContainer}>
          <Pressable
            style={styles.iconButton}
            onPress={() => {
              Alert.alert("Google Sign-In");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Ionicons name="logo-google" size={22} color="grey" />
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={() => {
              Alert.alert("Apple Sign-In");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <Ionicons name="logo-apple" size={22} color="grey" />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text
            style={[
              styles.createAccountText,
              { color: currentTheme.textPrimary },
            ]}
          >
            Already a member?
            <Text style={[styles.loginText, { color: currentTheme.contrast }]}>
              {" "}
              Log in
            </Text>
          </Text>
        </Pressable>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffc071" />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  signUpContainer: { marginTop: 40 },
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
    marginBottom: 20,
    marginTop: 15,
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
    marginVertical: 5,
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
    marginTop: 10,
  },
  iconButton: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    zIndex: 20,
  },
});
