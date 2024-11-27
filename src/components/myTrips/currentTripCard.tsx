import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useTheme } from "../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TripDetails"
>;

interface CurrentTripCardProps {
  userTrips: Array<{
    tripData: string;
    tripPlan: string;
    id: string;
  }>;
}

const CurrentTripCard: React.FC<CurrentTripCardProps> = ({ userTrips }) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [currentTrip, setCurrentTrip] = useState<any>(null);

  useEffect(() => {
    const today = moment().startOf("day");

    const findCurrentTrip = userTrips.find((trip) => {
      const tripData = parseData(trip.tripData);
      const startDate = moment(tripData.startDate).startOf("day");
      const endDate = moment(tripData.endDate).endOf("day");
      return startDate.isSameOrBefore(today) && endDate.isSameOrAfter(today);
    });

    setCurrentTrip(findCurrentTrip);
  }, [userTrips]);

  const parseData = (data: string) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse data:", error);
        return {};
      }
    }
    return data;
  };

  if (!currentTrip) {
    return (
      <View style={{ marginVertical: 20, width: "100%", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 18,
            color: currentTheme.textSecondary,
          }}
        >
          None. Book something for today!
        </Text>
      </View>
    );
  }

  const parsedCurrentTrip = parseData(currentTrip.tripData);
  const parsedCurrentPlan = parseData(currentTrip.tripPlan);

  return (
    <View style={{ marginVertical: 20, width: "100%" }}>
      {parsedCurrentTrip?.locationInfo?.photoRef ? (
        <Pressable
          onPress={() =>
            navigation.navigate("TripDetails", {
              trip: JSON.stringify({
                ...parsedCurrentTrip,
                travelPlan: parsedCurrentPlan?.travelPlan || {},
              }),
            })
          }
        >
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${parsedCurrentTrip.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
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
            fontFamily: "outfit",
            fontSize: 24,
            color: currentTheme.textPrimary,
          }}
        >
          {parsedCurrentTrip?.locationInfo?.name || "No Location Name"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: currentTheme.textSecondary,
            }}
          >
            {parsedCurrentTrip?.startDate
              ? moment(parsedCurrentTrip.startDate).format("MMM DD yyyy")
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
            {parsedCurrentTrip?.startDate
              ? moment(parsedCurrentTrip.endDate).format("MMM DD yyyy")
              : "No Start Date"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentTripCard;
