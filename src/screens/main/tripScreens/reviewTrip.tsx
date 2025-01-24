import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { CreateTripContext } from "../../../context/createTripContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import moment from "moment";
import { MainButton } from "../../../components/ui/button";

type ReviewTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReviewTrip"
>;

const ReviewTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<ReviewTripScreenNavigationProp>();
  const { tripData } = useContext(CreateTripContext) || {};
  const [localTripData, setLocalTripData] = useState(tripData);

  useEffect(() => {
    setLocalTripData(tripData);
  }, [tripData]);

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
        Review your trip
      </Text>

      <View style={styles.contentContainer}>
        <Text style={[styles.subtitle, { color: currentTheme.textPrimary }]}>
          Before generating your trip, please review your selections
        </Text>

        {/* Destination Info  */}
        <View style={styles.infoContainer}>
          <Text style={styles.emoji}>📍</Text>
          <View>
            <Text style={[styles.label, { color: currentTheme.textSecondary }]}>
              Destination
            </Text>
            <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
              {localTripData?.destinationType}
            </Text>
          </View>
        </View>

        {/* Date Selected Info  */}
        <View style={styles.infoContainer}>
          <Text style={styles.emoji}>🗓️</Text>
          <View>
            <Text style={[styles.label, { color: currentTheme.textSecondary }]}>
              Travel Date
            </Text>
            <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
              {moment(localTripData?.startDate).format("MMM DD") +
                " - " +
                moment(localTripData.endDate).format("MMM DD") +
                " "}
              ({localTripData?.totalNoOfDays} days)
            </Text>
          </View>
        </View>

        {/* Travelers Info  */}
        <View style={styles.infoContainer}>
          <Text style={styles.emoji}>🚌</Text>
          <View>
            <Text style={[styles.label, { color: currentTheme.textSecondary }]}>
              Who is Traveling
            </Text>
            <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
              {localTripData?.whoIsGoing}
            </Text>
          </View>
        </View>

        {/* Budget Info  */}
        <View style={styles.infoContainer}>
          <Text style={styles.emoji}>💰</Text>
          <View>
            <Text style={[styles.label, { color: currentTheme.textSecondary }]}>
              Budget
            </Text>
            <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
              {localTripData?.budget}
            </Text>
          </View>
        </View>

        {/* Traveler Type Info  */}
        <View style={styles.infoContainer}>
          <Text style={styles.emoji}>🧳</Text>
          <View>
            <Text style={[styles.label, { color: currentTheme.textSecondary }]}>
              Traveler Type
            </Text>
            <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
              {localTripData?.travelerType}
            </Text>
          </View>
        </View>

        {/* Accommodation Type Info  */}
        <View style={styles.infoContainer}>
          <Text style={styles.emoji}>🏨</Text>
          <View>
            <Text style={[styles.label, { color: currentTheme.textSecondary }]}>
              Accommodation Type
            </Text>
            <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
              {localTripData?.accommodationType}
            </Text>
          </View>
        </View>

        {/* Activity Level Info  */}
        <View style={styles.infoContainer}>
          <Text style={styles.emoji}>🏃‍♂️</Text>
          <View>
            <Text style={[styles.label, { color: currentTheme.textSecondary }]}>
              Activity Level
            </Text>
            <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
              {localTripData?.activityLevel}
            </Text>
          </View>
        </View>
      </View>

      <MainButton
        onPress={() => navigation.navigate("GenerateTrip")}
        buttonText="Build My Trip"
        style={styles.button}
        backgroundColor={currentTheme.alternate}
        width="80%"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    height: "100%",
  },
  title: {
    fontSize: 16,
  },
  contentContainer: {
    marginTop: 10,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 25,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  emoji: {
    fontSize: 30,
  },
  label: {
    fontSize: 17,
  },
  value: {
    fontSize: 20,
  },
  button: {
    alignSelf: "center",
    marginTop: 50,
  },
});

export default ReviewTrip;
