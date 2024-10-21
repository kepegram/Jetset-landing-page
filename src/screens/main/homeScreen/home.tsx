import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useProfile } from "../profileScreen/profileContext";
import { useTheme } from "../profileScreen/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
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

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const USERNAME = "kpegra1"; // Your GeoNames username

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { profilePicture } = useProfile();
  const [selectedCategory, setSelectedCategory] = useState("suggested");
  const [refreshing, setRefreshing] = useState(false);
  const [destinationData, setDestinationData] = useState([]);
  const [visitedData, setVisitedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("All");

  const ITEMS_PER_PAGE = 20;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    fetchFilterDestinations(true);
    fetchUserVisited();
  }, [filter]);

  const fetchCoordinates = async (location, address) => {
    const API_KEY = "28c0017aba5f471fa18fe9fdb3cd026e"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location + ", " + address
    )}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry; // Get the latitude and longitude
        return { latitude: lat, longitude: lng };
      } else {
        console.error("No results found for location:", location);
        return null; // No coordinates found
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null; // Handle error
    }
  };

  const fetchFilterDestinations = async (reset = false) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User is not logged in.");
        return;
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

            // Fetch latitude and longitude using the fetchCoordinates function
            const coordinates = (await fetchCoordinates(
              item.capital,
              item.countryName
            )) || { latitude: 0, longitude: 0 }; // Fallback to 0

            return {
              id: `${item.countryCode}-${index}`, // Ensure unique key by appending index
              image: pexelsImage || "https://via.placeholder.com/400",
              location: item.countryName,
              address: item.capital,
              population: item.population || "N/A",
              continent: item.continent || "N/A",
              latitude: coordinates.latitude || 0, // Fallback to 0
              longitude: coordinates.longitude || 0, // Fallback to 0
            };
          }
          return null;
        })
      );

      const resolvedData = formattedData.filter((item) => item !== null);

      // Shuffle and paginate the data
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
    } catch (error) {
      console.error("Error fetching destination data:", error);
    }
  };

  // Function to fetch an image from Pexels API based on the country name
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

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1); // Reset the page
    fetchFilterDestinations(true);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View>
      <Pressable
        style={currentStyles.card}
        onPress={() =>
          navigation.navigate("DestinationDetailView", {
            item: {
              ...item,
              latitude: item.latitude, // Pass latitude
              longitude: item.longitude, // Pass longitude
            },
          })
        }
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
      <View style={currentStyles.cardDivider}></View>
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

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
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
    color: "#888", // Lighter color for unselected text
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
    height: 48,
  },
  filterLabel: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    color: "#000",
  },
  filterButton: {
    paddingHorizontal: 15, // Increased horizontal padding
    paddingVertical: 8, // Adjusted vertical padding for more space
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#A463FF",
    height: 33,
  },
  filterSelectedButton: {
    paddingHorizontal: 15, // Increased horizontal padding for consistency
    paddingVertical: 8, // Adjusted vertical padding for more space
    backgroundColor: "#A463FF",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14, // Reduced font size slightly to fit the container
    flexShrink: 0,
  },
  filterSelectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, // Reduced font size slightly to fit the container
    flexShrink: 0,
  },
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 10,
    elevation: 3,
    overflow: "hidden",
    backgroundColor: "#fff", // Optional for light theme
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
    flexDirection: "row", // Make location, address, and actions inline
    justifyContent: "space-between", // Spread them out across the container
    alignItems: "center", // Align them vertically centered
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
    flexDirection: "column", // Stack the actions in a column
    alignItems: "flex-end", // Align the actions to the right
  },
  action1Text: {
    color: "#A463FF",
    fontSize: 14,
    marginBottom: 5, // Add spacing between the two actions
  },
  action2Text: {
    color: "#000",
    fontSize: 14,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#ddd", // Subtle divider color
    marginBottom: 10,
    alignSelf: "stretch",
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
    borderBottomWidth: 3,
    borderBottomColor: "#A463FF",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#444",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 10,
    height: 48,
  },
  filterLabel: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    color: "#fff",
  },
  filterButton: {
    paddingHorizontal: 15, // Increased horizontal padding
    paddingVertical: 8, // Adjusted vertical padding for more space
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#A463FF",
    height: 33,
  },
  filterSelectedButton: {
    paddingHorizontal: 15, // Increased horizontal padding for consistency
    paddingVertical: 8, // Adjusted vertical padding for more space
    backgroundColor: "#A463FF",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, // Reduced font size slightly to fit the container
    flexShrink: 0,
  },
  filterSelectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, // Reduced font size slightly to fit the container
    flexShrink: 0,
  },
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    overflow: "hidden",
    backgroundColor: "#1c1c1e", // Dark background
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 12,
    paddingBottom: 20, // Add extra padding at the bottom for spacing
    flexGrow: 1,
  },
  textContainer: {
    flexDirection: "row", // Make location, address, and actions inline
    justifyContent: "space-between", // Spread them out across the container
    alignItems: "center", // Align them vertically centered
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
    flexDirection: "column", // Stack the actions in a column
    alignItems: "flex-end", // Align the actions to the right
  },
  action1Text: {
    color: "#A463FF",
    fontSize: 14,
    marginBottom: 5, // Add spacing between the two actions
  },
  action2Text: {
    color: "#fff",
    fontSize: 14,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#444", // Adjust this based on the theme
    marginBottom: 10,
    alignSelf: "stretch", // Ensures the divider stretches within the card, not the card itself
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
