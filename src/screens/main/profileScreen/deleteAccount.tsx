import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useTheme } from "../../../context/themeContext";

const DeleteAccount: React.FC = () => {
  const { currentTheme } = useTheme();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const reasons = [
    "Switching to another app",
    "Privacy concerns",
    "App is too complicated",
    "Found a better alternative",
    "Other",
  ];

  const handleDeleteAccount = async () => {
    const reasonToSubmit =
      selectedReason === "Other" ? otherReason : selectedReason;

    if (!reasonToSubmit) {
      Alert.alert(
        "Error",
        "Please select a reason or fill in the 'Other' reason."
      );
      return;
    }

    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    // Step 1: Re-authenticate the user
    const email = user.email;
    const credential = EmailAuthProvider.credential(email!, password);

    try {
      await reauthenticateWithCredential(user, credential);

      // Step 2: Ask for confirmation
      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Delete",
            onPress: async () => {
              try {
                const userId = user?.uid;

                // Delete only the specific user's document from the 'users' collection
                const userDocRef = doc(FIREBASE_DB, "users", userId!);
                await deleteDoc(userDocRef); // This removes just the user's document

                // Optionally, save the account deletion reason to another collection for reference
                const deletionDocRef = doc(
                  FIREBASE_DB,
                  "accountDeletions",
                  userId!
                );
                await setDoc(deletionDocRef, {
                  reason: reasonToSubmit,
                  deletedAt: new Date().toISOString(),
                });

                // Step 3: Delete the user's account from Firebase Auth
                await user.delete();
                Alert.alert(
                  "Account Deleted",
                  "Your account has been deleted."
                );
              } catch (error) {
                Alert.alert("Error", error.message);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Re-authentication failed. Please enter your password correctly."
      );
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.subTitle, { color: currentTheme.textPrimary }]}>
        Please let us know why you're leaving:
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {reasons.map((reason, index) => (
          <Pressable
            key={index}
            style={[
              styles.radioContainer,
              {
                backgroundColor:
                  selectedReason === reason
                    ? currentTheme.background
                    : "transparent",
              },
            ]}
            onPress={() => setSelectedReason(reason)}
          >
            <Ionicons
              name={
                selectedReason === reason
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color={
                selectedReason === reason
                  ? currentTheme.alternate
                  : currentTheme.secondary
              }
            />
            <Text
              style={[styles.radioLabel, { color: currentTheme.textPrimary }]}
            >
              {reason}
            </Text>
          </Pressable>
        ))}

        {/* TextInput for 'Other' reason */}
        {selectedReason === "Other" && (
          <TextInput
            style={[
              styles.textInput,
              {
                color: currentTheme.textPrimary,
                borderColor: currentTheme.inactive,
              },
            ]}
            placeholder="Please specify your reason"
            placeholderTextColor={currentTheme.secondary}
            value={otherReason}
            onChangeText={(text) => setOtherReason(text)}
          />
        )}

        {/* Password input for re-authentication */}
        <TextInput
          style={[
            styles.textInput,
            {
              color: currentTheme.textPrimary,
              borderColor: currentTheme.inactive,
            },
          ]}
          placeholder="Enter password to confirm"
          placeholderTextColor={currentTheme.secondary}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={[styles.deleteButtonText, { color: "red" }]}>
            Delete Account
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  subTitle: {
    fontSize: 18,
    marginVertical: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  textInput: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  deleteButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
