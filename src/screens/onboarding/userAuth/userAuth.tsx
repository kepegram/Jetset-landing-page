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
  Appearance,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

type UserAuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UserAuth"
>;

const UserAuth: React.FC = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<UserAuthScreenNavigationProp>();

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

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
        <View style={currentStyles.topIcons}>
          <Pressable onPress={() => navigation.navigate("Welcome")}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </View>

        <Text style={currentStyles.title}>Login</Text>

        <View style={currentStyles.loginContainer}>
          <Text style={currentStyles.inputHeader}>Email</Text>
          <TextInput
            style={currentStyles.input}
            placeholder="user@example.com"
            placeholderTextColor={theme === "dark" ? "#6b6b6b" : "#cdcdcd"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <Pressable
            onPress={() => navigation.navigate("ForgotPassword")}
            style={currentStyles.forgotPasswordContainer}
          >
            <Text style={currentStyles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
          <Text style={currentStyles.inputHeader}>Password</Text>
          <View style={currentStyles.passwordContainer}>
            <TextInput
              style={currentStyles.input}
              placeholder="••••••••••"
              placeholderTextColor={theme === "dark" ? "#6b6b6b" : "#cdcdcd"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              editable={!loading}
            />
            <Pressable
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={currentStyles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </Pressable>
          </View>
          <Pressable style={currentStyles.button} onPress={handleLogin}>
            <Text style={currentStyles.buttonText}>Login</Text>
          </Pressable>
          {errorMessage && (
            <Text style={currentStyles.errorText}>{errorMessage}</Text>
          )}
          <View style={currentStyles.dividerContainer}>
            <View style={currentStyles.divider} />
            <Text style={currentStyles.dividerText}>or sign in with</Text>
            <View style={currentStyles.divider} />
          </View>
          <View style={currentStyles.socialIconsContainer}>
            <Pressable
              style={currentStyles.iconButton}
              onPress={() => console.log("Google Sign-In")}
            >
              <Ionicons name="logo-google" size={22} color="grey" />
            </Pressable>
            <Pressable
              style={currentStyles.iconButton}
              onPress={() => console.log("Apple Sign-In")}
            >
              <Ionicons name="logo-apple" size={22} color="grey" />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text style={currentStyles.createAccountText}>Create an account</Text>
        </Pressable>
      </ScrollView>

      {loading && (
        <View style={currentStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#A463FF" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default UserAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 100,
    color: "#000",
  },
  loginContainer: { marginTop: 60 },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#777",
    backgroundColor: "#fff",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    top: 20,
    zIndex: 10,
  },
  forgotPassword: {
    color: "#A463FF",
    fontSize: 14,
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
    backgroundColor: "#A463FF",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
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
    backgroundColor: "#888",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#888",
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
    color: "#A463FF",
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

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 100,
    color: "#fff",
  },
  loginContainer: { marginTop: 60 },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#1e1e1e",
    color: "white",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    top: 20,
    zIndex: 10,
  },
  forgotPassword: {
    color: "#A463FF",
    fontSize: 14,
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
    backgroundColor: "#A463FF",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
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
    backgroundColor: "#888",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#888",
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
    color: "#A463FF",
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
