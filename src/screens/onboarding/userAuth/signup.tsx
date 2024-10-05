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
  ScrollView,
  Appearance,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

const SignUp: React.FC = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
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

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

  const handleSignUp = async () => {
    setErrorMessage(null);

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    // Check if passwords match
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
    } catch (err) {
      console.error("Error signing up:", err);
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }
      setErrorMessage("Sign up failed. Please try again.");
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
          <Pressable onPress={() => navigation.navigate("UserAuth")}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </View>

        <Text style={currentStyles.title}>Sign Up</Text>

        <View style={currentStyles.signUpContainer}>
          <Text style={currentStyles.inputHeader}>Name</Text>
          <TextInput
            style={currentStyles.input}
            placeholder="Jane Doe"
            placeholderTextColor={theme === "dark" ? "#6b6b6b" : "#cdcdcd"}
            value={name}
            onChangeText={setName}
            editable={!loading} // Disable input when loading
          />

          <Text style={currentStyles.inputHeader}>Email</Text>
          <TextInput
            style={currentStyles.input}
            placeholder="example@mail.com"
            placeholderTextColor={theme === "dark" ? "#6b6b6b" : "#cdcdcd"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading} // Disable input when loading
          />

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
              editable={!loading} // Disable input when loading
            />
            <Pressable
              style={currentStyles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </Pressable>
          </View>

          <Text style={currentStyles.inputHeader}>Confirm Password</Text>
          <View style={currentStyles.passwordContainer}>
            <TextInput
              style={currentStyles.input}
              placeholder="••••••••••"
              placeholderTextColor={theme === "dark" ? "#6b6b6b" : "#cdcdcd"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              autoCapitalize="none"
              editable={!loading} // Disable input when loading
            />
            <Pressable
              style={currentStyles.eyeIcon}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Ionicons
                name={confirmPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </Pressable>
          </View>

          <Pressable style={currentStyles.button} onPress={handleSignUp}>
            <Text style={currentStyles.buttonText}>Sign Up</Text>
          </Pressable>
          {errorMessage && (
            <Text style={currentStyles.errorText}>{errorMessage}</Text>
          )}
        </View>

        <View style={currentStyles.dividerContainer}>
          <View style={currentStyles.divider} />
          <Text style={currentStyles.dividerText}>or sign up with</Text>
          <View style={currentStyles.divider} />
        </View>

        <View style={currentStyles.socialIconsContainer}>
          <Pressable
            style={currentStyles.iconButton}
            onPress={() => Alert.alert("Google Sign-In")}
          >
            <Ionicons name="logo-google" size={22} color="grey" />
          </Pressable>

          <Pressable
            style={currentStyles.iconButton}
            onPress={() => Alert.alert("Apple Sign-In")}
          >
            <Ionicons name="logo-apple" size={22} color="grey" />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate("UserAuth")}>
          <Text style={currentStyles.createAccountText}>
            Already a member?
            <Text style={currentStyles.loginText}> Log in</Text>
          </Text>
        </Pressable>

        {loading && (
          <View style={currentStyles.loadingOverlay}>
            <ActivityIndicator size="large" color="#A463FF" />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

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
    marginTop: 80,
    color: "#333",
  },
  signUpContainer: { marginTop: 40 },
  inputHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#b3b3b3",
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
    marginTop: 15,
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
    marginVertical: 5,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
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
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  loginText: {
    color: "#A463FF",
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
    marginTop: 80,
    color: "#fff",
  },
  signUpContainer: { marginTop: 40 },
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
    color: "#fff",
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
    marginTop: 15,
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
    marginVertical: 5,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
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
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  loginText: {
    color: "#A463FF",
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 20,
  },
});
