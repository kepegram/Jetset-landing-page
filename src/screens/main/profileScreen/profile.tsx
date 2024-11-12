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
import { RootStackParamList } from "../../../navigation/appNav";
import { useProfile } from "../../../context/profileContext";
import { FIREBASE_DB } from "../../../../firebase.config";
import { useTheme } from "../../../context/themeContext";
import { Dimensions } from "react-native";

// Inside your component
const { width } = Dimensions.get("window");

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture } = useProfile();
  const { currentTheme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"destinations" | "memories">(
    "destinations"
  );
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any[]>([]);
  const [memoriesData, setMemoriesData] = useState<any>([]);

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

  const fetchMemoriesData = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const querySnapshot = await getDocs(
        collection(FIREBASE_DB, `users/${user.uid}/visited`)
      );
      const memories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemoriesData(memories);
    } catch (error) {
      console.error("Error fetching memories data: ", error);
    } finally {
      setLoading(false);
    }
  };

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
      fetchPlannerData();
      fetchMemoriesData();
    }, [])
  );

  const handleTabPress = (tab: "destinations" | "memories") => {
    setActiveTab(tab);
  };

  const renderTripItem = ({ item }) => (
    <Pressable
      style={[styles.tripItem, { backgroundColor: currentTheme.alternate }]}
      onPress={() => navigation.navigate("TripBuilder", { tripDetails: item })}
    >
      <Image source={{ uri: item.image }} style={styles.tripImage} />
      <View style={styles.tripDetails}>
        <Text style={[styles.tripCity, { color: currentTheme.textPrimary }]}>
          {item.city}
        </Text>
        <Text
          style={[styles.tripCountry, { color: currentTheme.textSecondary }]}
        >
          {item.country}
        </Text>
      </View>
    </Pressable>
  );

  const renderMemoriesItem = ({ item }) => (
    <Pressable
      style={[styles.tripItem, { backgroundColor: currentTheme.alternate }]}
      onPress={() => navigation.navigate("Trips")}
    >
      <Image source={{ uri: item.image }} style={styles.tripImage} />
      <View style={styles.tripDetails}>
        <Text style={[styles.tripCity, { color: currentTheme.textPrimary }]}>
          {item.city}
        </Text>
        <Text
          style={[styles.tripCountry, { color: currentTheme.textSecondary }]}
        >
          {item.country}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.profileContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        </Pressable>

        {userName && (
          <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>
            {userName}
          </Text>
        )}
      </View>
      <View style={styles.iconsContainer}>
        <Pressable
          onPress={() => handleTabPress("destinations")}
          style={styles.iconItem}
        >
          <FontAwesome
            name="plane"
            size={30}
            color={
              activeTab === "destinations"
                ? currentTheme.contrast
                : currentTheme.icon
            }
          />
          <Text
            style={[
              styles.iconText,
              {
                color:
                  activeTab === "destinations"
                    ? currentTheme.contrast
                    : currentTheme.icon,
              },
            ]}
          >
            Destinations
          </Text>
        </Pressable>

        <View
          style={[
            styles.separator,
            { backgroundColor: currentTheme.textSecondary },
          ]}
        />

        <Pressable
          onPress={() => handleTabPress("memories")}
          style={styles.iconItem}
        >
          <MaterialIcons
            name="photo-library"
            size={30}
            color={
              activeTab === "memories"
                ? currentTheme.contrast
                : currentTheme.icon
            }
          />
          <Text
            style={[
              styles.iconText,
              {
                color:
                  activeTab === "memories"
                    ? currentTheme.contrast
                    : currentTheme.icon,
              },
            ]}
          >
            Memories
          </Text>
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <Text
            style={[styles.loadingText, { color: currentTheme.textSecondary }]}
          >
            Loading...
          </Text>
        ) : activeTab === "destinations" ? (
          tripData.length > 0 ? (
            <FlatList
              data={tripData}
              renderItem={renderTripItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text
              style={[
                styles.noListsText,
                { color: currentTheme.textSecondary },
              ]}
            >
              No lists available.
            </Text>
          )
        ) : memoriesData.length > 0 ? (
          <FlatList
            data={memoriesData}
            renderItem={renderMemoriesItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text
            style={[styles.noListsText, { color: currentTheme.textSecondary }]}
          >
            No lists available.
          </Text>
        )}
      </View>

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
  },
  separator: {
    height: 20,
    width: 1,
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
    marginBottom: 10,
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
  tripCity: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tripCountry: {
    fontSize: 14,
  },
  noListsText: {
    fontSize: 16,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
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
