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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to track error messages
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<UserAuthScreenNavigationProp>();

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

  const handleLogin = async () => {
    setErrorMessage(null); // Reset error message

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
      setErrorMessage("Login failed. Please try again."); // Set error message on login failure
    } finally {
      setLoading(false);
    }
  };

  const currentStyles = theme === "dark" ? darkStyles : styles; // Determine which styles to use based on theme

  return (
    <KeyboardAvoidingView
      style={currentStyles.container} // Use currentStyles here
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={currentStyles.scrollContainer} // Use currentStyles here
        keyboardShouldPersistTaps="handled"
      >
        <View style={currentStyles.topIcons}>
          {/* Use currentStyles here */}
          <Pressable onPress={() => navigation.navigate("Welcome")}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </View>

        <Text style={currentStyles.title}>Login</Text>

        {/* Email Header and Input */}
        <View style={currentStyles.loginContainer}>
          {/* Use currentStyles here */}
          <Text style={currentStyles.inputHeader}>Email</Text>
          <TextInput
            style={currentStyles.input} // Use currentStyles here
            placeholder="user@example.com"
            placeholderTextColor={"#9f9f9f"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading} // Disable input when loading
          />
          {/* Forgot Password above Password Input */}
          <Pressable
            onPress={() => navigation.navigate("ForgotPassword")}
            style={currentStyles.forgotPasswordContainer} // Use currentStyles here
          >
            <Text style={currentStyles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
          {/* Password Header and Input with Show/Hide functionality */}
          <Text style={currentStyles.inputHeader}>Password</Text>
          <View style={currentStyles.passwordContainer}>
            {/* Use currentStyles here */}
            <TextInput
              style={currentStyles.input} // Use currentStyles here
              placeholder="••••••••••"
              placeholderTextColor={"#9f9f9f"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              editable={!loading} // Disable input when loading
            />
            <Pressable
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={currentStyles.eyeIcon} // Use currentStyles here
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </Pressable>
          </View>
          {/* Login Button */}
          <Pressable style={currentStyles.button} onPress={handleLogin}>
            {/* Use currentStyles here */}
            <Text style={currentStyles.buttonText}>Login</Text>
          </Pressable>
          {/* Error Message */}
          {errorMessage && (
            <Text style={currentStyles.errorText}>{errorMessage}</Text>
          )}
          {/* Use currentStyles here */}
          {/* Divider with OR SIGN UP WITH */}
          <View style={currentStyles.dividerContainer}>
            {/* Use currentStyles here */}
            <View style={currentStyles.divider} />
            <Text style={currentStyles.dividerText}>or sign in with</Text>
            <View style={currentStyles.divider} />
          </View>
          {/* Social Icons for Google and Apple Sign-In */}
          <View style={currentStyles.socialIconsContainer}>
            {/* Use currentStyles here */}
            <Pressable
              style={currentStyles.iconButton} // Use currentStyles here
              onPress={() => console.log("Google Sign-In")}
            >
              <Ionicons name="logo-google" size={22} color="grey" />
            </Pressable>
            <Pressable
              style={currentStyles.iconButton} // Use currentStyles here
              onPress={() => console.log("Apple Sign-In")}
            >
              <Ionicons name="logo-apple" size={22} color="grey" />
            </Pressable>
          </View>
        </View>

        {/* Create Account Text */}
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text style={currentStyles.createAccountText}>Create an account</Text>
        </Pressable>
      </ScrollView>

      {loading && (
        <View style={currentStyles.loadingOverlay}>
          {/* Use currentStyles here */}
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
    backgroundColor: "#121212", // Dark background color
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
    color: "#fff", // Light text color for title
  },
  loginContainer: { marginTop: 60 },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff", // Light text color for input header
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444", // Dark border color
    backgroundColor: "#1e1e1e", // Dark background for input
    color: "#fff", // Light text color for input
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
    backgroundColor: "#444", // Dark divider color
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#888", // Light text color for divider text
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
    borderColor: "#444", // Dark border color
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
    backgroundColor: "rgba(18, 18, 18, 0.8)", // Dark overlay
    zIndex: 20,
  },
});
