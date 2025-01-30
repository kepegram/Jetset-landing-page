import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { useContext, useState } from "react";
import { RootStackParamList } from "../../../../navigation/appNav";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/themeContext";
import { MainButton } from "../../../../components/ui/button";
import { Dropdown } from "react-native-element-dropdown";
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
  const [accommodationType, setAccommodationType] = useState<string>("Hotel");
  const [activityLevel, setActivityLevel] = useState<string>("Normal");
  const [budget, setBudget] = useState<string>("Average");

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

        <View style={styles.dropdownsContainer}>
          {/* Accommodation Type */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons
                name="bed-outline"
                size={24}
                color={currentTheme.alternate}
              />
              <Text
                style={[styles.labelText, { color: currentTheme.textPrimary }]}
              >
                Where would you like to stay?
              </Text>
            </View>
            <Dropdown
              data={[
                { label: "Hotel", value: "Hotel" },
                { label: "Hostel", value: "Hostel" },
                { label: "Airbnb", value: "Airbnb" },
              ]}
              labelField="label"
              valueField="value"
              value={accommodationType}
              onChange={(item) => setAccommodationType(item.value)}
              style={[
                styles.dropdown,
                {
                  backgroundColor: currentTheme.accentBackground,
                  borderColor: currentTheme.alternate,
                },
              ]}
              itemTextStyle={{ color: currentTheme.textPrimary }}
              selectedTextStyle={{ color: currentTheme.textPrimary }}
              placeholderStyle={{ color: currentTheme.textSecondary }}
              activeColor={currentTheme.accentBackground}
            />
          </View>

          {/* Activity Level */}
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
            <Dropdown
              data={[
                { label: "Take it easy", value: "Low" },
                { label: "Balanced mix", value: "Normal" },
                { label: "Adventure packed", value: "High" },
              ]}
              labelField="label"
              valueField="value"
              value={activityLevel}
              onChange={(item) => setActivityLevel(item.value)}
              style={[
                styles.dropdown,
                {
                  backgroundColor: currentTheme.accentBackground,
                  borderColor: currentTheme.alternate,
                },
              ]}
              itemTextStyle={{ color: currentTheme.textPrimary }}
              selectedTextStyle={{ color: currentTheme.textPrimary }}
              placeholderStyle={{ color: currentTheme.textSecondary }}
              activeColor={currentTheme.accentBackground}
            />
          </View>

          {/* Budget */}
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
            <Dropdown
              data={[
                { label: "Budget friendly", value: "Frugal" },
                { label: "Mid-range", value: "Average" },
                { label: "High-end", value: "Luxury" },
              ]}
              labelField="label"
              valueField="value"
              value={budget}
              onChange={(item) => setBudget(item.value)}
              style={[
                styles.dropdown,
                {
                  backgroundColor: currentTheme.accentBackground,
                  borderColor: currentTheme.alternate,
                },
              ]}
              itemTextStyle={{ color: currentTheme.textPrimary }}
              selectedTextStyle={{ color: currentTheme.textPrimary }}
              placeholderStyle={{ color: currentTheme.textSecondary }}
              activeColor={currentTheme.accentBackground}
            />
          </View>

          <MainButton
            onPress={() => {
              setTripData({
                ...tripData,
                accommodationType,
                activityLevel,
                budget,
              });
              console.log("Trip Data:", {
                ...tripData,
                accommodationType,
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
    marginBottom: 32,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dropdownsContainer: {
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
  dropdown: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 55,
  },
});

export default MoreInfo;
