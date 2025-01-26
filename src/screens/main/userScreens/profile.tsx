import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Modal,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
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
import { CreateTripContext } from "../../../context/createTripContext";

// Define the type for tripData
interface TripData {
  budget: string | null;
  travelerType: string | null;
  accommodationType: string | null;
  activityLevel: string | null;
  preferredClimate: string | null;
}

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC = () => {
  const { profilePicture, displayName } = useProfile();
  const { currentTheme } = useTheme();
  const { setTripData } = useContext(CreateTripContext) || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("Set location");

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

  const handleLocationPress = () => {
    console.log("TODO");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/placeholder.jpeg")}
            style={styles.headerImage}
          />
          <View style={styles.overlay} />
          <Pressable
            style={styles.settingsIconContainer}
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

            <View style={styles.userInfoContainer}>
              <Text
                style={[styles.userName, { color: currentTheme.textPrimary }]}
              >
                {displayName || userName}
              </Text>
              <Pressable
                style={styles.locationContainer}
                onPress={handleLocationPress}
              >
                <Ionicons
                  name="location-sharp"
                  size={24}
                  color={currentTheme.textPrimary}
                  style={styles.locationIcon}
                />
                <Text
                  style={[
                    styles.locationText,
                    { color: currentTheme.textPrimary },
                  ]}
                >
                  {location}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Ongoing Trips */}
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
  settingsIconContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  pencilIconContainer: {
    position: "absolute",
    top: 50,
    right: 60,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
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
  userInfoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 5,
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 40,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: -10,
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontSize: 18,
  },
  ongoingTripsContainer: {
    marginTop: 100,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  currentTripContainer: {
    width: "100%",
  },
  ongoingBadgeContainer: {
    position: "relative",
  },
  ongoingBadge: {
    padding: 5,
    width: "20%",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    position: "absolute",
    top: "10%",
    left: "5%",
    zIndex: 1,
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
