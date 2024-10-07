import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  TextInput,
  Alert,
  Appearance,
} from "react-native";
import React, { useState } from "react";
import { useProfile } from "../profileScreen/profileContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import AntDesign from "@expo/vector-icons/AntDesign";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Home: React.FC = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const { profilePicture } = useProfile();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("unvisited");

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

  const [unvisitedData, setUnvisitedData] = useState([
    {
      id: "1",
      image:
        "https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Bali, Indonesia",
      address: "123 Main St",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1720747588320-5116a13e5dba?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Aspen, Colorado",
      address: "456 Oak Ave",
    },
    {
      id: "3",
      image:
        "https://plus.unsplash.com/premium_photo-1661963265512-73e8d1053b9a?q=80&w=2910&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Rome, Italy",
      address: "789 Maple Rd",
    },
    {
      id: "4",
      image:
        "https://plus.unsplash.com/premium_photo-1661902398022-762e88ff3f82?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Tokyo, Japan",
      address: "789 Maple Rd",
    },
  ]);

  const [visitedData, setVisitedData] = useState([
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1662265955250-76ea201aff0d?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Labadee, Haiti",
      address: "123 Main St",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1559956144-83a135c9872e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Coco Cay, Bahamas",
      address: "456 Oak Ave",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1515885267349-1fcef6e00fd1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Juneau, Alaska",
      address: "789 Maple Rd",
    },
    {
      id: "4",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
      location: "Paris, France",
      address: "789 Maple Rd",
    },
  ]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const addToVisited = (item) => {
    setVisitedData((prev) => [...prev, item]);
    setUnvisitedData((prev) => prev.filter((data) => data.id !== item.id));
  };

  const addToBucketList = (item) => {
    Alert.alert("Bucket List", `${item.location} added to bucket list.`);
  };

  const deleteVisitedItem = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this visited item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setVisitedData((prev) => prev.filter((item) => item.id !== id));
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
        onPress={() => navigation.navigate("DestinationDetailView", { item })}
      >
        <Image source={{ uri: item.image }} style={currentStyles.image} />

        <View style={currentStyles.cardBody}>
          <View style={currentStyles.textContainer}>
            <View>
              <Text style={currentStyles.location}>{item.location}</Text>
              <Text style={currentStyles.address}>{item.address}</Text>
            </View>

            {/* Actions aligned with the text */}
            {selectedCategory === "unvisited" && (
              <View style={currentStyles.actionsContainer}>
                <Pressable onPress={() => addToVisited(item)}>
                  <Text style={currentStyles.action1Text}>Add to Visited</Text>
                </Pressable>
                <Pressable onPress={() => addToBucketList(item)}>
                  <Text style={currentStyles.action2Text}>Add to Planner</Text>
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
    selectedCategory === "unvisited"
      ? unvisitedData.filter((item) =>
          item.location.toLowerCase().includes(searchText.toLowerCase())
        )
      : visitedData.filter((item) =>
          item.location.toLowerCase().includes(searchText.toLowerCase())
        );

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

      <View style={currentStyles.content}>
        <TextInput
          style={currentStyles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor={"#777"}
          onChangeText={handleSearch}
          value={searchText}
        />

        {/* Updated Pressable buttons with divider */}
        <View style={currentStyles.switchContainer}>
          <Pressable
            onPress={() => setSelectedCategory("unvisited")}
            style={[
              currentStyles.switchButton,
              selectedCategory === "unvisited" && currentStyles.selectedButton,
            ]}
          >
            <Text
              style={[
                currentStyles.switchText,
                selectedCategory === "unvisited" && currentStyles.selectedText,
              ]}
            >
              Unvisited
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

        <FlatList
          contentContainerStyle={styles.destinationListContainer}
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
  content: {
    flex: 1,
    paddingTop: 10,
  },
  searchInput: {
    paddingHorizontal: 10,
    marginBottom: 20,
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
    color: "#888", // Lighter color for unselected text
  },
  selectedButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#A463FF",
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
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
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
  content: {
    flex: 1,
    paddingTop: 10,
  },
  searchInput: {
    paddingHorizontal: 10,
    marginBottom: 20,
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
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
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
});
