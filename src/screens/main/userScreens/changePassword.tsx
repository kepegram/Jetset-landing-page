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

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePassword"
>;

const ChangePassword: React.FC = () => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [oldPasswordHidden, setOldPasswordHidden] = useState<boolean>(true);
  const [newPasswordHidden, setNewPasswordHidden] = useState<boolean>(true);
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text
            style={[styles.inputLabel, { color: currentTheme.textPrimary }]}
          >
            Current Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { borderColor: currentTheme.inactive },
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

          <Text
            style={[styles.inputLabel, { color: currentTheme.textPrimary }]}
          >
            New Password
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { borderColor: currentTheme.inactive },
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
    padding: 20,
  },
  formContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "outfit",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "outfit",
  },
  eyeButton: {
    padding: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingHorizontal: 20,
  },
});
