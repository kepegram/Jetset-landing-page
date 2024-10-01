import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Modal,
  Button,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  const [activeTab, setActiveTab] = useState<"bucketlists" | "memories">(
    "bucketlists"
  );

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

  const handleTabPress = (tab: "bucketlists" | "memories") => {
    setActiveTab(tab);
  };

  const bucketlistData = [
    {
      id: "1",
      text: "Visit the Eiffel Tower",
      image: "https://via.placeholder.com/100",
    },
    {
      id: "2",
      text: "Swim in the Great Barrier Reef",
      image: "https://via.placeholder.com/100",
    },
    {
      id: "3",
      text: "Hike the Grand Canyon",
      image: "https://via.placeholder.com/100",
    },
  ];

  const memoriesData = [
    { id: "1", text: "Trip to Bali", image: "https://via.placeholder.com/100" },
    {
      id: "2",
      text: "Safari in Kenya",
      image: "https://via.placeholder.com/100",
    },
    {
      id: "3",
      text: "New Year's Eve in Times Square",
      image: "https://via.placeholder.com/100",
    },
  ];

  const renderItem = ({
    item,
  }: {
    item: { id: string; text: string; image: string };
  }) => (
    <View
      style={activeTab === "memories" ? styles.memoryItem : styles.listItem}
    >
      <Image
        source={{ uri: item.image }}
        style={activeTab === "memories" ? styles.memoryImage : styles.listImage}
      />
      <Text
        style={activeTab === "memories" ? styles.memoryText : styles.listText}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Pressable style={styles.icon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </Pressable>
        <Pressable
          style={styles.icon}
          onPress={() => navigation.navigate("Edit")}
        >
          <MaterialIcons name="edit" size={30} color="black" />
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
        {/* Make this a random travel quote (fetch from travel quote API) */}
        <Text style={styles.mottoText}>Become Jetset Today</Text>
      </View>

      <View style={styles.iconsContainer}>
        <Pressable
          onPress={() => handleTabPress("bucketlists")}
          style={styles.iconItem}
        >
          <MaterialIcons
            name="list"
            size={40}
            color={activeTab === "bucketlists" ? "orange" : "black"}
          />
          <Text
            style={[
              styles.iconText,
              { color: activeTab === "bucketlists" ? "orange" : "black" },
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
            size={40}
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

      <FlatList
        data={activeTab === "bucketlists" ? bucketlistData : memoriesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />

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
        </Pressable>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    top: 60,
  },
  icon: {
    padding: 10,
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
    fontSize: 22,
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
    height: 30,
    width: 1,
    backgroundColor: "#333",
    marginHorizontal: 20,
  },
  flatList: {
    marginTop: 30,
    width: "100%",
  },

  // Bucketlists styling
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  listText: {
    fontSize: 18,
    color: "#333",
  },

  // Memories styling
  memoryItem: {
    padding: 10,
    alignItems: "center", // Center the content
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  memoryImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  memoryText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
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
    width: 300,
    height: 300,
    borderRadius: 200,
    marginBottom: 20,
  },
});
