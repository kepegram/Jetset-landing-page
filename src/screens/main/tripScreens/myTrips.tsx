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
  StyleSheet,
  ScrollView,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import StartNewTripCard from "../../../components/myTrips/startNewTripCard";
import CurrentTripsCard from "../../../components/myTrips/currentTripCard";
import UpcomingTripsCard from "../../../components/myTrips/upcomingTripsCard";
import PastTripListCard from "../../../components/myTrips/pastTripListCard";
import { useProfile } from "../../../context/profileContext";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type MyTripsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

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

      if (!user) return;

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

  const hasCurrentTrip = userTrips.some((trip) => {
    const startDate = moment(trip.tripData.startDate).startOf("day");
    const endDate = moment(trip.tripData.endDate).endOf("day");
    const today = moment().startOf("day");
    return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
  });

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentTheme.background,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text
            style={[styles.headerTitle, { color: currentTheme.textPrimary }]}
          >
            {userName || displayName}'s Trips ✈️
          </Text>
          <Pressable
            style={styles.addButton}
            onPress={() => navigation.navigate("WhereTo")}
          >
            <Fontisto name="plus-a" size={24} color={currentTheme.icon} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentTheme.alternate} />
          </View>
        ) : userTrips.length === 0 ? (
          <StartNewTripCard navigation={navigation} />
        ) : (
          <View style={styles.tripsContainer}>
            <Text
              style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}
            >
              Current Trip
            </Text>
            {hasCurrentTrip ? (
              <CurrentTripsCard userTrips={userTrips} />
            ) : (
              <View
                style={[
                  styles.emptyStateContainer,
                  { backgroundColor: currentTheme.background },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-today"
                  size={32}
                  color={currentTheme.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  Nothing booked for today
                </Text>
                <Pressable
                  style={[
                    styles.emptyStateButton,
                    { backgroundColor: currentTheme.alternate },
                  ]}
                  onPress={() => navigation.navigate("WhereTo")}
                >
                  <Text style={[styles.emptyStateButtonText]}>Plan a Trip</Text>
                </Pressable>
              </View>
            )}

            <Text
              style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}
            >
              Upcoming Trips
            </Text>
            {sortedUpcomingTrips.length > 0 ? (
              <FlatList
                data={sortedUpcomingTrips}
                horizontal
                renderItem={({ item }) => (
                  <View style={styles.upcomingTripCard}>
                    <UpcomingTripsCard userTrips={[item]} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.upcomingTripsContainer}
              />
            ) : (
              <View
                style={[
                  styles.emptyStateContainer,
                  { backgroundColor: currentTheme.background },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={32}
                  color={currentTheme.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  No upcoming trips planned
                </Text>
                <Pressable
                  style={[
                    styles.emptyStateButton,
                    { backgroundColor: currentTheme.alternate },
                  ]}
                  onPress={() => navigation.navigate("WhereTo")}
                >
                  <Text
                    style={[
                      styles.emptyStateButtonText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    Schedule One Now
                  </Text>
                </Pressable>
              </View>
            )}

            <Text
              style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}
            >
              Past Trips
            </Text>
            {userTrips.some((trip) =>
              moment(trip.tripData.endDate).isBefore(moment(), "day")
            ) ? (
              <View style={styles.pastTripsContainer}>
                {userTrips.map((trip, index) => {
                  if (!trip || !trip.tripData || !trip.tripPlan) {
                    console.warn(
                      `Skipping invalid trip at index ${index}:`,
                      trip
                    );
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
            ) : (
              <View
                style={[
                  styles.emptyStateContainer,
                  { backgroundColor: currentTheme.background },
                ]}
              >
                <MaterialCommunityIcons
                  name="history"
                  size={32}
                  color={currentTheme.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  No past trips yet
                </Text>
                <Pressable
                  style={[
                    styles.emptyStateButton,
                    { backgroundColor: currentTheme.alternate },
                  ]}
                  onPress={() => navigation.navigate("WhereTo")}
                >
                  <Text
                    style={[
                      styles.emptyStateButtonText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    Create Your First Memory
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tripsContainer: {
    flex: 1,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 30,
  },
  upcomingTripCard: {
    marginRight: 15,
  },
  upcomingTripsContainer: {
    paddingVertical: 10,
  },
  pastTripsContainer: {
    gap: 15,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  emptyStateButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default MyTrips;
