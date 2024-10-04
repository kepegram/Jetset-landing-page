import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Modal,
  Button,
  Appearance,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons"; // Ensure Ionicons is imported
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase auth
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"bucketlists" | "memories">(
    "bucketlists"
  );

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
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

  const handleTabPress = (tab: "bucketlists" | "memories") => {
    setActiveTab(tab);
  };

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.headerContent}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color={theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Ionicons
            name="settings-sharp"
            size={30}
            color={theme === "dark" ? "white" : "black"}
          />
        </Pressable>
      </View>
      <View style={currentStyles.profileContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: profilePicture }}
            style={currentStyles.profilePicture}
          />
        </Pressable>

        {userName && <Text style={currentStyles.userName}>{userName}</Text>}
        <Text style={currentStyles.mottoText}>" "</Text>
      </View>
      <View style={currentStyles.iconsContainer}>
        <Pressable
          onPress={() => handleTabPress("bucketlists")}
          style={currentStyles.iconItem}
        >
          <MaterialIcons
            name="list"
            size={30}
            color={
              activeTab === "bucketlists"
                ? "#A463FF"
                : theme === "dark"
                ? "white"
                : "black"
            }
          />
          <Text
            style={[
              currentStyles.iconText,
              {
                color:
                  activeTab === "bucketlists"
                    ? "#A463FF"
                    : theme === "dark"
                    ? "white"
                    : "black",
              },
            ]}
          >
            Bucketlists
          </Text>
        </Pressable>

        <View style={currentStyles.separator} />

        <Pressable
          onPress={() => handleTabPress("memories")}
          style={currentStyles.iconItem}
        >
          <MaterialIcons
            name="photo-library"
            size={30}
            color={
              activeTab === "memories"
                ? "#A463FF"
                : theme === "dark"
                ? "white"
                : "black"
            }
          />
          <Text
            style={[
              currentStyles.iconText,
              {
                color:
                  activeTab === "memories"
                    ? "#A463FF"
                    : theme === "dark"
                    ? "white"
                    : "black",
              },
            ]}
          >
            Memories
          </Text>
        </Pressable>
      </View>

      {/* Unique Add New Buttons with Plus Icons */}
      <View style={currentStyles.buttonContainer}>
        {activeTab === "bucketlists" ? (
          <Pressable
            style={currentStyles.bucketlistButton}
            onPress={() => navigation.navigate("Home")}
          >
            <AntDesign name="pluscircleo" size={21} color="#999" />
            <Text style={currentStyles.addButtonText}>Add New Bucketlist</Text>
          </Pressable>
        ) : (
          <Pressable
            style={currentStyles.memoryButton}
            onPress={() => navigation.navigate("Memories")}
          >
            <AntDesign name="pluscircleo" size={21} color="#999" />
            <Text style={currentStyles.addButtonText}>Add New Memory</Text>
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
          style={currentStyles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={currentStyles.modalContent}>
            <Image
              source={{ uri: profilePicture }}
              style={currentStyles.modalImage}
            />
            <Button
              title="Edit"
              color={"white"}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Edit");
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bucketlistButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
  },
  memoryButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 200,
    marginBottom: 20,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#121212",
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
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  mottoText: {
    fontSize: 16,
    marginTop: 10,
    color: "#fff",
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
    backgroundColor: "#999",
    marginHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bucketlistButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
  },
  memoryButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 200,
    marginBottom: 20,
  },
});
