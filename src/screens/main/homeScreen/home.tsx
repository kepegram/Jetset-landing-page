import React, { useState, useCallback } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StartNewTripCard from "../../../components/myTrips/startNewTripCard";
import CurrentTripsCard from "../../../components/myTrips/currentTripsCard";
import PastTripListCard from "../../../components/myTrips/pastTripListCard"; // Import UserTripListCard

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeMain"
>;

const Home: React.FC = () => {
  const { currentTheme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [userTrips, setUserTrips] = useState<any[]>([]); // Specify type for userTrips
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const user = FIREBASE_AUTH.currentUser;

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
    }, [])
  );

  // Fetch trips when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (user) GetMyTrips();
    }, [user])
  );

  const GetMyTrips = async () => {
    try {
      setLoading(true);
      setUserTrips([]); // Reset trips before loading new data.

      const tripsQuery = query(
        collection(FIREBASE_DB, `users/${user.uid}/userTrips`),
        where("userEmail", "==", user.email)
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

  // Sort trips by date
  const sortedTrips = userTrips.sort((a, b) => {
    const dateA = new Date(JSON.parse(a.tripData).startDate).getTime();
    const dateB = new Date(JSON.parse(b.tripData).startDate).getTime();
    return dateA - dateB;
  });

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 55,
        backgroundColor: currentTheme.background,
        height: "100%",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 35,
            color: currentTheme.textPrimary,
          }}
        >
          {userName}'s Trips
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => console.log("TODO")}>
            <Ionicons
              name="search-circle-sharp"
              size={55}
              color={currentTheme.icon}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("BuildTrip")}>
            <Ionicons name="add-circle" size={50} color={currentTheme.icon} />
          </Pressable>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={currentTheme.alternate} />
      ) : sortedTrips.length === 0 ? (
        <StartNewTripCard navigation={navigation} />
      ) : (
        <View>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 24,
              color: currentTheme.textPrimary,
              marginTop: 20,
            }}
          >
            Current Trip
          </Text>
          <FlatList
            data={sortedTrips}
            horizontal
            renderItem={({ item }) => (
              <CurrentTripsCard userTrips={[item]} onTripDeleted={GetMyTrips} />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />

          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 24,
              color: currentTheme.textPrimary,
              marginTop: 20,
            }}
          >
            Past Trips
          </Text>
          {sortedTrips.map((trip, index) => {
            if (!trip || !trip.tripData || !trip.tripPlan) {
              console.warn(`Skipping invalid trip at index ${index}:`, trip);
              return null;
            }

            return (
              <PastTripListCard
                trip={{
                  tripData: trip.tripData,
                  tripPlan: trip.tripPlan,
                  id: trip.id,
                }}
                key={index}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default Home;
