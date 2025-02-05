import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { RootStackParamList } from "../../../../navigation/appNav";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/themeContext";
import { MainButton } from "../../../../components/ui/button";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { CreateTripContext } from "../../../../context/createTripContext";

type MoreInfoNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MoreInfo"
>;

const MoreInfo: React.FC = () => {
  const navigation = useNavigation<MoreInfoNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [activityLevel, setActivityLevel] = useState<string>("Normal");
  const [budget, setBudget] = useState<string>("Average");

  // Reusable button component for selection options
  const SelectionButton = ({
    selected,
    onPress,
    label,
  }: {
    selected: boolean;
    onPress: () => void;
    label: string;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.selectionButton,
        {
          // Change background color based on selection state
          backgroundColor: selected
            ? currentTheme.alternate
            : currentTheme.accentBackground,
          borderColor: currentTheme.alternate,
        },
      ]}
    >
      <Text
        style={[
          styles.selectionText,
          // Change text color based on selection state
          { color: selected ? "#FFFFFF" : currentTheme.textPrimary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text
            style={[styles.subheading, { color: currentTheme.textSecondary }]}
          >
            Almost there!
          </Text>
          <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
            Let's customize your perfect trip
          </Text>
        </View>

        <View style={styles.selectionsContainer}>
          {/* Activity Level Selection Section */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons
                name="walk-outline"
                size={24}
                color={currentTheme.alternate}
              />
              <Text
                style={[styles.labelText, { color: currentTheme.textPrimary }]}
              >
                How active do you want to be?
              </Text>
            </View>
            {/* Activity level options */}
            <View style={styles.optionsContainer}>
              <SelectionButton
                selected={activityLevel === "Low"}
                onPress={() => setActivityLevel("Low")}
                label="Take it easy"
              />
              <SelectionButton
                selected={activityLevel === "Normal"}
                onPress={() => setActivityLevel("Normal")}
                label="Balanced mix"
              />
              <SelectionButton
                selected={activityLevel === "High"}
                onPress={() => setActivityLevel("High")}
                label="Adventure packed"
              />
            </View>
          </View>

          {/* Budget Selection Section */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons
                name="wallet-outline"
                size={24}
                color={currentTheme.alternate}
              />
              <Text
                style={[styles.labelText, { color: currentTheme.textPrimary }]}
              >
                What's your budget like?
              </Text>
            </View>
            <View style={styles.optionsContainer}>
              <SelectionButton
                selected={budget === "Frugal"}
                onPress={() => setBudget("Frugal")}
                label="Budget friendly"
              />
              <SelectionButton
                selected={budget === "Average"}
                onPress={() => setBudget("Average")}
                label="Mid-range"
              />
              <SelectionButton
                selected={budget === "Luxury"}
                onPress={() => setBudget("Luxury")}
                label="High-end"
              />
            </View>
          </View>

          {/* Continue Button */}
          <MainButton
            onPress={() => {
              // Update trip data with selected preferences
              setTripData({
                ...tripData,
                activityLevel,
                budget,
              });
              console.log("Trip Data:", {
                ...tripData,
                activityLevel,
                budget,
              });
              navigation.navigate("ReviewTrip");
            }}
            buttonText="Review Your Trip"
            width="85%"
            backgroundColor={currentTheme.alternate}
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
  headerContainer: {
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  selectionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 35,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  labelText: {
    paddingLeft: 12,
    fontSize: 18,
    fontWeight: "500",
  },
  optionsContainer: {
    flexDirection: "column",
    gap: 12,
  },
  selectionButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MoreInfo;
