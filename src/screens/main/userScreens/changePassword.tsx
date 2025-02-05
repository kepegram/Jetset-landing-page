import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AltButton, CustomButton } from "../../../components/ui/button";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";

// Navigation prop type for the ChangePassword screen
type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePassword"
>;

const ChangePassword: React.FC = () => {
  const { currentTheme } = useTheme();
  // State for managing form inputs and visibility
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [oldPasswordHidden, setOldPasswordHidden] = useState<boolean>(true);
  const [newPasswordHidden, setNewPasswordHidden] = useState<boolean>(true);
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();

  // Fetch user email on component mount
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

  // Handle password update
  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (user && email && password) {
      try {
        // Re-authenticate user with current password
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        console.log("User reauthenticated successfully.");

        // Update to new password if provided
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

  // Handle canceling password change
  const handleCancel = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.contentContainer}>
        {/* Current password input */}
        <View style={styles.formContainer}>
          <Text
            style={[styles.inputLabel, { color: currentTheme.textPrimary }]}
          >
            Current Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: currentTheme.inactive,
                backgroundColor:
                  currentTheme.background === "#FFFFFF" ? "#F5F5F5" : "#2A2A2A",
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: currentTheme.textPrimary }]}
              placeholder="Enter current password"
              placeholderTextColor={currentTheme.secondary}
              value={password}
              secureTextEntry={oldPasswordHidden}
              onChangeText={setPassword}
            />
            {/* Toggle password visibility button */}
            <Pressable
              style={styles.eyeButton}
              onPress={() => setOldPasswordHidden(!oldPasswordHidden)}
            >
              <Ionicons
                name={oldPasswordHidden ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={currentTheme.inactive}
              />
            </Pressable>
          </View>

          {/* New password input */}
          <Text
            style={[styles.inputLabel, { color: currentTheme.textPrimary }]}
          >
            New Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: currentTheme.inactive,
                backgroundColor:
                  currentTheme.background === "#FFFFFF" ? "#F5F5F5" : "#2A2A2A",
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: currentTheme.textPrimary }]}
              placeholder="Enter new password"
              placeholderTextColor={currentTheme.secondary}
              value={newPassword}
              secureTextEntry={newPasswordHidden}
              onChangeText={setNewPassword}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setNewPasswordHidden(!newPasswordHidden)}
            >
              <Ionicons
                name={newPasswordHidden ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={currentTheme.inactive}
              />
            </Pressable>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton onPress={handleCancel} buttonText="Cancel" />
          <AltButton onPress={handleSave} buttonText="Save" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  formContainer: {
    width: "100%",
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: "outfit-medium",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit",
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    gap: 12,
  },
});
