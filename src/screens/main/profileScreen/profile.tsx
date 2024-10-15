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

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture } = useProfile();
  const { theme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"trips" | "memories">("trips");
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any[]>([]);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const fetchPlannerData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, "bucketlist"));
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

  const handleTabPress = (tab: "trips" | "memories") => {
    setActiveTab(tab);
  };

  const currentStyles = theme === "dark" ? darkStyles : styles;

  const renderTripItem = ({ item }) => (
    <View style={currentStyles.tripItem}>
      <Image source={{ uri: item.image }} style={currentStyles.tripImage} />
      <View style={currentStyles.tripDetails}>
        <Text style={currentStyles.tripLocation}>{item.location}</Text>
        <Text style={currentStyles.tripAddress}>{item.address}</Text>
      </View>
    </View>
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
          onPress={() => handleTabPress("trips")}
          style={currentStyles.iconItem}
        >
          <FontAwesome
            name="plane"
            size={30}
            color={
              activeTab === "trips"
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
                  activeTab === "trips"
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

      {/* FlatList for Trips */}
      <View style={currentStyles.listContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : activeTab === "trips" ? (
          tripData.length > 0 ? (
            <FlatList
              data={tripData}
              renderItem={renderTripItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={currentStyles.flatListContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text>No lists available.</Text>
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
  listContainer: {
    flex: 1,
    width: "100%",
  },
  flatListContent: {
    paddingHorizontal: 20,
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
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});

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
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    height: 20,
    width: 1,
    backgroundColor: "#777",
    marginHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tripItem: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
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
    color: "#fff",
  },
  tripAddress: {
    fontSize: 14,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});
