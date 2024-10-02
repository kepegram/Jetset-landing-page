import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AltButton, Button } from "../../../components/button";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { FIREBASE_DB } from "../../../../firebase.config";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation } from "@react-navigation/native";

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePassword"
>;

const ChangePassword: React.FC = () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.topIcons}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </Pressable>
      </View>

      <Text style={styles.title}>Change Password</Text>

      
        <Text style={styles.inputLabel}>Old Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter old password"
            value={password}
            secureTextEntry={hidden}
            onChangeText={setPassword}
          />
          <Pressable
            style={styles.hiddenButton}
            onPress={() => setHidden(!hidden)}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="black"
            />
          </Pressable>
        </View>

        <Text style={styles.inputLabel}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            secureTextEntry={hidden}
            onChangeText={setNewPassword}
          />
          <Pressable
            style={styles.hiddenButton}
            onPress={() => setHidden(!hidden)}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="black"
            />
          </Pressable>
        </View>

      <View style={styles.buttonContainer}>
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
    marginTop: 110,
    marginRight: 100,
    color: "#333",
    marginBottom: 20,
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
    width: "90%", // Allow input to take up remaining space
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
