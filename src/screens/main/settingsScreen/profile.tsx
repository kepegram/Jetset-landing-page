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
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons"; // Ensure Ionicons is imported
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase auth
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useProfile } from "./profileContext";
import { FIREBASE_DB } from "../../../../firebase.config";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture } = useProfile();
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"bucketlists" | "memories">(
    "bucketlists"
  );

  const navigation = useNavigation<ProfileScreenNavigationProp>();

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

  const handleTabPress = (tab: "bucketlists" | "memories") => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-sharp" size={30} color="black" />
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
        <Text style={styles.mottoText}>Become Jetset Today</Text>
      </View>
      <View style={styles.iconsContainer}>
        <Pressable
          onPress={() => handleTabPress("bucketlists")}
          style={styles.iconItem}
        >
          <MaterialIcons
            name="list"
            size={30}
            color={activeTab === "bucketlists" ? "#A463FF" : "black"}
          />
          <Text
            style={[
              styles.iconText,
              { color: activeTab === "bucketlists" ? "#A463FF" : "black" },
            ]}
          >
            Bucketlists
          </Text>
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          onPress={() => handleTabPress("memories")}
          style={styles.iconItem}
        >
          <MaterialIcons
            name="photo-library"
            size={30}
            color={activeTab === "memories" ? "#A463FF" : "black"}
          />
          <Text
            style={[
              styles.iconText,
              { color: activeTab === "memories" ? "#A463FF" : "black" },
            ]}
          >
            Memories
          </Text>
        </Pressable>
      </View>

      {/* Unique Add New Buttons with Plus Icons */}
      <View style={styles.buttonContainer}>
        {activeTab === "bucketlists" ? (
          <Pressable
            style={styles.bucketlistButton} // Unique style for bucketlist button
            onPress={
              () => navigation.navigate("Home") // Navigates to a stack screen
            }
          >
            <AntDesign name="pluscircleo" size={21} color="#999" />
            <Text style={styles.addButtonText}>Add New Bucketlist</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.memoryButton} // Unique style for memory button
            onPress={
              () => navigation.navigate("Memories") // Navigates to bottom tab screen
            }
          >
            <AntDesign name="pluscircleo" size={21} color="#999" />
            <Text style={styles.addButtonText}>Add New Memory</Text>
          </Pressable>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Image source={{ uri: profilePicture }} style={styles.modalImage} />
            <Button
              title="Edit"
              color={"white"}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Edit"); // Navigate to Edit stack screen
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    marginTop: 60,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  mottoText: {
    fontSize: 16,
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  iconItem: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 20,
    width: 1,
    backgroundColor: "#333",
    marginHorizontal: 20,
  },
  buttonContainer: {
    flex: 1, // Allow the container to grow and center the buttons
    justifyContent: "center", // Center buttons vertically
    alignItems: "center", // Center buttons horizontally
    width: "100%",
  },
  bucketlistButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20, // Space below the button
    alignItems: "center",
    width: "80%", // Adjust as necessary
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center", // Center content
  },
  memoryButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20, // Space below the button
    alignItems: "center",
    width: "80%", // Adjust as necessary
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center", // Center content
  },
  addButtonText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 10, // Space between icon and text
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 200,
    marginBottom: 20,
  },
});
