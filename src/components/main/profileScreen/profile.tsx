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
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appTabNav";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [headerColors, setHeaderColors] = useState<string[]>([
    "#A463FF",
    "#6a00fe",
  ]);
  const [profilePicture, setProfilePicture] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem("userName");
      setUserName(name);
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={headerColors} style={styles.header}>
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
      </LinearGradient>

      <View style={styles.profileContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        </Pressable>
        {userName && <Text style={styles.userName}>{userName}</Text>}
      </View>

      {/* Modal for the profile picture */}
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
              color={"black"}
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
    backgroundColor: "#dadada",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    top: 60,
  },
  profileContainer: {
    alignItems: "center",
    bottom: "25%",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 10,
  },
});
