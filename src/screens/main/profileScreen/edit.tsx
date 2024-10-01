import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useProfile } from "./profileContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase auth
import { FIREBASE_DB } from "../../../../firebase.config"; // Firebase Firestore configuration

type EditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Edit"
>;

const Edit: React.FC = () => {
  const navigation = useNavigation<EditScreenNavigationProp>();
  const { setProfilePicture } = useProfile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

      // Save profile picture to Firebase Firestore
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
      navigation.navigate("Profile");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </Pressable>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Profile Picture Selection */}
      <Pressable onPress={handlePickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>Select Profile Picture</Text>
      </Pressable>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      )}
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  imageButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    width: 120,
    height: 120,
    marginTop: 20,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 30,
  },
});
