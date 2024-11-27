import React, { useState, useCallback } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  FlatList,
  ScrollView,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import StartNewTripCard from "../../../components/myTrips/startNewTripCard";
import CurrentTripsCard from "../../../components/myTrips/currentTripCard";
import UpcomingTripsCard from "../../../components/myTrips/upcomingTripsCard";
import PastTripListCard from "../../../components/myTrips/pastTripListCard";
import { useProfile } from "../../../context/profileContext";
import moment from "moment";

type MyTripsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MyTrips"
>;

const MyTrips: React.FC = () => {
  const { currentTheme } = useTheme();
  const { displayName } = useProfile();
  const [userName, setUserName] = useState<string | null>(null);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<MyTripsScreenNavigationProp>();

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

  const sortedUpcomingTrips = userTrips
    .filter((trip) => {
      const startDate = moment(trip.tripData.startDate).startOf("day");
      return startDate.isAfter(moment().startOf("day"));
    })
    .sort((a, b) => {
      const dateA = moment(a.tripData.startDate);
      const dateB = moment(b.tripData.startDate);
      return dateA.diff(dateB);
    });

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 25,
        paddingTop: 55,
        backgroundColor: currentTheme.background,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
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
          {userName || displayName}'s Trips
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => console.log("TODO")}
            style={{ marginRight: 10 }}
          >
            <Fontisto name="search" size={30} color={currentTheme.icon} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("BuildTrip")}>
            <Fontisto name="plus-a" size={30} color={currentTheme.icon} />
          </Pressable>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={currentTheme.alternate} />
      ) : userTrips.length === 0 ? (
        <StartNewTripCard navigation={navigation} />
      ) : (
        <View>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 24,
              color: currentTheme.textPrimary,
              marginTop: 20,
              textAlign: "left",
            }}
          >
            Current Trip
          </Text>
          <View style={{ alignItems: "center" }}>
            <CurrentTripsCard userTrips={userTrips} />
          </View>

          {sortedUpcomingTrips.length > 0 && (
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 24,
                color: currentTheme.textPrimary,
                marginTop: 20,
              }}
            >
              Upcoming Trips
            </Text>
          )}
          <FlatList
            data={sortedUpcomingTrips}
            horizontal
            renderItem={({ item }) => (
              <View style={{ marginRight: 10 }}>
                <UpcomingTripsCard userTrips={[item]} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />

          {userTrips.some((trip) =>
            moment(trip.tripData.endDate).isBefore(moment(), "day")
          ) && (
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
          )}
          {userTrips.map((trip, index) => {
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
    </ScrollView>
  );
};

export default MyTrips;
