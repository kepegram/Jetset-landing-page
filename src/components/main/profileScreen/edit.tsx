import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appTabNav";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useProfile } from "./profileContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type EditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Edit"
>;

const Edit: React.FC = () => {
  const navigation = useNavigation<EditScreenNavigationProp>();
  const { setProfilePicture, headerColors, setHeaderColors } = useProfile();
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
      setSelectedImage(result.assets[0].uri);
      setProfilePicture(result.assets[0].uri);
      await AsyncStorage.setItem("profilePicture", result.assets[0].uri);
      navigation.navigate("Profile");
    }
  };

  const handleChangeColor = async (color: string) => {
    setHeaderColors([color, "#6a00fe"]); // Update colors
    await AsyncStorage.setItem(
      "headerColors",
      JSON.stringify([color, "#6a00fe"])
    );
    navigation.navigate("Profile");
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

      {/* Color Selection Section */}
      <Text style={styles.colorTitle}>Select Header Color:</Text>
      <View style={styles.colorContainer}>
        {[
          "#FF0000",
          "#FF7F00",
          "#FFFF00",
          "#00FF00",
          "#0000FF",
          "#4B0082",
          "#9400D3",
        ].map((color) => (
          <Pressable
            key={color}
            onPress={() => handleChangeColor(color)}
            style={[styles.colorBox, { backgroundColor: color }]}
          />
        ))}
      </View>
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
  colorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  colorBox: {
    width: 50,
    height: 50,
    margin: 8,
    borderRadius: 25,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
