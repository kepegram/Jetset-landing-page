import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  OAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useTheme } from "../../../context/themeContext";
import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";
import { MainButton } from "../../../components/ui/button";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginProps {
  promptAsync: (
    options?: AuthRequestPromptOptions
  ) => Promise<AuthSessionResult>;
}

const Login: React.FC<LoginProps> = ({ promptAsync }) => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const isFormValid = email !== "" && password !== "";

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
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "Login failed. Incorrect username or password. Please try again."
      );
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

        const provider = new OAuthProvider("apple.com");
        const appleCredential = provider.credential({
          idToken: identityToken,
        });

        const authResult = await signInWithCredential(auth, appleCredential);

        const userRef = doc(db, "users", authResult.user.uid);
        await setDoc(
          userRef,
          {
            name: fullName?.givenName || "User",
            email: email || authResult.user.email,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
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
      testID="login-screen"
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View testID="login-header" style={styles.headerContainer}>
          <Text
            testID="login-title"
            style={[styles.title, { color: currentTheme.textPrimary }]}
          >
            Welcome Back
          </Text>
          <Text
            testID="login-subtitle"
            style={[styles.subTitle, { color: currentTheme.textSecondary }]}
          >
            Sign in to continue your journey
          </Text>
        </View>

        <View testID="login-form" style={styles.loginContainer}>
          <View style={styles.inputWrapper}>
            <Text
              style={[styles.inputHeader, { color: currentTheme.textPrimary }]}
            >
              Email
            </Text>
            <TextInput
              testID="login-email-input"
              style={[
                styles.input,
                {
                  backgroundColor: currentTheme.accentBackground,
                  color: currentTheme.textPrimary,
                  borderColor: currentTheme.inactive,
                },
              ]}
              placeholder="user@example.com"
              placeholderTextColor={currentTheme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              autoComplete="email"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text
              style={[styles.inputHeader, { color: currentTheme.textPrimary }]}
            >
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                testID="login-password-input"
                style={[
                  styles.input,
                  {
                    backgroundColor: currentTheme.accentBackground,
                    color: currentTheme.textPrimary,
                    borderColor: currentTheme.inactive,
                  },
                ]}
                placeholder="••••••••••"
                placeholderTextColor={currentTheme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                editable={!loading}
                autoComplete="password"
              />
              <Pressable
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
                disabled={loading}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  color={currentTheme.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            testID="forgot-password-button"
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPasswordContainer}
            disabled={loading}
          >
            <Text
              testID="forgot-password-text"
              style={[
                styles.forgotPasswordText,
                { color: currentTheme.alternate },
              ]}
            >
              Forgot Password?
            </Text>
          </Pressable>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={currentTheme.primary}
              style={styles.button}
            />
          ) : (
            <MainButton
              testID="login-submit-button"
              buttonText="Sign In"
              onPress={handleLogin}
              width="100%"
              disabled={loading || !isFormValid}
              style={[styles.button, !isFormValid && { opacity: 0.5 }]}
            />
          )}

          {errorMessage && (
            <Text
              testID="login-error-message"
              style={[styles.errorText, { color: currentTheme.error }]}
            >
              {errorMessage}
            </Text>
          )}

          <View style={styles.createAccountContainer}>
            <Text
              style={[
                styles.createAccountText,
                { color: currentTheme.textSecondary },
              ]}
            >
              New to Jetset?{" "}
              <Text
                style={[styles.signUpLink, { color: currentTheme.alternate }]}
                testID="signup-link-text"
                onPress={() => navigation.navigate("SignUp")}
              >
                Sign up here
              </Text>
            </Text>
          </View>

          <View style={styles.dividerContainer}>
            <View
              style={[
                styles.divider,
                { backgroundColor: currentTheme.secondary },
              ]}
            />
            <Text
              style={[
                styles.dividerText,
                { color: currentTheme.textSecondary },
              ]}
            >
              or continue with
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
              testID="google-signin-button"
              onPress={() => promptAsync()}
              backgroundColor={currentTheme.accentBackground}
              textColor={currentTheme.textPrimary}
              style={styles.socialButton}
              disabled={loading}
            >
              <Image
                source={require("../../../assets/app-imgs/google.png")}
                style={styles.socialIcon}
              />
              <Text
                style={[
                  styles.socialButtonText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Google
              </Text>
            </MainButton>

            {Platform.OS === "ios" && (
              <AppleAuthentication.AppleAuthenticationButton
                testID="apple-signin-button"
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle
                    .WHITE_OUTLINE
                }
                cornerRadius={5}
                style={styles.socialButton}
                onPress={() => handleAppleSignIn()}
              />
            )}
          </View>
        </View>
      </ScrollView>
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
    padding: 24,
  },
  headerContainer: {
    marginTop: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  loginContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 20,
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
    borderWidth: 1,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    width: "100%",
    marginBottom: 16,
  },
  errorText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 16,
  },
  createAccountContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 15,
  },
  signUpLink: {
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  socialIconsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
