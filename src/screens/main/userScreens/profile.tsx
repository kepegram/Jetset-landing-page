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
import { Dropdown } from "react-native-element-dropdown";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
import { MainButton } from "../../../components/ui/button";
import {
  accommodationTypes,
  activityLevels,
  budgetOptions,
  preferredClimates,
  travelerTypes,
} from "../../../constants/constants";

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
  const { setTripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<TripData>({
    budget: null,
    travelerType: null,
    accommodationType: null,
    activityLevel: null,
    preferredClimate: null,
  });
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("Set location");

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
      fetchPreferences();
    }, [])
  );

  const fetchPreferences = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const docRef = doc(
          FIREBASE_DB,
          `users/${user.uid}/userPreferences`,
          user.uid
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as TripData;
          setPreferences(data);
          setTripData((prevTripData: TripData) => {
            const updatedTripData = { ...prevTripData, ...data };
            return updatedTripData;
          });
        } else {
          console.log("No such document!");
        }

        const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData?.name || "");
        }
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const savePreferences = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        await setDoc(
          doc(FIREBASE_DB, `users/${user.uid}/userPreferences`, user.uid),
          preferences
        );

        setTripData((prevTripData: TripData) => {
          const updatedTripData = { ...prevTripData, ...preferences };
          console.log("Trip data after saving preferences:", updatedTripData);
          return updatedTripData;
        });
        console.log("Saved preferences:", preferences);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const allPreferencesSelected =
    preferences.budget &&
    preferences.travelerType &&
    preferences.accommodationType &&
    preferences.activityLevel &&
    preferences.preferredClimate;

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
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {!isEditing ? (
        <>
          <View style={styles.header}>
            <Image
              source={require("../../../assets/placeholder.jpeg")}
              style={styles.headerImage}
            />
            <View style={styles.overlay} />
            <Pressable
              style={styles.pencilIconContainer}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={28} color="white" />
            </Pressable>
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

          {/* Preferences */}

          <View style={[styles.preferencesContainer, { marginTop: 70 }]}>
            <Text
              style={[
                styles.preferencesTitle,
                { color: currentTheme.textPrimary },
              ]}
            >
              About you:
            </Text>

            <Text
              style={[
                styles.preferencesText,
                { color: currentTheme.textPrimary },
              ]}
            >
              You have a{" "}
              <Text
                style={[
                  styles.preferencesHighlight,
                  { color: currentTheme.alternate },
                ]}
              >
                {preferences.budget
                  ? preferences.budget.toLowerCase()
                  : "unknown"}
              </Text>{" "}
              budget
            </Text>
            <Text
              style={[
                styles.preferencesText,
                styles.preferencesTextRight,
                { color: currentTheme.textPrimary },
              ]}
            >
              and you are{" "}
              <Text
                style={[
                  styles.preferencesHighlight,
                  { color: currentTheme.alternate },
                ]}
              >
                {preferences.travelerType
                  ? preferences.travelerType.toLowerCase()
                  : "unknown"}
              </Text>
              .
            </Text>
            <Text
              style={[
                styles.preferencesText,
                { color: currentTheme.textPrimary },
              ]}
            >
              You stay in{" "}
              <Text
                style={[
                  styles.preferencesHighlight,
                  { color: currentTheme.alternate },
                ]}
              >
                {preferences.accommodationType
                  ? preferences.accommodationType.toLowerCase() + "s"
                  : "unknown"}
              </Text>
              ,
            </Text>
            <Text
              style={[
                styles.preferencesText,
                styles.preferencesTextRight,
                { color: currentTheme.textPrimary },
              ]}
            >
              your activity level is{" "}
              <Text
                style={[
                  styles.preferencesHighlight,
                  { color: currentTheme.alternate },
                ]}
              >
                {preferences.activityLevel
                  ? preferences.activityLevel.toLowerCase()
                  : "unknown"}
              </Text>
            </Text>
            <Text
              style={[
                styles.preferencesText,
                { color: currentTheme.textPrimary },
              ]}
            >
              and you enjoy a{" "}
              <Text
                style={[
                  styles.preferencesHighlight,
                  { color: currentTheme.alternate },
                ]}
              >
                {preferences.preferredClimate
                  ? preferences.preferredClimate.toLowerCase()
                  : "unknown"}
              </Text>{" "}
              climate.
            </Text>
          </View>

          {/* Ongoing Trips */}

          <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
            Ongoing Trips
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color={currentTheme.alternate} />
          ) : (
            <View style={{ padding: 20 }}>
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
              <Image
                source={{ uri: profilePicture }}
                style={styles.modalImage}
              />
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
      ) : (
        <View style={{ width: "100%", marginTop: 200, padding: 20 }}>
          <Pressable
            onPress={() => setIsEditing(false)}
            style={{
              position: "absolute",
              top: "-10%",
            }}
          >
            <Ionicons name="close" size={35} color={currentTheme.textPrimary} />
          </Pressable>
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Budget:
          </Text>
          <Dropdown
            data={budgetOptions}
            labelField="label"
            valueField="value"
            placeholder="Select budget"
            value={preferences.budget}
            onChange={(item) =>
              setPreferences((prev) => ({ ...prev, budget: item.value }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Traveler Type:
          </Text>
          <Dropdown
            data={travelerTypes}
            labelField="label"
            valueField="value"
            placeholder="Select traveler type"
            value={preferences.travelerType}
            onChange={(item) =>
              setPreferences((prev) => ({
                ...prev,
                travelerType: item.value,
              }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Accommodation Type:
          </Text>
          <Dropdown
            data={accommodationTypes}
            labelField="label"
            valueField="value"
            placeholder="Select accommodation type"
            value={preferences.accommodationType}
            onChange={(item) =>
              setPreferences((prev) => ({
                ...prev,
                accommodationType: item.value,
              }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 10,
              alignSelf: "flex-start",
            }}
          >
            Activity Level:
          </Text>
          <Dropdown
            data={activityLevels}
            labelField="label"
            valueField="value"
            placeholder="Select activity level"
            value={preferences.activityLevel}
            onChange={(item) =>
              setPreferences((prev) => ({
                ...prev,
                activityLevel: item.value,
              }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <Text style={{ color: currentTheme.textPrimary, marginBottom: 10 }}>
            Preferred Climate:
          </Text>
          <Dropdown
            data={preferredClimates}
            labelField="label"
            valueField="value"
            placeholder="Select preferred climate"
            value={preferences.preferredClimate}
            onChange={(item) =>
              setPreferences((prev) => ({
                ...prev,
                preferredClimate: item.value,
              }))
            }
            style={{
              width: "100%",
              borderColor: currentTheme.textPrimary,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,
            }}
            containerStyle={{
              backgroundColor: currentTheme.background,
              borderRadius: 10,
              padding: 10,
            }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
          />
          <MainButton
            buttonText="Save Preferences"
            onPress={savePreferences}
            disabled={!allPreferencesSelected}
            style={{ width: "80%", marginTop: 20, alignSelf: "center" }}
          />
        </View>
      )}
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
  preferencesContainer: {
    padding: 20,
  },
  preferencesTitle: {
    fontSize: 20,
    alignSelf: "flex-start",
  },
  preferencesText: {
    fontSize: 26,
    marginBottom: 20,
  },
  preferencesTextRight: {
    textAlign: "right",
  },
  preferencesHighlight: {
    fontWeight: "bold",
    fontSize: 38,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "flex-start",
    marginTop: -10,
    marginBottom: -20,
    paddingLeft: 20,
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
