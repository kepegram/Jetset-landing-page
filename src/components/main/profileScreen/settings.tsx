import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appTabNav";
import { useNavigation } from "@react-navigation/native";

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Settings"
>;

const Settings: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dadada",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  button: {
    backgroundColor: "#000",
    width: "50%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Settings;
