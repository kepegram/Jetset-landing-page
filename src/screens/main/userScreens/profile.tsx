import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useProfile } from "../../../context/profileContext";
import { FIREBASE_DB } from "../../../../firebase.config";
import { collection, getDocs, query } from "firebase/firestore";
import { useTheme } from "../../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import CurrentTripCard from "../../../components/myTrips/currentTripCard";
import { LinearGradient } from "expo-linear-gradient";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture, displayName } = useProfile();
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userTrips, setUserTrips] = useState<any[]>([]);

  const user = getAuth().currentUser;
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserName(data?.name || "");
              setUserTrips(data?.trips || []);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      };

      fetchUserData();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (user) GetMyTrips();
    }, [user])
  );

  const GetMyTrips = async () => {
    try {
      setLoading(true);
      setUserTrips([]);

      if (user) {
        const tripsQuery = query(
          collection(FIREBASE_DB, `users/${user.uid}/userTrips`)
        );

        const querySnapshot = await getDocs(tripsQuery);
        const trips = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserTrips(trips);
      }
    } catch (error) {
      console.error("Error fetching user trips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/placeholder.jpeg")}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.overlay}
          />
          <Pressable
            style={styles.settingsIconContainer}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-sharp" size={28} color="white" />
          </Pressable>
          <View style={styles.profileContainer}>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={styles.profileImageContainer}
            >
              <View style={styles.profilePictureBackground}>
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profilePicture}
                />
              </View>
            </Pressable>

            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{displayName || userName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ongoingTripsContainer}>
          <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
            Ongoing Trips
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color={currentTheme.alternate} />
          ) : (
            <View style={styles.currentTripContainer}>
              <CurrentTripCard userTrips={userTrips} />
            </View>
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
              <Image
                source={{ uri: profilePicture }}
                style={styles.modalImage}
              />
              <Pressable
                style={styles.editButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Edit");
                }}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 280,
    justifyContent: "flex-end",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  settingsIconContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    padding: 8,
  },
  profileContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profilePictureBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
    borderWidth: 3,
    borderColor: "white",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: 16,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ongoingTripsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  currentTripContainer: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#387694",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
