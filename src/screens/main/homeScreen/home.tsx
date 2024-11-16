import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useProfile } from "../../../context/profileContext";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Home: React.FC = () => {
  const { currentTheme } = useTheme();
  const { profilePicture } = useProfile();

  const navigation = useNavigation<HomeScreenNavigationProp>();

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
  topBar: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
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

export default Home;
