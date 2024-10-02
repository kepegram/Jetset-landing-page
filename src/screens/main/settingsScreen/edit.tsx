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
import { Button, AltButton } from "../../../components/button";

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
          { name: userName, profilePicture: selectedImage },
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
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.container}>
      {/* Back button and Settings Icon */}
      <View style={styles.topIcons}>
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="arrow-back" size={28} color="#000" />
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
            size={34}
            color="white"
            style={styles.editIcon}
          />
        </Pressable>
      </View>

      {/* Name Input with Title */}
      <Text style={styles.inputLabel}>Name</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={userName || ""}
          onChangeText={setUserName}
        />
      </View>

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <Button onPress={handleCancel} buttonText="Cancel" />
        <AltButton onPress={handleSave} buttonText="Save" />
      </View>
    </View>
  );
};

export default Edit;

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
    marginRight: 200,
    color: "#333",
    marginBottom: 20,
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profilePicture: {
    width: 220,
    height: 220,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 30,
    backgroundColor: "#A463FF",
    borderRadius: 22,
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#333",
    marginTop: 20,
    marginLeft: 25,
  },
  inputWrapper: {
    flexDirection: "row", // Align icon and input horizontally
    alignItems: "center", // Center align vertically
  },
  input: {
    width: "90%", // Allow input to take up remaining space
    padding: 15,
    marginVertical: 5,
    borderColor: "#ddd",
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
  },
});
