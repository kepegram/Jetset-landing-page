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
  SafeAreaView,
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

interface InputFieldProps {
  label: string;
  theme: {
    textPrimary: string;
    background: string;
    secondary: string;
    textSecondary: string;
    accentBackground: string;
    inactive: string;
  };
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences";
  editable?: boolean;
  testID?: string;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  visible: boolean;
  toggleVisible: () => void;
  theme: {
    textPrimary: string;
    background: string;
    secondary: string;
    textSecondary: string;
    accentBackground: string;
    inactive: string;
  };
  editable: boolean;
  testID?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, theme, ...props }) => (
  <View style={styles.inputWrapper}>
    <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
      {label}
    </Text>
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: theme.accentBackground,
          color: theme.textPrimary,
          borderColor: theme.inactive,
        },
      ]}
      placeholderTextColor={theme.textSecondary}
      {...props}
    />
  </View>
);

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChangeText,
  visible,
  toggleVisible,
  theme,
  editable,
  testID,
}) => (
  <View style={styles.inputWrapper}>
    <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
      {label}
    </Text>
    <View style={styles.passwordContainer}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.accentBackground,
            color: theme.textPrimary,
            borderColor: theme.inactive,
          },
        ]}
        placeholder="••••••••••"
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        autoCapitalize="none"
        editable={editable}
        testID={testID}
      />
      <Pressable
        style={styles.eyeIcon}
        onPress={toggleVisible}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={visible ? "eye-off" : "eye"}
          size={24}
          color={theme.textSecondary}
        />
      </Pressable>
    </View>
  </View>
);

const SignUp: React.FC<SignUpProps> = ({ promptAsync }) => {
  const { currentTheme } = useTheme();
  const [username, setUsername] = useState("");
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

  const isFormValid = username && email && password && confirmPassword;

  const handleSignUp = async () => {
    setErrorMessage(null);

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
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem("userName", username);
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

        const provider = new OAuthProvider("apple.com");
        const appleCredential = provider.credential({
          idToken: identityToken,
        });

        const authResult = await signInWithCredential(auth, appleCredential);

        const userRef = doc(db, "users", authResult.user.uid);
        await setDoc(
          userRef,
          {
            username: fullName?.givenName || "User",
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
    <SafeAreaView
      testID="signup-screen"
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <KeyboardAvoidingView
        testID="signup-content"
        style={styles.contentContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View testID="signup-header" style={styles.headerContainer}>
          <Text
            testID="signup-title"
            style={[styles.title, { color: currentTheme.textPrimary }]}
          >
            Create Account
          </Text>
          <Text
            testID="signup-subtitle"
            style={[styles.subtitle, { color: currentTheme.textSecondary }]}
          >
            Sign up to get started
          </Text>
        </View>

        <View testID="signup-form" style={styles.signUpContainer}>
          <InputField
            testID="signup-username-input"
            label="Username"
            placeholder="johndoe123"
            value={username}
            onChangeText={setUsername}
            editable={!loading}
            theme={currentTheme}
            autoCapitalize="none"
          />

          <InputField
            testID="signup-email-input"
            label="Email"
            placeholder="example@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            theme={currentTheme}
          />

          <PasswordField
            testID="signup-password-input"
            label="Password"
            value={password}
            onChangeText={setPassword}
            visible={passwordVisible}
            toggleVisible={() => setPasswordVisible(!passwordVisible)}
            editable={!loading}
            theme={currentTheme}
          />

          <PasswordField
            testID="signup-confirm-password-input"
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            visible={confirmPasswordVisible}
            toggleVisible={() =>
              setConfirmPasswordVisible(!confirmPasswordVisible)
            }
            editable={!loading}
            theme={currentTheme}
          />

          <MainButton
            testID="signup-submit-button"
            buttonText="Create Account"
            onPress={handleSignUp}
            disabled={loading || !isFormValid}
            style={[styles.button, !isFormValid && { opacity: 0.5 }]}
          />

          {errorMessage && (
            <Text
              testID="signup-error-message"
              style={[styles.errorText, { color: currentTheme.error || "red" }]}
            >
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
            or continue with
          </Text>
          <View
            style={[
              styles.divider,
              { backgroundColor: currentTheme.secondary },
            ]}
          />
        </View>

        <View style={styles.socialButtonsContainer}>
          <MainButton
            testID="google-signup-button"
            onPress={() => promptAsync()}
            backgroundColor={currentTheme.accentBackground}
            textColor={currentTheme.textPrimary}
            style={[styles.socialButton, { opacity: loading ? 0.7 : 1 }]}
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
              testID="apple-signup-button"
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
              }
              cornerRadius={5}
              style={styles.socialButton}
              onPress={handleAppleSignIn}
            />
          )}
        </View>

        <Pressable
          testID="login-link-button"
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
          style={[styles.loginLink, { opacity: loading ? 0.7 : 1 }]}
        >
          <Text
            testID="login-link-text"
            style={[styles.loginText, { color: currentTheme.textSecondary }]}
          >
            Already have an account?{" "}
            <Text style={{ color: currentTheme.alternate, fontWeight: "bold" }}>
              Log in
            </Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  signUpContainer: {
    marginBottom: 24,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
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
    top: 10,
    padding: 4,
  },
  button: {
    width: "100%",
    marginTop: 16,
  },
  errorText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  divider: {
    flex: 1,
    height: 1.5,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 6,
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  loginLink: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
