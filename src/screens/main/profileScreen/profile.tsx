import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Modal,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useProfile } from "./profileContext";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture } = useProfile();
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const name = await AsyncStorage.getItem("userName");
        setUserName(name);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Pressable
          style={styles.icon}
          onPress={() => navigation.navigate("Edit")}
        >
          <MaterialIcons name="edit" size={30} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.icon}
          onPress={() => navigation.navigate("Settings")}
        >
          <MaterialIcons name="settings" size={30} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.profileContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        </Pressable>
        {userName && <Text style={styles.userName}>{userName}</Text>}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={{ uri: profilePicture }} style={styles.modalImage} />
            <Button
              title="Edit"
              color={"black"}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Edit");
              }}
            />
            <Button
              title="Close"
              color={"red"}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    top: 60,
  },
  icon: {
    padding: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});
