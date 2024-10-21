import {
  StyleSheet,
  View,
  Image,
  Pressable,
  TextInput,
  FlatList,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useProfile } from "../profileScreen/profileContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useTheme } from "../profileScreen/themeContext";

type ExploreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Explore"
>;

const USERNAME = "kpegra1"; // Replace with your GeoNames username

const Explore: React.FC = () => {
  const { theme } = useTheme();
  const { profilePicture } = useProfile();
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchPexelsImage = async (countryName) => {
    const PEXELS_API_KEY =
      "VpRUFZAwfA3HA4cwIoYVnHO51Lr36RauMaODMYPSTJpPGbRkmtFLa7pX";
    const url = `https://api.pexels.com/v1/search?query=${countryName}&per_page=1`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.medium; // Return the first image's URL
      }

      return null; // Return null if no image is found
    } catch (error) {
      console.error("Error fetching image from Pexels: ", error);
      return null;
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text.length > 2) {
      try {
        const response = await fetch(
          `http://api.geonames.org/searchJSON?q=${text}&maxRows=10&username=${USERNAME}`
        );
        const data = await response.json();

        if (data.geonames) {
          // Fetch Pexels images for each geoname
          const formattedResults = await Promise.all(
            data.geonames.map(async (item) => {
              const pexelsImage = await fetchPexelsImage(item.countryName);
              return {
                id: item.geonameId,
                image: pexelsImage || "https://via.placeholder.com/400",
                location: item.countryName,
                address: item.capital,
                population: item.population || "N/A",
                continent: item.continent || "N/A",
              };
            })
          );
          setSearchResults(formattedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const renderResultItem = ({ item }) => (
    <Pressable
      style={currentStyles.resultItem}
      onPress={() => {
        console.log("Navigating to DestinationDetailView with item:", item);
        navigation.navigate("DestinationDetailView", { item });
      }}
    >
      <Text style={currentStyles.resultText}>
        {item.location}, {item.address}
      </Text>
    </Pressable>
  );

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

      {/* Display search results */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResultItem}
          contentContainerStyle={currentStyles.resultList}
        />
      ) : (
        <Text style={currentStyles.noResultsText}>Start your search now!</Text>
      )}
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Softer background for better readability
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  resultList: {
    padding: 10,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
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
    paddingBottom: 15,
    backgroundColor: "#121212",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  resultList: {
    padding: 10,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  resultText: {
    fontSize: 16,
    color: "#fff",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
