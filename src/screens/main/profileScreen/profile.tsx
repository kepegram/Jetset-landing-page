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
import React, { useCallback, useState } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useProfile } from "./profileContext";
import { FIREBASE_DB } from "../../../../firebase.config";
import { useTheme } from "./themeContext";
import { Dimensions } from "react-native";

// Inside your component
const { width } = Dimensions.get("window");

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture } = useProfile();
  const { theme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"bucketlists" | "memories">(
    "bucketlists"
  );
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any[]>([]);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const fetchPlannerData = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const querySnapshot = await getDocs(
        collection(FIREBASE_DB, `users/${user.uid}/bucketlist`)
      );
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTripData(trips);
    } catch (error) {
      console.error("Error fetching planner data: ", error);
    } finally {
      setLoading(false);
    }
  };

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
      fetchPlannerData();
    }, [])
  );

  const handleTabPress = (tab: "bucketlists" | "memories") => {
    setActiveTab(tab);
  };

  const currentStyles = theme === "dark" ? darkStyles : styles;

  const renderTripItem = ({ item }) => (
    <Pressable
      style={currentStyles.tripItem}
      onPress={() => navigation.navigate("TripBuilder", { tripDetails: item })}
    >
      <Image source={{ uri: item.image }} style={currentStyles.tripImage} />
      <View style={currentStyles.tripDetails}>
        <Text style={currentStyles.tripLocation}>{item.address}</Text>
        <Text style={currentStyles.tripAddress}>{item.location}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.profileContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: profilePicture }}
            style={currentStyles.profilePicture}
          />
        </Pressable>

        {userName && <Text style={currentStyles.userName}>{userName}</Text>}
      </View>
      <View style={currentStyles.iconsContainer}>
        <Pressable
          onPress={() => handleTabPress("bucketlists")}
          style={currentStyles.iconItem}
        >
          <FontAwesome
            name="plane"
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

      {/* FlatList for bucketlists */}
      <View style={currentStyles.listContainer}>
        {loading ? (
          <Text style={currentStyles.loadingText}>Loading...</Text>
        ) : activeTab === "bucketlists" ? (
          tripData.length > 0 ? (
            <FlatList
              data={tripData}
              renderItem={renderTripItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={currentStyles.flatListContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={currentStyles.noListsText}>No lists available.</Text>
          )
        ) : null}
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
          <Image
            source={{ uri: profilePicture }}
            style={currentStyles.modalImage}
          />
          <Button
            title="Edit"
            color={theme === "dark" ? "white" : "black"}
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
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
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
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  iconItem: {
    alignItems: "center",
    marginHorizontal: 10, // Spacing between icons
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    height: 20,
    width: 1,
    backgroundColor: "#333",
    marginHorizontal: 10, // Adjust separator spacing
  },
  listContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20, // Padding for better spacing
  },
  flatListContent: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  tripItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: width * 0.9,
  },
  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  tripDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  tripLocation: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tripAddress: {
    fontSize: 14,
    color: "#555",
  },
  noListsText: {
    color: "#777",
    fontSize: 16,
    textAlign: "center", // Center the text
  },
  loadingText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center", // Center the loading text
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Semi-transparent background
  },
  modalImage: {
    width: 350,
    height: 350,
    borderRadius: 200,
    marginBottom: 15,
  },
});

// Dark Theme Styles
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
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
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  iconItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff", // Ensure the text is visible in dark mode
  },
  separator: {
    height: 20,
    width: 1,
    backgroundColor: "#fff", // White separator for dark mode
    marginHorizontal: 10,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  tripItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444", // Darker line for separation
    marginBottom: 10,
    backgroundColor: "#222", // Darker background for trip items
    borderRadius: 10,
    width: width * 0.9,
  },
  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  tripDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  tripLocation: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Ensure the text is visible in dark mode
  },
  tripAddress: {
    fontSize: 14,
    color: "#aaa", // Lighter text for address
  },
  noListsText: {
    color: "#bbb", // Lighter text for dark mode
    fontSize: 16,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#bbb", // Lighter text for loading message
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
});
