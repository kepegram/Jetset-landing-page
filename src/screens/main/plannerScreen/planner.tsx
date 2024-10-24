import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useProfile } from "../profileScreen/profileContext";
import { useTheme } from "../profileScreen/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav"; 
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { AntDesign, Ionicons } from "@expo/vector-icons"; 
import { getAuth } from "firebase/auth";

type PlannerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Planner"
>;

const Planner: React.FC = () => {
  const { theme } = useTheme();
  const { profilePicture } = useProfile();
  const navigation = useNavigation<PlannerScreenNavigationProp>();

  const [plannerData, setPlannerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentStyles = theme === "dark" ? darkStyles : styles;

  // Fetch planner data from Firestore
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
      setPlannerData(trips);
    } catch (error) {
      console.error("Error fetching planner data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPlannerData();
    }, [])
  );

  // Function to handle item deletion
  const handleRemove = async (id: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Ensure you are using the correct path with user ID
      await deleteDoc(doc(FIREBASE_DB, `users/${user.uid}/bucketlist`, id));

      // Update the local state to remove the item
      setPlannerData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  // Confirm deletion before removing
  const confirmRemove = (id: string) => {
    Alert.alert(
      "Remove Trip",
      "Are you sure you want to remove this trip?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => handleRemove(id) },
      ],
      { cancelable: true }
    );
  };

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate("TripBuilder", { tripDetails: item })
        }
        style={currentStyles.card}
      >
        <Image source={{ uri: item.image }} style={currentStyles.image} />
        <View style={currentStyles.cardBody}>
          <View style={currentStyles.textContainer}>
            <View>
              <Text style={currentStyles.location}>{item.address}</Text>
              <Text style={currentStyles.address}>{item.location}</Text>
            </View>
            <Pressable
              onPress={() => confirmRemove(item.id)}
              style={currentStyles.trashIconContainer}
            >
              <AntDesign name="delete" size={24} color="red" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.topBar}>
        <Text style={currentStyles.appName}>Plan Your Trip</Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: profilePicture }}
            style={currentStyles.profilePicture}
          />
        </Pressable>
      </View>

      {loading ? (
        <Text style={currentStyles.loadingText}>Loading...</Text>
      ) : plannerData.length === 0 ? (
        <Text style={currentStyles.emptyText}>No trips planned yet.</Text>
      ) : (
        <FlatList
          data={plannerData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            currentStyles.listContainer,
            { paddingBottom: 80 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Planner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#666",
  },
  listContainer: {
    padding: 0,
  },
  card: {
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 12,
    paddingBottom: 20, 
    flexGrow: 1,
  },
  textContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  address: {
    fontSize: 14,
    color: "#888",
  },
  trashIconContainer: {
    marginLeft: 10, 
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
    backgroundColor: "#121212",
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#888",
  },
  listContainer: {
    padding: 0,
  },
  card: {
    backgroundColor: "#1c1c1e",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 12,
    paddingBottom: 20, 
    flexGrow: 1,
  },
  textContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  address: {
    fontSize: 14,
    color: "#888",
  },
  trashIconContainer: {
    marginLeft: 10, 
  },
});
