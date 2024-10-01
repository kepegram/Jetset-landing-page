import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useProfile } from "./profileContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase auth
import { FIREBASE_DB } from "../../../../firebase.config"; // Firebase Firestore configuration

type EditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Edit"
>;

const Edit: React.FC = () => {
  const navigation = useNavigation<EditScreenNavigationProp>();
  const { profilePicture, setProfilePicture } = useProfile();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    profilePicture
  );
  const [userName, setUserName] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string>("********");

  // Fetch user data from Firestore on load
  useEffect(() => {
    const fetchUserData = async () => {
      const user = getAuth().currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data?.name || "");
            setEmail(data?.email || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setProfilePicture(uri);

      // Save profile picture to Firestore
      const user = getAuth().currentUser;
      if (user) {
        try {
          await setDoc(
            doc(FIREBASE_DB, "users", user.uid),
            { profilePicture: uri },
            { merge: true }
          );
          console.log("Profile picture updated successfully in Firestore.");
        } catch (error) {
          console.error("Failed to save profile picture to Firestore:", error);
        }
      }

      await AsyncStorage.setItem("profilePicture", uri);
    }
  };

  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        // Save updated information to Firestore
        await setDoc(
          doc(FIREBASE_DB, "users", user.uid),
          { name: userName, email: email, profilePicture: selectedImage },
          { merge: true }
        );
        console.log("Profile information updated successfully.");
        navigation.navigate("Profile");
      } catch (error) {
        console.error("Error saving profile data:", error);
      }
    }
  };

  const handleCancel = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      {/* Back button and Settings Icon */}
      <View style={styles.topIcons}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </Pressable>
        <Pressable
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings-sharp" size={28} color="#000" />
        </Pressable>
      </View>

      <Text style={styles.title}>Edit Profile</Text>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Pressable onPress={handlePickImage}>
          <Image
            source={{ uri: selectedImage || profilePicture }}
            style={styles.profilePicture}
          />
          <MaterialIcons
            name="edit"
            size={24}
            color="white"
            style={styles.editIcon}
          />
        </Pressable>
      </View>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userName || ""}
        onChangeText={setUserName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email || ""}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.buttonCancel} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.buttonSave} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
    alignItems: "center",
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    flex: 1,
  },
  settingsButton: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 100,
    color: "#333",
    marginBottom: 30,
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 2,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  buttonCancel: {
    flex: 1,
    borderColor: "orange",
    borderWidth: 2,
    padding: 15,
    borderRadius: 25,
    marginRight: 10,
  },
  buttonSave: {
    flex: 1,
    backgroundColor: "#A463FF",
    padding: 15,
    borderRadius: 25,
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
