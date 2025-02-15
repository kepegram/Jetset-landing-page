import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { CreateTripContext } from "../../../../context/createTripContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/themeContext";
import moment from "moment";
import { MainButton } from "../../../../components/ui/button";

type ReviewTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReviewTrip"
>;

const ReviewTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<ReviewTripScreenNavigationProp>();
  const { tripData } = useContext(CreateTripContext) || {};
  // Local state to track trip data changes
  const [localTripData, setLocalTripData] = useState(tripData);

  // Update local state when trip data changes
  useEffect(() => {
    setLocalTripData(tripData);
  }, [tripData]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.contentContainer}>
        {/* Header Section */}
        <Text style={[styles.subtitle, { color: currentTheme.textPrimary }]}>
          Review your trip details 🔍
        </Text>
        <Text style={[styles.title, { color: currentTheme.textSecondary }]}>
          Final step!
        </Text>
        <View style={styles.reviewContainer}>
          {/* Destination Information Card */}
          <View
            style={[
              styles.infoContainer,
              { backgroundColor: currentTheme.accentBackground },
            ]}
          >
            <Text style={styles.emoji}>📍</Text>
            <View style={styles.infoTextContainer}>
              <Text
                style={[styles.label, { color: currentTheme.textSecondary }]}
              >
                Destination
              </Text>
              <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
                {localTripData?.destinationType ||
                  localTripData?.locationInfo?.name ||
                  localTripData?.name}
              </Text>
            </View>
          </View>

          {/* Travel Dates Card */}
          <View
            style={[
              styles.infoContainer,
              { backgroundColor: currentTheme.accentBackground },
            ]}
          >
            <Text style={styles.emoji}>🗓️</Text>
            <View style={styles.infoTextContainer}>
              <Text
                style={[styles.label, { color: currentTheme.textSecondary }]}
              >
                Travel Date
              </Text>
              <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
                {moment(localTripData?.startDate).format("MMM DD") +
                  " - " +
                  moment(localTripData?.endDate).format("MMM DD") +
                  " "}
                ({localTripData?.totalNoOfDays} days)
              </Text>
            </View>
          </View>

          {/* Travelers Information Card */}
          <View
            style={[
              styles.infoContainer,
              { backgroundColor: currentTheme.accentBackground },
            ]}
          >
            <Text style={styles.emoji}>🚌</Text>
            <View style={styles.infoTextContainer}>
              <Text
                style={[styles.label, { color: currentTheme.textSecondary }]}
              >
                Who is Traveling
              </Text>
              <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
                {localTripData?.whoIsGoing}
              </Text>
            </View>
          </View>

          {/* Budget Information Card */}
          <View
            style={[
              styles.infoContainer,
              { backgroundColor: currentTheme.accentBackground },
            ]}
          >
            <Text style={styles.emoji}>💰</Text>
            <View style={styles.infoTextContainer}>
              <Text
                style={[styles.label, { color: currentTheme.textSecondary }]}
              >
                Budget
              </Text>
              <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
                {localTripData?.budget}
              </Text>
            </View>
          </View>

          {/* Activity Level Card */}
          <View
            style={[
              styles.infoContainer,
              { backgroundColor: currentTheme.accentBackground },
            ]}
          >
            <Text style={styles.emoji}>🏃‍♂️</Text>
            <View style={styles.infoTextContainer}>
              <Text
                style={[styles.label, { color: currentTheme.textSecondary }]}
              >
                Activity Level
              </Text>
              <Text style={[styles.value, { color: currentTheme.textPrimary }]}>
                {localTripData?.activityLevel}
              </Text>
            </View>
          </View>
        </View>

        {/* Generate Trip Button */}
        <View style={styles.buttonContainer}>
          <MainButton
            onPress={() => navigation.navigate("GenerateTrip")}
            buttonText="Build My Trip"
            style={styles.button}
            backgroundColor={currentTheme.alternate}
            width="85%"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  reviewContainer: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "outfit",
    opacity: 0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    lineHeight: 38,
  },
  infoContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "outfit",
    opacity: 0.8,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontFamily: "outfit-medium",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    marginTop: 0,
  },
});

export default ReviewTrip;
