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
import { useProfile } from "../../../context/profileContext";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { AntDesign } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

type PlannerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Planner"
>;

const Planner: React.FC = () => {
  const { currentTheme } = useTheme();
  const { profilePicture } = useProfile();
  const navigation = useNavigation<PlannerScreenNavigationProp>();

  const [plannerData, setPlannerData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useFocusEffect(
    useCallback(() => {
      fetchPlannerData();
    }, [])
  );

  const handleRemove = async (id: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      await deleteDoc(doc(FIREBASE_DB, `users/${user.uid}/bucketlist`, id));
      setPlannerData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

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

  const renderItem = ({ item }) => (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate("TripBuilder", { tripDetails: item })
        }
        style={[styles.card, { backgroundColor: currentTheme.alternate }]}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardBody}>
          <View style={styles.textContainer}>
            <View>
              <Text style={[styles.city, { color: currentTheme.textPrimary }]}>
                {item.city}
              </Text>
              <Text
                style={[styles.country, { color: currentTheme.textSecondary }]}
              >
                {item.country}
              </Text>
            </View>
            <Pressable
              onPress={() => confirmRemove(item.id)}
              style={styles.trashIconContainer}
            >
              <AntDesign name="delete" size={24} color={"red"} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View
        style={[styles.topBar, { backgroundColor: currentTheme.background }]}
      >
        <Text style={[styles.appName, { color: currentTheme.textPrimary }]}>
          Plan Your Trip
        </Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        </Pressable>
      </View>

      {loading ? (
        <Text style={[styles.loadingText, { color: currentTheme.inactive }]}>
          Loading...
        </Text>
      ) : plannerData.length === 0 ? (
        <Text style={[styles.emptyText, { color: currentTheme.inactive }]}>
          No trips planned yet.
        </Text>
      ) : (
        <FlatList
          data={plannerData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
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
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
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
  },
  listContainer: {
    padding: 0,
  },
  card: {
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
  city: {
    fontSize: 18,
    fontWeight: "bold",
  },
  country: {
    fontSize: 14,
  },
  trashIconContainer: {
    marginLeft: 10,
  },
});
