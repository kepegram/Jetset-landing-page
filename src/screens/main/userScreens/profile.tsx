import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Modal,
  Button,
} from "react-native";
import React, { useCallback, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useProfile } from "../../../context/profileContext";
import { FIREBASE_DB } from "../../../../firebase.config";
import { useTheme } from "../../../context/themeContext";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the settings icon

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture, displayName } = useProfile();
  const { currentTheme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.header}>
        <Image
          source={require("../../../assets/placeholder.jpeg")}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <Pressable
          style={styles.settingsIcon}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons
            name="settings-sharp"
            size={28}
            color={currentTheme.textPrimary}
          />
        </Pressable>
        <View style={styles.profileContainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          </Pressable>

          <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>
            {displayName || userName}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
        My Trips
      </Text>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            { backgroundColor: currentTheme.background },
          ]}
          onPress={() => setModalVisible(false)}
        >
          <Image source={{ uri: profilePicture }} style={styles.modalImage} />
          <Button
            title="Edit"
            color={currentTheme.primary}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("Edit");
            }}
          />
        </Pressable>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Added to position overlay and settings icon
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Slight overlay
  },
  settingsIcon: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  profileContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    top: 160,
    left: 0,
    paddingHorizontal: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 40,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    position: "absolute",
    top: "40%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 170,
    textAlign: "center",
    alignSelf: "flex-start",
    paddingLeft: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 350,
    height: 350,
    borderRadius: 200,
    marginBottom: 15,
  },
});
