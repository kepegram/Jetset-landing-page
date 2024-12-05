import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  OAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../context/themeContext";
import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import { MainButton } from "../../../components/ui/button";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

interface SignUpProps {
  promptAsync: (
    options?: AuthRequestPromptOptions
  ) => Promise<AuthSessionResult>;
}

const SignUp: React.FC<SignUpProps> = ({ promptAsync }) => {
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
      await AsyncStorage.setItem("preferencesSet", "false");
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

  const handleAppleSignIn = async () => {
    setErrorMessage(null);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const { identityToken, fullName, email } = credential;

        if (!identityToken) {
          setErrorMessage("Authentication failed. Please try again.");
          return;
        }

        // Create an OAuthProvider for Apple
        const provider = new OAuthProvider("apple.com");

        // Create the credential
        const appleCredential = provider.credential({
          idToken: identityToken,
        });

        // Sign in with Firebase
        const authResult = await signInWithCredential(auth, appleCredential);

        // Store user info in Firestore
        const userRef = doc(db, "users", authResult.user.uid);
        await setDoc(
          userRef,
          {
            name: fullName?.givenName || "User",
            email: email || authResult.user.email,
            createdAt: new Date().toISOString(),
          },
          { merge: true } // Merge to avoid overwriting existing data
        );

        await AsyncStorage.setItem("userName", fullName?.givenName || "User");
      }
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        setErrorMessage("Cancelled Apple sign-in flow");
      } else {
        setErrorMessage("Error authenticating with Apple, please try again.");
      }
      console.error("Apple Sign-In Error:", e);
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

          <MainButton
            buttonText="Sign Up"
            onPress={handleSignUp}
            backgroundColor={currentTheme.buttonBackground}
            textColor={currentTheme.buttonText}
            disabled={loading}
            style={styles.button}
          />
          {errorMessage && (
            <Text style={[styles.errorText, { color: "red" }]}>
              {errorMessage}
            </Text>
          )}
        </View>

        <Pressable onPress={() => navigation.navigate("Login")} disabled={loading}>
          <Text
            style={[
              styles.createAccountText,
              { color: currentTheme.textPrimary },
            ]}
          >
            Already a member?{" "}
            <Text style={[styles.loginText, { color: currentTheme.alternate }]}>
              Log in
            </Text>
          </Text>
        </Pressable>

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
            OR
          </Text>
          <View
            style={[
              styles.divider,
              { backgroundColor: currentTheme.secondary },
            ]}
          />
        </View>

        <View style={styles.socialIconsContainer}>
          <MainButton
            onPress={() => promptAsync()}
            backgroundColor={currentTheme.accentBackground}
            textColor={currentTheme.textPrimary}
            style={styles.iconButton}
            disabled={loading}
          >
            <Image
              source={require("../../../assets/google.png")}
              style={{ width: 22, height: 22 }}
            />
            <Text
              style={[
                styles.iconButtonText,
                { color: currentTheme.textPrimary },
              ]}
            >
              Continue with Google
            </Text>
          </MainButton>
          <View style={{ height: 10 }} />
          <MainButton
            onPress={() => console.log("Apple Sign-In")}
            backgroundColor={currentTheme.accentBackground}
            textColor={currentTheme.textPrimary}
            style={styles.iconButton}
            disabled={loading}
          >
            <Ionicons name="logo-apple" size={23} color="black" />
            <Text
              style={[
                styles.iconButtonText,
                { color: currentTheme.textPrimary },
              ]}
            >
              Continue with Apple
            </Text>
          </MainButton>
        </View>
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
  signUpContainer: { marginTop: 20 },
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
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  iconButton: {
    marginHorizontal: 20,
    padding: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  iconButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
