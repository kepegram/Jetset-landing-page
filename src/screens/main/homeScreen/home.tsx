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
import { RootStackParamList } from "../../../navigation/appNav";
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
import {
  fetchFilterDestinations,
  fetchCoordinates,
} from "../../../api/apiService";
import Toast from "react-native-toast-message";

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

  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Fetch data when the component mounts and on filter change
  useEffect(() => {
    if (!initialFetchDone) {
      fetchFilterDestinations(
        filter,
        setDestinationData,
        setLoading,
        currentPage,
        true // reset
      );
      setInitialFetchDone(true);
    }
    fetchUserVisited();
  }, [initialFetchDone]);

  useEffect(() => {
    fetchFilterDestinations(
      filter,
      setDestinationData,
      setLoading,
      currentPage,
      true // reset
    );
  }, [filter]);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchFilterDestinations(
      filter,
      setDestinationData,
      setLoading,
      1,
      true // reset
    );
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

  const addToVisited = async (item) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Toast.show({
          type: "error",
          text1: "Authentication Error",
          text2: "You need to be logged in to add items to the visited list.",
          visibilityTime: 3000,
        });
        return;
      }

      // Use the user's ID to create a collection specific to that user
      await addDoc(collection(FIREBASE_DB, `users/${user.uid}/visited`), {
        country: item.country,
        city: item.city,
        image: item.image,
        timestamp: new Date(),
      });

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `${item.city}, ${item.country} added to Visited List!`,
        visibilityTime: 3000,
      });

      // Update state to reflect the change
      setVisitedData((prev) => [...prev, item]);
      setDestinationData((prev) => prev.filter((data) => data.id !== item.id));
    } catch (error) {
      console.error("Error adding document: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was an error adding the trip to your visited items",
        visibilityTime: 3000,
      });
    }
  };

  const addToBucketlist = async (item) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Toast.show({
          type: "error",
          text1: "Authentication Error",
          text2: "You need to be logged in to add items to the bucket list.",
          visibilityTime: 3000,
        });
        return;
      }

      // Use the user's ID to create a collection specific to that user
      await addDoc(collection(FIREBASE_DB, `users/${user.uid}/bucketlist`), {
        country: item.country,
        city: item.city,
        image: item.image,
        timestamp: new Date(),
      });

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `${item.city}, ${item.country} added to Bucket List!`,
        visibilityTime: 3000,
      });

      // Update state to reflect the change
      setDestinationData((prev) => prev.filter((data) => data.id !== item.id));
    } catch (error) {
      console.error("Error adding document: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was a problem adding the trip to your bucket list.",
        visibilityTime: 3000,
      });
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="grey" />
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    bottom: "40%",
  },
});

export default Home;
