import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";
import { RootStackParamList } from "../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainButton } from "../ui/button";

type StartNewTripCardProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  textColor?: string; // Allow text color to be editable
  subTextColor?: string; // Allow subtext color to be editable
};

const StartNewTripCard: React.FC<StartNewTripCardProps> = ({
  navigation,
  textColor, // Destructure textColor from props
  subTextColor, // Destructure subTextColor from props
}) => {
  const { currentTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <View
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
          gap: 25,
        }}
      >
        <Ionicons
          name="location-sharp"
          size={50}
          color={currentTheme.alternate}
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: textColor || currentTheme.textPrimary,
          }}
        >
          No trips planned yet
        </Text>

        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            color: subTextColor || "gray",
          }}
        >
          Looks like its time to plan a new travel experience! Get Started below
        </Text>

        <MainButton
          buttonText="Start a new trip"
          onPress={() => navigation.navigate("BuildTrip")}
          width={200}
          backgroundColor={currentTheme.alternate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
  },
  appName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
});

export default StartNewTripCard;
