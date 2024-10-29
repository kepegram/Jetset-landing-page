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
  const { currentTheme } = useTheme();
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
      style={styles.resultItem}
      onPress={() => {
        console.log("Navigating to DestinationDetailView with item:", item);
        navigation.navigate("DestinationDetailView", { item });

        setSearchText("");
        setSearchResults([]);
      }}
    >
      <Text style={[styles.resultText, { color: currentTheme.textPrimary }]}>
        {item.name}, {item.country}
      </Text>
    </Pressable>
  );

  const fetchCoordinates = async (country, city) => {
    const API_KEY = "28c0017aba5f471fa18fe9fdb3cd026e";
    const cacheKey = `${country}-${city}`;
    const cachedData = await AsyncStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData); // Return cached data if available
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      country + ", " + city
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
        console.error("No coordinates found for country:", country);
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
        filteredByContinent.map(async (item, index: number) => {
          const isVisited = visitedItems.some(
            (visited) => visited.country === item.countryName
          );
          const isInBucketlist = bucketlistItems.some(
            (bucketlist) => bucketlist.country === item.countryName
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
              country: item.countryName,
              city: item.capital,
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
  const fetchPexelsImage = async (countryName: string) => {
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
        const imageUrl = data.photos[0].src.original;

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
        country: item.country,
        city: item.city,
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
        country: item.country,
        city: item.city,
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
        style={[styles.card, { backgroundColor: currentTheme.alternate }]}
        onPress={async () => {
          const coordinates = await fetchCoordinates(item.city, item.country);
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
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardBody}>
          <View style={styles.textContainer}>
            <View>
              <Text style={[styles.city, { color: currentTheme.textPrimary }]}>
                {item.city}
              </Text>
              <Text
                style={[styles.country, { color: currentTheme.textSecondary }]}
              >
                {item.country}
              </Text>
            </View>
            {selectedCategory === "suggested" && (
              <View style={styles.actionsContainer}>
                <Pressable onPress={() => addToVisited(item)}>
                  <Text
                    style={[
                      styles.action1Text,
                      { color: currentTheme.primary },
                    ]}
                  >
                    Add to Visited
                  </Text>
                </Pressable>
                <Pressable onPress={() => addToBucketlist(item)}>
                  <Text
                    style={[
                      styles.action2Text,
                      { color: currentTheme.contrast },
                    ]}
                  >
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

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View
        style={[styles.topBar, { backgroundColor: currentTheme.background }]}
      >
        <Text style={[styles.appName, { color: currentTheme.textPrimary }]}>
          Jetset
        </Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        </Pressable>
      </View>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: currentTheme.alternate },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="search" size={20} color="#888" />
        </View>
        <TextInput
          style={[styles.searchInput, { color: currentTheme.textPrimary }]}
          placeholder="Search destinations"
          placeholderTextColor={currentTheme.secondary}
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>

      {searchLoading ? (
        <ActivityIndicator size="small" color="grey" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResultItem}
          contentContainerStyle={styles.resultList}
        />
      ) : (
        <Text></Text>
      )}

      <View style={styles.switchContainer}>
        <Pressable
          onPress={() => setSelectedCategory("suggested")}
          style={[
            styles.switchButton,
            selectedCategory === "suggested" && [
              styles.selectedButton,
              { borderBottomColor: currentTheme.contrast },
            ],
          ]}
        >
          <Text
            style={[
              styles.switchText,
              {
                color:
                  selectedCategory === "suggested"
                    ? currentTheme.textPrimary
                    : currentTheme.secondary,
              },
              selectedCategory === "suggested" && styles.selectedText,
            ]}
          >
            Suggested
          </Text>
        </Pressable>

        <View
          style={[styles.divider, { backgroundColor: currentTheme.secondary }]}
        />

        <Pressable
          onPress={() => setSelectedCategory("visited")}
          style={[
            styles.switchButton,
            selectedCategory === "visited" && [
              styles.selectedButton,
              { borderBottomColor: currentTheme.contrast },
            ],
          ]}
        >
          <Text
            style={[
              styles.switchText,
              {
                color:
                  selectedCategory === "visited"
                    ? currentTheme.primary
                    : currentTheme.secondary,
              },
              selectedCategory === "visited" && styles.selectedText,
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
          style={styles.filterContainer}
        >
          <Text style={[styles.filterLabel, { color: currentTheme.secondary }]}>
            Continent:
          </Text>
          <Pressable
            style={[
              styles.filterButton,
              filter === "All" && [
                styles.filterSelectedButton,
                { borderBottomColor: currentTheme.primary },
              ],
            ]}
            onPress={() => setFilter("All")}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    filter === "All"
                      ? currentTheme.textPrimary
                      : currentTheme.secondary,
                },
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === "North America" && [
                styles.filterSelectedButton,
                { borderBottomColor: currentTheme.primary },
              ],
            ]}
            onPress={() => setFilter("North America")}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    filter === "North America"
                      ? currentTheme.textPrimary
                      : currentTheme.secondary,
                },
              ]}
            >
              North America
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === "Europe" && [
                styles.filterSelectedButton,
                { borderBottomColor: currentTheme.primary },
              ],
            ]}
            onPress={() => setFilter("Europe")}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    filter === "Europe"
                      ? currentTheme.textPrimary
                      : currentTheme.secondary,
                },
              ]}
            >
              Europe
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === "Asia" && [
                styles.filterSelectedButton,
                { borderBottomColor: currentTheme.primary },
              ],
            ]}
            onPress={() => setFilter("Asia")}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    filter === "Asia"
                      ? currentTheme.textPrimary
                      : currentTheme.secondary,
                },
              ]}
            >
              Asia
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === "Africa" && [
                styles.filterSelectedButton,
                { borderBottomColor: currentTheme.primary },
              ],
            ]}
            onPress={() => setFilter("Africa")}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    filter === "Africa"
                      ? currentTheme.textPrimary
                      : currentTheme.secondary,
                },
              ]}
            >
              Africa
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filter === "South America" && [
                styles.filterSelectedButton,
                { borderBottomColor: currentTheme.primary },
              ],
            ]}
            onPress={() => setFilter("South America")}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    filter === "South America"
                      ? currentTheme.textPrimary
                      : currentTheme.secondary,
                },
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
        <Text
          style={[styles.noDataText, { color: currentTheme.textSecondary }]}
        >
          No destinations found.
        </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
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
  },
  selectedButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#A463FF",
    width: "20%",
  },
  selectedText: {
    fontWeight: "bold",
  },
  divider: {
    height: "100%",
    width: 1,
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
    marginHorizontal: 5,
  },
  filterButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    flexShrink: 0,
  },
  filterSelectedButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    flexShrink: 0,
  },
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
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
  city: {
    fontSize: 18,
    fontWeight: "bold",
  },
  country: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  action1Text: {
    fontSize: 14,
    marginBottom: 5,
  },
  action2Text: {
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    bottom: "40%",
  },
});

export default Home;
