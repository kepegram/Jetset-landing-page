import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
  const [travelerType, setTravelerType] = useState<string>("Average");
  const [accommodationType, setAccommodationType] = useState<string>("Hotel");
  const [activityLevel, setActivityLevel] = useState<string>("Normal");
  const [budget, setBudget] = useState<string>("Average");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.subheading, { color: currentTheme.textPrimary }]}>
          More Info
        </Text>
        <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
          Choose other options so we can generate the best trip for you
        </Text>
      </View>

      <View style={styles.dropdownsContainer}>
        {/* Accommodation Type */}
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Ionicons
              name="bed-outline"
              size={22}
              color={currentTheme.textPrimary}
            />
            <Text
              style={[styles.labelText, { color: currentTheme.textPrimary }]}
            >
              Accommodation Type
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
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.textPrimary,
              },
            ]}
            itemTextStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
          />
        </View>

        {/* Activity Level */}
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Ionicons
              name="walk-outline"
              size={22}
              color={currentTheme.textPrimary}
            />
            <Text
              style={[styles.labelText, { color: currentTheme.textPrimary }]}
            >
              Activity Level
            </Text>
          </View>
          <Dropdown
            data={[
              { label: "Normal", value: "Normal" },
              { label: "High", value: "High" },
              { label: "Low", value: "Low" },
            ]}
            labelField="label"
            valueField="value"
            value={activityLevel}
            onChange={(item) => setActivityLevel(item.value)}
            style={[
              styles.dropdown,
              {
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.textPrimary,
              },
            ]}
            itemTextStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
          />
        </View>

        {/* Budget */}
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Ionicons
              name="wallet-outline"
              size={22}
              color={currentTheme.textPrimary}
            />
            <Text
              style={[styles.labelText, { color: currentTheme.textPrimary }]}
            >
              Budget
            </Text>
          </View>
          <Dropdown
            data={[
              { label: "Frugal", value: "Frugal" },
              { label: "Average", value: "Average" },
              { label: "Luxury", value: "Luxury" },
            ]}
            labelField="label"
            valueField="value"
            value={budget}
            onChange={(item) => setBudget(item.value)}
            style={[
              styles.dropdown,
              {
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.textPrimary,
              },
            ]}
            itemTextStyle={{ color: currentTheme.textPrimary }}
            selectedTextStyle={{ color: currentTheme.textPrimary }}
            placeholderStyle={{ color: currentTheme.textPrimary }}
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
          buttonText="Review"
          width="80%"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    position: "absolute",
    paddingTop: 10,
    top: 100,
    left: 20,
    right: 20,
  },
  subheading: {
    fontSize: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
  dropdownsContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 50,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 40,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelText: {
    paddingLeft: 10,
    fontSize: 18,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
});

export default MoreInfo;
