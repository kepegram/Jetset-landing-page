import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AltButton, Button } from "../../../ui/button";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePassword"
>;

const ChangePassword: React.FC = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(true);
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = getAuth().currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setEmail(data?.email || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (user && email && password) {
      try {
        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        console.log("User reauthenticated successfully.");

        // Update password if provided
        if (newPassword) {
          await updatePassword(user, newPassword);
          console.log("Password updated successfully.");
        }

        navigation.navigate("Profile");
        alert("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password:", error);
        alert(error);
      }
    }
  };

  const handleCancel = () => {
    navigation.navigate("Profile");
  };

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      <Text style={currentStyles.inputLabel}>Old Password</Text>
      <View style={currentStyles.inputWrapper}>
        <TextInput
          style={currentStyles.input}
          placeholder="Enter old password"
          placeholderTextColor="#777"
          value={password}
          secureTextEntry={hidden}
          onChangeText={setPassword}
        />
        <Pressable
          style={currentStyles.hiddenButton}
          onPress={() => setHidden(!hidden)}
        >
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#777"
          />
        </Pressable>
      </View>

      <Text style={currentStyles.inputLabel}>New Password</Text>
      <View style={currentStyles.inputWrapper}>
        <TextInput
          style={currentStyles.input}
          placeholder="Enter new password"
          placeholderTextColor="#777"
          value={newPassword}
          secureTextEntry={hidden}
          onChangeText={setNewPassword}
        />
        <Pressable
          style={currentStyles.hiddenButton}
          onPress={() => setHidden(!hidden)}
        >
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#777"
          />
        </Pressable>
      </View>

      <View style={currentStyles.buttonContainer}>
        <Button onPress={handleCancel} buttonText="Cancel" />
        <AltButton onPress={handleSave} buttonText="Save" />
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#333",
    marginTop: 20,
    marginLeft: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: 15,
    marginVertical: 5,
    borderColor: "#ddd",
    borderBottomWidth: 1,
  },
  hiddenButton: {
    padding: 5,
    left: 320,
    position: "absolute",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#121212",
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#fff",
    marginTop: 20,
    marginLeft: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "90%",
    padding: 15,
    marginVertical: 5,
    borderColor: "#ddd",
    borderBottomWidth: 1,
  },
  hiddenButton: {
    padding: 5,
    left: 320,
    position: "absolute",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
  },
});
