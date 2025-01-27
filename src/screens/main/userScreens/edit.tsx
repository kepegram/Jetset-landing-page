import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[styles.headerText, { color: currentTheme.textPrimary }]}
          >
            Edit Profile
          </Text>
        </View>

        <View style={styles.profilePictureContainer}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.imageWrapper}
          >
            <Image
              source={{ uri: selectedImage || profilePicture }}
              style={styles.profilePicture}
            />
            <View
              style={[
                styles.editIconContainer,
                { backgroundColor: currentTheme.alternate },
              ]}
            >
              <MaterialIcons
                name="edit"
                size={24}
                color={currentTheme.buttonText}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text
            style={[styles.inputLabel, { color: currentTheme.textPrimary }]}
          >
            Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.textPrimary,
                backgroundColor: currentTheme.background,
              },
            ]}
            placeholder="Enter your name"
            placeholderTextColor={currentTheme.inactive}
            value={userName || ""}
            onChangeText={setUserName}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={handleCancel}
          buttonText="Cancel"
          style={styles.button}
        />
        <AltButton
          onPress={handleSave}
          buttonText="Save Changes"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 28,
    fontFamily: "outfit-bold",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  profilePicture: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "outfit-medium",
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: "outfit",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingBottom: 34,
    backgroundColor: "transparent",
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
