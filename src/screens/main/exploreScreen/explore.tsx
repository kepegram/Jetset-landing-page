import { StyleSheet, View, Image, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { useProfile } from "../profileScreen/profileContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useTheme } from "../profileScreen/themeContext";

type ExploreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Explore"
>;

const Explore: React.FC = () => {
  const { theme } = useTheme();
  const { profilePicture } = useProfile();
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.topBar}>
        <TextInput
          style={currentStyles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          onChangeText={handleSearch}
          value={searchText}
        />
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

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Softer background for better readability
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc", // Subtle border for profile picture
  },
  searchInput: {
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: "75%",
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: "#1c1c1c",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444", // Dark mode border for profile picture
  },
  searchInput: {
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#555",
    backgroundColor: "#2b2b2b",
    width: "75%",
    height: 40,
    color: "#fff", // White text for dark mode
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
