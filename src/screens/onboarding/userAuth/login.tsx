import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
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
import { useTheme } from "../../../context/themeContext";
import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";
import { MainButton } from "../../../components/ui/button";

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
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "Login failed. Incorrect username or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                borderColor: currentTheme.secondary,
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
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </Pressable>
          </View>
          <MainButton
            buttonText="Login"
            onPress={handleLogin}
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
          <View style={styles.createAccountContainer}>
            <Text
              style={[
                styles.createAccountText,
                { color: currentTheme.textPrimary },
              ]}
            >
              New to Jetset?{" "}
              <Text
                style={{ color: currentTheme.alternate, fontWeight: "bold" }}
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
            >
              <Ionicons name="logo-apple" size={25} color="grey" />
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
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={currentTheme.alternate} />
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
  errorText: {
    textAlign: "center",
    marginBottom: 10,
  },
  createAccountContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 16,
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
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
    marginTop: 30,
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
    color: "grey",
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
