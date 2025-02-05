import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import {
  deleteDoc,
  doc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { useTheme } from "../../../context/themeContext";

const DeleteAccount: React.FC = () => {
  const { currentTheme } = useTheme();
  // State for tracking user's deletion reason and credentials
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Predefined list of reasons for account deletion
  const reasons = [
    "Switching to another app",
    "Privacy concerns",
    "App is too complicated",
    "Found a better alternative",
    "Other",
  ];

  // Handle the account deletion process
  const handleDeleteAccount = async () => {
    // Get the final reason (either selected or custom)
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

    try {
      let credential;

      // Handle different authentication methods (Google vs Email)
      if (
        user.providerData.some(
          (provider) => provider.providerId === "google.com"
        )
      ) {
        const googleCredential = GoogleAuthProvider.credential(
          user.refreshToken
        );
        credential = googleCredential;
      } else {
        if (!password) {
          Alert.alert("Error", "Please enter your password.");
          return;
        }
        const email = user.email;
        credential = EmailAuthProvider.credential(email!, password);
      }

      // Re-authenticate user before deletion
      await reauthenticateWithCredential(user, credential);

      // Show final confirmation dialog
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

                // Helper function to recursively delete subcollections
                const deleteSubcollections = async (docRef: any) => {
                  const subcollectionNames = [
                    "subcollection1",
                    "subcollection2",
                  ];
                  for (const name of subcollectionNames) {
                    const subcollectionRef = collection(docRef, name);
                    const subcollectionDocs = await getDocs(subcollectionRef);
                    for (const doc of subcollectionDocs.docs) {
                      await deleteSubcollections(doc.ref);
                      await deleteDoc(doc.ref);
                    }
                  }
                };

                // Delete user data from Firestore
                const userDocRef = doc(FIREBASE_DB, "users", userId!);
                await deleteSubcollections(userDocRef);
                await deleteDoc(userDocRef);

                // Log deletion reason
                const deletionDocRef = doc(
                  FIREBASE_DB,
                  "accountDeletions",
                  userId!
                );
                await setDoc(deletionDocRef, {
                  reason: reasonToSubmit,
                  deletedAt: new Date().toISOString(),
                });

                // Delete the user account
                await user.delete();
                Alert.alert(
                  "Account Deleted",
                  "Your account and all associated data have been deleted."
                );
              } catch (error) {
                console.error("Error deleting account:", error);
                Alert.alert(
                  "Error",
                  "There was an issue deleting your account."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Reauthentication error:", error);
      Alert.alert(
        "Error",
        "Re-authentication failed. Please ensure your credentials are correct."
      );
    }
  };

  // Check if user is signed in with Google
  const isGoogleSignIn = FIREBASE_AUTH.currentUser?.providerData.some(
    (provider) => provider.providerId === "google.com"
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Delete Account
        </Text>
        <Text style={[styles.subTitle, { color: currentTheme.textSecondary }]}>
          We're sorry to see you go. Please let us know why you're leaving:
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {reasons.map((reason, index) => (
          <Pressable
            key={index}
            style={[
              styles.radioContainer,
              {
                backgroundColor:
                  selectedReason === reason
                    ? currentTheme.alternate + "20"
                    : "transparent",
                borderColor:
                  selectedReason === reason
                    ? currentTheme.alternate
                    : currentTheme.inactive,
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

        {selectedReason === "Other" && (
          <TextInput
            style={[
              styles.textInput,
              {
                color: currentTheme.textPrimary,
                borderColor: currentTheme.inactive,
                backgroundColor: currentTheme.accentBackground,
              },
            ]}
            placeholder="Please specify your reason"
            placeholderTextColor={currentTheme.secondary}
            value={otherReason}
            onChangeText={(text) => setOtherReason(text)}
            multiline
          />
        )}

        {!isGoogleSignIn && (
          <TextInput
            style={[
              styles.textInput,
              {
                color: currentTheme.textPrimary,
                borderColor: currentTheme.inactive,
                backgroundColor: currentTheme.accentBackground,
                marginTop: 20,
              },
            ]}
            placeholder="Enter password to confirm"
            placeholderTextColor={currentTheme.secondary}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
        )}

        <Pressable
          style={[
            styles.deleteButton,
            {
              backgroundColor: "#FF3B30" + "20",
            },
          ]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: "outfit",
    lineHeight: 22,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: "outfit",
  },
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: "outfit",
    minHeight: 50,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#FF3B30",
  },
});
