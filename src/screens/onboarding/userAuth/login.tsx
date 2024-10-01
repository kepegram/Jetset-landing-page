import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate("AppTabNav");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("UserAuth")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        <Image
          style={styles.image}
          source={require("../../../../assets/onboarding-imgs/undraw_Mobile_login_re_9ntv.png")}
        />
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"#9f9f9f"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading} // Disable input when loading
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"#9f9f9f"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading} // Disable input when loading
        />

        {!loading ? (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}

        <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#A463FF" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    color: "#000",
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
  forgotPassword: {
    color: "#A463FF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
    zIndex: 20,
  },
});
