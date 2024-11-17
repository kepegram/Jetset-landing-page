import React, { useState, useCallback } from "react";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import StartNewTripCard from "../../../components/myTrips/startNewTripCard";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import UserTripMainCard from "../../../components/myTrips/userTripMainCard";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Home: React.FC = () => {
  const { currentTheme } = useTheme();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const user = FIREBASE_AUTH.currentUser;

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

  return (
    <ScrollView
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
          My Trips
        </Text>
        <Pressable onPress={() => navigation.navigate("SearchPlace")}>
          <Ionicons name="add-circle" size={50} color={currentTheme.icon} />
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={currentTheme.alternate} />
      ) : userTrips.length === 0 ? (
        <StartNewTripCard navigation={navigation} />
      ) : (
        <UserTripMainCard userTrips={userTrips} />
      )}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

export default Home;
