import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useProfile } from "../profileScreen/profileContext";
import { useTheme } from "../profileScreen/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav"; // Update the import path
import { useNavigation } from "@react-navigation/native";

// Define the type for your navigation prop
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home" // You can include more if you have other screens to navigate
>;

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { profilePicture } = useProfile();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={styles.container}>
      <View style={currentStyles.topBar}>
        <Text style={currentStyles.appName}>Jetset</Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: profilePicture }}
            style={currentStyles.profilePicture}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333", // Subtle dark color for modern look
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
    backgroundColor: "#121212",
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
