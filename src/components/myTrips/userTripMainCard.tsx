import { View, Text, Image, Pressable, Alert } from "react-native";
import React from "react";
import moment from "moment";
import { useTheme } from "../../context/themeContext";
import UserTripListCard from "./userTripListCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface UserTripMainCardProps {
  userTrips: Array<{
    tripData: string;
    tripPlan: string;
    id: string; // Added trip ID to the interface
  }>;
  onTripDeleted: () => void;
}

const UserTripMainCard: React.FC<UserTripMainCardProps> = ({
  userTrips,
  onTripDeleted,
}) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const user = FIREBASE_AUTH.currentUser;

  if (!userTrips || userTrips.length === 0) return null;

  // Safely parse tripData and tripPlan
  const parseData = (data: string) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse data:", error);
        return {}; // Return fallback object
      }
    }
    return data; // Already an object
  };

  const LatestTrip = parseData(userTrips[userTrips.length - 1]?.tripData);
  const LatestPlan = parseData(userTrips[userTrips.length - 1]?.tripPlan);

  const deleteTrip = async (tripId: string) => {
    try {
      Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const tripDocRef = doc(
              FIREBASE_DB,
              `users/${user.uid}/userTrips/${tripId}`
            ); // Update path
            await deleteDoc(tripDocRef);
            console.log(`Trip with ID ${tripId} deleted successfully.`);
            onTripDeleted(); // Call the onTripDeleted callback to refresh the trip list
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      {LatestTrip?.locationInfo?.photoRef ? (
        <Pressable
          onPress={() =>
            navigation.navigate("TripDetails", {
              trip: JSON.stringify({
                ...LatestTrip,
                travelPlan: LatestPlan?.travelPlan || {}, // Combine LatestPlan details
              }),
            })
          }
        >
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${LatestTrip.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
            }}
            style={{
              width: "100%",
              height: 240,
              borderRadius: 15,
            }}
          />
        </Pressable>
      ) : (
        <Image
          source={require("../../assets/placeholder.jpeg")}
          style={{
            width: "100%",
            height: 240,
            borderRadius: 15,
          }}
        />
      )}
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 24,
            color: currentTheme.textPrimary,
          }}
        >
          {LatestTrip?.locationInfo?.name || "No Location Available"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
            alignItems: "center", // Align items vertically centered
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: currentTheme.textSecondary,
            }}
          >
            {LatestTrip?.startDate
              ? moment(LatestTrip.startDate).format("MMM DD yyyy")
              : "No Start Date"}{" "}
            -{" "}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: currentTheme.textSecondary,
            }}
          >
            {LatestTrip?.startDate
              ? moment(LatestTrip.endDate).format("MMM DD yyyy")
              : "No Start Date"}
          </Text>
          <Pressable
            onPress={() => deleteTrip(userTrips[userTrips.length - 1]?.id)} // Use the ID of the latest trip
            style={{
              padding: 5,
              borderRadius: 20,
              marginLeft: "auto", // Push the icon to the end
            }}
          >
            <AntDesign name="delete" size={24} color="red" />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: currentTheme.textSecondary,
              marginHorizontal: 10,
            }}
          />
          <Text
            style={{
              color: currentTheme.textSecondary,
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 15,
            }}
          >
            All your plans
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: currentTheme.textSecondary,
              marginHorizontal: 10,
            }}
          />
        </View>
      </View>
      {userTrips.map((trip, index) => {
        if (!trip || !trip.tripData || !trip.tripPlan) {
          console.warn(`Skipping invalid trip at index ${index}:`, trip);
          return null;
        }

        return (
          <UserTripListCard
            trip={{
              tripData: trip.tripData,
              tripPlan: trip.tripPlan,
              id: trip.id, // Pass the trip ID to the list card
            }}
            key={index}
            deleteTrip={deleteTrip} // Pass deleteTrip function to UserTripListCard
          />
        );
      })}
    </View>
  );
};

export default UserTripMainCard;
