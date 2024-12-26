import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useProfile } from "../../../context/profileContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "../../../../firebase.config";
import { CustomButton, AltButton } from "../../../components/ui/button";
import { useTheme } from "../../../context/themeContext";

type EditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Edit"
>;

const Edit: React.FC = () => {
  const { currentTheme } = useTheme();
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
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
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
            color={currentTheme.buttonText}
            style={[
              styles.editIcon,
              { backgroundColor: currentTheme.alternate },
            ]}
          />
        </Pressable>
      </View>

      {/* Name Input with Title */}
      <Text style={[styles.inputLabel, { color: currentTheme.textPrimary }]}>
        Name
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              color: currentTheme.textPrimary,
              borderColor: currentTheme.inactive,
            },
          ]}
          placeholder="Enter your name"
          placeholderTextColor={currentTheme.inactive}
          value={userName || ""}
          onChangeText={setUserName}
        />
      </View>

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <CustomButton onPress={handleCancel} buttonText="Cancel" />
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
  profilePictureContainer: {
    position: "relative",
    marginTop: 20,
    marginBottom: 20,
  },
  profilePicture: {
    width: 220,
    height: 220,
    borderRadius: 120,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 30,
    borderRadius: 22,
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 16,
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
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
  },
});
