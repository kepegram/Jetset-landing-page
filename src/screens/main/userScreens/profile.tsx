import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Modal,
  Button,
  ActivityIndicator,
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
  const [location, setLocation] = useState<string>("Location");

  const user = getAuth().currentUser;
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

      const tripsQuery = query(
        collection(FIREBASE_DB, `users/${user.uid}/userTrips`)
      );

      const querySnapshot = await getDocs(tripsQuery);
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching user trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPress = () => {
    console.log("TODO");
  };

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
          <Ionicons name="settings-sharp" size={28} color="white" />
        </Pressable>
        <View style={styles.profileContainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <View
              style={[
                styles.profilePictureBackground,
                { backgroundColor: currentTheme.background },
              ]}
            >
              <Image
                source={{ uri: profilePicture }}
                style={styles.profilePicture}
              />
            </View>
          </Pressable>

          <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>
            {displayName || userName}
          </Text>
        </View>
        <Pressable
          style={styles.locationContainer}
          onPress={handleLocationPress}
        >
          <Ionicons name="location-sharp" size={24} color="white" />
          <Text style={[styles.locationText, { color: "white" }]}>
            {location}
          </Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
        My Trips
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={currentTheme.alternate} />
      ) : (
        <View style={{ padding: 20 }}>
          {/* <View style={styles.ongoingBadgeContainer}>
            <Text
              style={[
                styles.ongoingBadge,
                { backgroundColor: currentTheme.alternate },
              ]}
            >
              Ongoing
            </Text>
          </View> */}
          <CurrentTripCard userTrips={userTrips} />
        </View>
      )}

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
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
    paddingHorizontal: 10,
  },
  profilePictureBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 40,
  },
  locationContainer: {
    position: "absolute",
    top: 150,
    left: 120,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(128, 128, 128, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  locationText: {
    fontSize: 18,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    position: "absolute",
    top: "35%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 120,
    textAlign: "center",
    alignSelf: "flex-start",
    paddingLeft: 20,
  },
  ongoingBadgeContainer: {
    position: "absolute",
    top: 50,
    left: 30,
    zIndex: 1,
  },
  ongoingBadge: {
    padding: 5,
    borderRadius: 5,
    color: "white",
    fontWeight: "bold",
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
