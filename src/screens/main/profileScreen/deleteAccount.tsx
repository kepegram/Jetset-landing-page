import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  Appearance,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config"; // import your Firebase config
import { RootStackParamList } from "../tabNavigator/appNav";
import { doc, setDoc } from "firebase/firestore"; // Firestore method
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; // Re-authentication

type DeleteAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DeleteAccount"
>;

const DeleteAccount: React.FC = () => {
  const navigation = useNavigation<DeleteAccountScreenNavigationProp>();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [password, setPassword] = useState<string>(""); // Input for re-authentication

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

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
    const credential = EmailAuthProvider.credential(email!, password); // Re-auth with entered password

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
                // Save the selected reason to Firestore
                const userId = user?.uid;
                const userDocRef = doc(
                  FIREBASE_DB,
                  "accountDeletions",
                  userId!
                );
                await setDoc(userDocRef, {
                  reason: reasonToSubmit,
                  deletedAt: new Date().toISOString(),
                });

                // Step 3: Delete the user's account
                await user.delete();
                Alert.alert(
                  "Account Deleted",
                  "Your account has been deleted."
                );
                //navigation.navigate("Welcome"); // Navigate to welcome/login screen after deletion
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

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      {/* Back Button */}
      <View style={currentStyles.topIcons}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={28}
            color={theme === "dark" ? "white" : "black"}
          />
        </Pressable>
      </View>

      <Text style={currentStyles.title}>Delete Account</Text>
      <Text style={currentStyles.subTitle}>
        Please let us know why you're leaving:
      </Text>

      <ScrollView contentContainerStyle={currentStyles.scrollContainer}>
        {reasons.map((reason, index) => (
          <Pressable
            key={index}
            style={currentStyles.radioContainer}
            onPress={() => setSelectedReason(reason)}
          >
            <Ionicons
              name={
                selectedReason === reason
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color={selectedReason === reason ? "#A463FF" : "#888"}
            />
            <Text style={currentStyles.radioLabel}>{reason}</Text>
          </Pressable>
        ))}

        {/* TextInput for 'Other' reason */}
        {selectedReason === "Other" && (
          <TextInput
            style={currentStyles.textInput}
            placeholder="Please specify your reason"
            placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
            value={otherReason}
            onChangeText={(text) => setOtherReason(text)}
          />
        )}

        {/* Password input for re-authentication */}
        <TextInput
          style={currentStyles.textInput}
          placeholder="Enter password to confirm"
          placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        <Pressable
          style={currentStyles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={currentStyles.deleteButtonText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  topIcons: {
    flexDirection: "row",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 80,
    color: "#333",
  },
  subTitle: {
    fontSize: 18,
    marginVertical: 20,
    color: "#555",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
  },
  deleteButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  topIcons: {
    flexDirection: "row",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 60,
    color: "#fff",
  },
  subTitle: {
    fontSize: 18,
    marginVertical: 20,
    color: "#bbb",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: "#fff",
  },
  textInput: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    fontSize: 16,
    color: "#fff",
  },
  deleteButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});
