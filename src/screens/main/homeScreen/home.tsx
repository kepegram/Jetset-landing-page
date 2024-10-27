import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useProfile } from "../../../context/profileContext";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../../firebase.config";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const USERNAME = "kpegra1";

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { profilePicture } = useProfile();
  const [selectedCategory, setSelectedCategory] = useState("suggested");
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [visitedData, setVisitedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const ITEMS_PER_PAGE = 20;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Fetch data when the component mounts and on refresh
  useEffect(() => {
    if (!initialFetchDone) {
      fetchFilterDestinations(true);
      setInitialFetchDone(true);
    }
    fetchUserVisited();
  }, []);

  useEffect(() => {
    fetchFilterDestinations(true); // Fetch fresh data based on the selected filter
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchFilterDestinations(true);
    setRefreshing(false);
  };

  // Search handler with debouncing
  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
      setSearchLoading(true);
      try {
        const response = await fetch(
          `http://api.geonames.org/searchJSON?q=${text}&maxRows=10&username=${USERNAME}`
        );
        const data = await response.json();

        if (data.geonames) {
          const formattedResults = data.geonames.map((item) => ({
            id: item.geonameId,
            name: item.toponymName,
            country: item.countryName,
          }));
          setSearchResults(formattedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
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

        setSearchText("");
        setSearchResults([]);
      }}
    >
      <Text style={currentStyles.resultText}>
        {item.name}, {item.country}
      </Text>
    </Pressable>
  );

  const fetchCoordinates = async (location, address) => {
    const API_KEY = "28c0017aba5f471fa18fe9fdb3cd026e";
    const cacheKey = `${location}-${address}`;
    const cachedData = await AsyncStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData); // Return cached data if available
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location + ", " + address
    )}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry; // Get the latitude and longitude
        const coordinates = { latitude: lat, longitude: lng };

        // Cache the result in AsyncStorage
        await AsyncStorage.setItem(cacheKey, JSON.stringify(coordinates));

        return coordinates;
      } else {
        console.error("No coordinates found for location:", location);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const fetchFilterDestinations = async (reset = false) => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not logged in.");
        return;
      }

      const cacheKey = `destinations-${user.uid}-${filter}`; // Unique cache key per user and filter
      if (!reset) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setDestinationData(parsedData); // Load cached data if available
          setLoading(false);
          return;
        }
      }

      const visitedSnapshot = await getDocs(
        collection(FIREBASE_DB, `users/${user.uid}/visited`)
      );
      const bucketlistSnapshot = await getDocs(
        collection(FIREBASE_DB, `users/${user.uid}/bucketlist`)
      );

      const visitedItems = visitedSnapshot.docs.map((doc) => doc.data());
      const bucketlistItems = bucketlistSnapshot.docs.map((doc) => doc.data());

      const response = await fetch(
        `http://api.geonames.org/countryInfoJSON?username=${USERNAME}`
      );
      const data = await response.json();

      if (!data.geonames) {
        throw new Error("Geonames data not found in response");
      }

      const filteredByContinent = data.geonames.filter((item) => {
        if (filter === "All") return true;
        return item.continentName === filter;
      });

      const uniqueCountries = new Set();
      const formattedData = await Promise.all(
        filteredByContinent.map(async (item, index) => {
          const isVisited = visitedItems.some(
            (visited) => visited.location === item.countryName
          );
          const isInBucketlist = bucketlistItems.some(
            (bucketlist) => bucketlist.location === item.countryName
          );

          if (
            !isVisited &&
            !isInBucketlist &&
            !uniqueCountries.has(item.countryCode) &&
            item.countryName &&
            item.countryName.trim() !== "" &&
            item.capital &&
            item.capital.trim() !== ""
          ) {
            uniqueCountries.add(item.countryCode);

            // Fetch image from Pexels API
            const pexelsImage = await fetchPexelsImage(item.countryName);

            return {
              id: `${item.countryCode}-${index}`, // Ensure unique key by appending index
              image: pexelsImage || "https://via.placeholder.com/400",
              location: item.countryName,
              address: item.capital,
              population: item.population || "N/A",
              continent: item.continent || "N/A",
            };
          }
          return null;
        })
      );

      const resolvedData = formattedData.filter((item) => item !== null);
      const shuffledData = resolvedData.sort(() => Math.random() - 0.5);
      const paginatedData = shuffledData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );

      if (reset) {
        setDestinationData(paginatedData);
      } else {
        setDestinationData((prev) => [...prev, ...paginatedData]);
      }

      // Cache the result in AsyncStorage
      await AsyncStorage.setItem(cacheKey, JSON.stringify(paginatedData));
    } catch (error) {
      console.error("Error fetching destination data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Function to fetch an image from Pexels API based on the country name
  const fetchPexelsImage = async (countryName) => {
    const cacheKey = `pexelsImage-${countryName}`; // Unique key for each country
    const cachedData = await AsyncStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData); // Return cached image URL if available
    }

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
        const imageUrl = data.photos[0].src.medium;

        // Cache the image URL in AsyncStorage
        await AsyncStorage.setItem(cacheKey, JSON.stringify(imageUrl));

        return imageUrl;
      }

      return null; // Return null if no image is found
    } catch (error) {
      console.error("Error fetching image from Pexels: ", error);
      return null;
    }
  };

  // Function to add an item to the visited list
  const addToVisited = async (item) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(
          "Error",
          "You need to be logged in to add items to the visited list."
        );
        return;
      }

      // Use the user's ID to create a collection specific to that user
      await addDoc(collection(FIREBASE_DB, `users/${user.uid}/visited`), {
        location: item.location,
        address: item.address,
        image: item.image,
        timestamp: new Date(),
      });

      // Update state to reflect the change
      setVisitedData((prev) => [...prev, item]);
      setDestinationData((prev) => prev.filter((data) => data.id !== item.id));
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Error",
        "There was an error adding the trip to your visited items"
      );
    }
  };

  // Function to add an item to the bucket list
  const addToBucketlist = async (item) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(
          "Error",
          "You need to be logged in to add items to the bucket list."
        );
        return;
      }

      // Use the user's ID to create a collection specific to that user
      await addDoc(collection(FIREBASE_DB, `users/${user.uid}/bucketlist`), {
        location: item.location,
        address: item.address,
        image: item.image,
        timestamp: new Date(),
      });

      // Update state to reflect the change
      setDestinationData((prev) => prev.filter((data) => data.id !== item.id));
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Error",
        "There was a problem adding the trip to your bucket list."
      );
    }
  };

  const fetchUserVisited = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const visitedQuery = query(
          collection(FIREBASE_DB, `users/${user.uid}/visited`)
        );
        const visitedSnapshot = await getDocs(visitedQuery);
        const visitedList = visitedSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, // Use Firestore document ID as the unique ID
        }));
        setVisitedData(visitedList);
      }
    } catch (error) {
      console.error("Error fetching visited data:", error);
    }
  };

  const deleteVisitedItem = async (id: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You need to be logged in to delete items.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this visited item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Create a reference to the document to delete
              const docRef = doc(FIREBASE_DB, `users/${user.uid}/visited`, id);

              // Delete the document
              await deleteDoc(docRef);

              // Update state to reflect the change
              setVisitedData((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
              console.error("Error deleting document: ", error);
              Alert.alert(
                "Error",
                "There was an error deleting the visited item."
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View>
      <Pressable
        style={currentStyles.card}
        onPress={async () => {
          // Call fetchCoordinates when the user clicks on the item
          const coordinates = await fetchCoordinates(
            item.address,
            item.location
          );

          console.log("Navigating to DestinationDetailView with item:", {
            ...item,
            latitude: coordinates?.latitude || 0,
            longitude: coordinates?.longitude || 0,
          });

          navigation.navigate("DestinationDetailView", {
            item: {
              ...item,
              latitude: coordinates?.latitude || 0,
              longitude: coordinates?.longitude || 0,
            },
          });
        }}
      >
        <Image source={{ uri: item.image }} style={currentStyles.image} />
        <View style={currentStyles.cardBody}>
          <View style={currentStyles.textContainer}>
            <View>
              <Text style={currentStyles.location}>{item.address}</Text>
              <Text style={currentStyles.address}>{item.location}</Text>
            </View>
            {selectedCategory === "suggested" && (
              <View style={currentStyles.actionsContainer}>
                <Pressable onPress={() => addToVisited(item)}>
                  <Text style={currentStyles.action1Text}>Add to Visited</Text>
                </Pressable>
                <Pressable onPress={() => addToBucketlist(item)}>
                  <Text style={currentStyles.action2Text}>
                    Add to Bucketlist
                  </Text>
                </Pressable>
              </View>
            )}
            {selectedCategory === "visited" && (
              <Pressable onPress={() => deleteVisitedItem(item.id)}>
                <AntDesign name="delete" size={24} color="red" />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );

  const filteredData =
    selectedCategory === "suggested" ? destinationData : visitedData;
  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.topBar}>
        <Text style={currentStyles.appName}>Jetset</Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: profilePicture }}
            style={currentStyles.profilePicture}
          />
        </Pressable>
      </View>
      <View style={currentStyles.inputContainer}>
        <View style={currentStyles.iconContainer}>
          <Ionicons name="search" size={20} color="#888" />
        </View>
        <TextInput
          style={currentStyles.searchInput}
          placeholder="Search destinations"
          placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>

      {/* Display search results */}
      {searchLoading ? (
        <ActivityIndicator size="small" color="grey" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResultItem}
          contentContainerStyle={currentStyles.resultList}
        />
      ) : (
        <Text></Text>
      )}

      <View style={currentStyles.switchContainer}>
        <Pressable
          onPress={() => setSelectedCategory("suggested")}
          style={[
            currentStyles.switchButton,
            selectedCategory === "suggested" && currentStyles.selectedButton,
          ]}
        >
          <Text
            style={[
              currentStyles.switchText,
              selectedCategory === "suggested" && currentStyles.selectedText,
            ]}
          >
            Suggested
          </Text>
        </Pressable>

        <View style={currentStyles.divider} />

        <Pressable
          onPress={() => setSelectedCategory("visited")}
          style={[
            currentStyles.switchButton,
            selectedCategory === "visited" && currentStyles.selectedButton,
          ]}
        >
          <Text
            style={[
              currentStyles.switchText,
              selectedCategory === "visited" && currentStyles.selectedText,
            ]}
          >
            Visited
          </Text>
        </Pressable>
      </View>

      {selectedCategory === "suggested" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={currentStyles.filterContainer}
        >
          <Text style={currentStyles.filterLabel}>Continent:</Text>
          <Pressable
            style={[
              currentStyles.filterButton,
              filter === "All" && currentStyles.filterSelectedButton,
            ]}
            onPress={() => setFilter("All")}
          >
            <Text
              style={[
                currentStyles.filterButtonText,
                filter === "All" && currentStyles.filterSelectedButtonText,
              ]}
            >
              All
            </Text>
          </Pressable>
          <Pressable
            style={[
              currentStyles.filterButton,
              filter === "North America" && currentStyles.filterSelectedButton,
            ]}
            onPress={() => setFilter("North America")}
          >
            <Text
              style={[
                currentStyles.filterButtonText,
                filter === "North America" &&
                  currentStyles.filterSelectedButtonText,
              ]}
            >
              North America
            </Text>
          </Pressable>
          <Pressable
            style={[
              currentStyles.filterButton,
              filter === "Europe" && currentStyles.filterSelectedButton,
            ]}
            onPress={() => setFilter("Europe")}
          >
            <Text
              style={[
                currentStyles.filterButtonText,
                filter === "Europe" && currentStyles.filterSelectedButtonText,
              ]}
            >
              Europe
            </Text>
          </Pressable>
          <Pressable
            style={[
              currentStyles.filterButton,
              filter === "Asia" && currentStyles.filterSelectedButton,
            ]}
            onPress={() => setFilter("Asia")}
          >
            <Text
              style={[
                currentStyles.filterButtonText,
                filter === "Asia" && currentStyles.filterSelectedButtonText,
              ]}
            >
              Asia
            </Text>
          </Pressable>
          <Pressable
            style={[
              currentStyles.filterButton,
              filter === "Africa" && currentStyles.filterSelectedButton,
            ]}
            onPress={() => setFilter("Africa")}
          >
            <Text
              style={[
                currentStyles.filterButtonText,
                filter === "Africa" && currentStyles.filterSelectedButtonText,
              ]}
            >
              Africa
            </Text>
          </Pressable>
          <Pressable
            style={[
              currentStyles.filterButton,
              filter === "South America" && currentStyles.filterSelectedButton,
            ]}
            onPress={() => setFilter("South America")}
          >
            <Text
              style={[
                currentStyles.filterButtonText,
                filter === "South America" &&
                  currentStyles.filterSelectedButtonText,
              ]}
            >
              South America
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="grey" />
      ) : destinationData.length === 0 ? (
        <Text style={currentStyles.noDataText}>No destinations found.</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    color: "#333",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#eee",
    borderRadius: 15,
    height: 45,
    paddingHorizontal: 15,
  },
  iconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
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
    color: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    color: "#888",
  },
  selectedButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#A463FF",
    width: "20%",
  },
  selectedText: {
    color: "#000",
    fontWeight: "bold",
  },
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#ddd",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 10,
    height: 52,
  },
  filterLabel: {
    fontSize: 16,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    color: "#000",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    height: 33,
  },
  filterSelectedButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#A463FF",
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 14,
    flexShrink: 0,
  },
  filterSelectedButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    flexShrink: 0,
  },
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 12,
    flexGrow: 1,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  address: {
    fontSize: 14,
    color: "#888",
  },
  actionsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  action1Text: {
    color: "#A463FF",
    fontSize: 14,
    marginBottom: 5,
  },
  action2Text: {
    color: "#000",
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
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
  inputContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#212121",
    borderRadius: 15,
    height: 45,
    paddingHorizontal: 15,
  },
  iconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
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
    color: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    color: "#888",
  },
  selectedButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#A463FF",
    width: "20%",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#ddd",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 10,
    height: 52,
  },
  filterLabel: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    color: "#fff",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    height: 33,
  },
  filterSelectedButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#A463FF",
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: "#707070",
    fontWeight: "bold",
    fontSize: 14,
    flexShrink: 0,
  },
  filterSelectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    flexShrink: 0,
  },
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#1c1c1e",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 12,
    flexGrow: 1,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  address: {
    fontSize: 14,
    color: "#888",
  },
  actionsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  action1Text: {
    color: "#A463FF",
    fontSize: 14,
    marginBottom: 5,
  },
  action2Text: {
    color: "#fff",
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
