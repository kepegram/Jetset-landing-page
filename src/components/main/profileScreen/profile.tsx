import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../../firebase.config";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Profile = ({ navigation }: RouterProps) => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          FIREBASE_AUTH.signOut();
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dadada",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  button: {
    backgroundColor: "#000",
    width: "50%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
