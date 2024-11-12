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
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

type TripsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Trips"
>;

const Trips: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<TripsScreenNavigationProp>();

  const [plannerData, setPlannerData] = useState([]);
  const [visitedData, setVisitedData] = useState([]);
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

  const fetchUserVisited = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const visitedQuery = query(
          collection(FIREBASE_DB, `users/${user.uid}/visited`)
        );
        const visitedSnapshot = await getDocs(visitedQuery);
        const visitedList = visitedSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setVisitedData(visitedList);
      }
    } catch (error) {
      console.error("Error fetching user visited data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlannerData();
      fetchUserVisited();
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

  const handleAddPicture = (tripId: string) => {
    Alert.alert("Add Picture", `Add a picture to trip ${tripId}`);
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

  const renderTripItem = ({ item }: { item: any }) => (
    <View>
      <Pressable
        //onPress={() => navigation.navigate("TripDetail", { tripId: item.id })}
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
            <Pressable onPress={() => handleAddPicture(item.id)}>
              <Ionicons
                name="camera-outline"
                size={24}
                color={currentTheme.icon}
              />
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
      {loading ? (
        <Text style={[styles.loadingText, { color: currentTheme.inactive }]}>
          Loading...
        </Text>
      ) : (
        <>
          {/* Planner Section */}
          <Text
            style={[styles.sectionHeader, { color: currentTheme.textPrimary }]}
          >
            Planner
          </Text>
          {plannerData.length === 0 ? (
            <Text style={[styles.emptyText, { color: currentTheme.inactive }]}>
              No trips planned yet.
            </Text>
          ) : (
            <FlatList
              data={plannerData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          )}

          {/* Memories Section */}
          <View style={styles.headerContainer}>
            <Text
              style={[
                styles.sectionHeader,
                { color: currentTheme.textPrimary },
              ]}
            >
              Memories
            </Text>
            {/* <Pressable onPress={() => navigation.navigate("AddTrip")}> */}
            <Pressable>
              <Text
                style={[
                  styles.addTripText,
                  { color: currentTheme.textPrimary },
                ]}
              >
                Add Trip
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={visitedData}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text
                style={[
                  styles.emptyText,
                  { color: currentTheme.textSecondary },
                ]}
              >
                No memories yet. Start adding your trips!
              </Text>
            }
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

export default Trips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  card: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    marginRight: 10,
    width: 200,
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addTripText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
