import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";
import { RootStackParamList } from "../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type StartNewTripCardProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const StartNewTripCard: React.FC<StartNewTripCardProps> = ({ navigation }) => {
  const { currentTheme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
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
          size={30}
          color={currentTheme.alternate}
        />
        <Text
          style={{
            fontSize: 25,
            fontFamily: "outfit-medium",
            color: currentTheme.textPrimary,
          }}
        >
          No trips planned yet
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontFamily: "outfit",
            textAlign: "center",
            color: "gray",
          }}
        >
          Looks like its time to plan a new travel experinece! Get Started below
        </Text>

        <Pressable
          onPress={() => navigation.navigate("SearchPlace")}
          style={{
            padding: 15,
            backgroundColor: currentTheme.alternate,
            borderRadius: 15,
            paddingHorizontal: 30,
          }}
        >
          <Text
            style={{
              color: currentTheme.buttonText,
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}
          >
            Start a new trip
          </Text>
        </Pressable>
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
