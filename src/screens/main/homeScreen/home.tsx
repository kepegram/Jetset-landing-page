import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useProfile } from "../profileScreen/profileContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import AntDesign from "@expo/vector-icons/AntDesign";
import SwitchSelector from "react-native-switch-selector";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../../firebase.config";
import { doc, getDoc } from "firebase/firestore";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Home: React.FC = () => {
  const { profilePicture } = useProfile();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("u");
  const [userName, setUserName] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data()?.name);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserName();
  }, [auth]);

  const [unvisitedData, setUnvisitedData] = useState([
    {
      id: "1",
      image:
        "https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Bali, Indonesia",
      address: "123 Main St",
      beds: "3",
      baths: "2",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1720747588320-5116a13e5dba?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Aspen, Colorado",
      address: "456 Oak Ave",
      beds: "4",
      baths: "3",
    },
    {
      id: "3",
      image:
        "https://plus.unsplash.com/premium_photo-1661963265512-73e8d1053b9a?q=80&w=2910&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Rome, Italy",
      address: "789 Maple Rd",
      beds: "2",
      baths: "1",
    },
    {
      id: "4",
      image:
        "https://plus.unsplash.com/premium_photo-1661902398022-762e88ff3f82?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Tokyo, Japan",
      address: "789 Maple Rd",
      beds: "2",
      baths: "1",
    },
  ]);

  const [visitedData, setVisitedData] = useState([
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1662265955250-76ea201aff0d?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Labadee, Haiti",
      address: "123 Main St",
      beds: "3",
      baths: "2",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1559956144-83a135c9872e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Coco Cay, Bahamas",
      address: "456 Oak Ave",
      beds: "4",
      baths: "3",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1515885267349-1fcef6e00fd1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Juneau, Alaska",
      address: "789 Maple Rd",
      beds: "2",
      baths: "1",
    },
    {
      id: "4",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
      location: "Paris, France",
      address: "789 Maple Rd",
      beds: "2",
      baths: "1",
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
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("DestinationDetailView", { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.address}>{item.address}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.beds}>{item.beds} beds</Text>
        <Text style={styles.baths}>{item.baths} baths</Text>

        {selectedCategory === "u" && (
          <>
            <Pressable onPress={() => addToVisited(item)}>
              <Text style={styles.action1Text}>Add to Visited</Text>
            </Pressable>
            <Pressable onPress={() => addToBucketList(item)}>
              <Text style={styles.action2Text}>Add to Planner</Text>
            </Pressable>
          </>
        )}
        {selectedCategory === "v" && (
          <Pressable onPress={() => deleteVisitedItem(item.id)}>
            <AntDesign name="delete" size={24} color="red" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );

  const filteredData =
    selectedCategory === "u"
      ? unvisitedData.filter((item) =>
          item.location.toLowerCase().includes(searchText.toLowerCase())
        )
      : visitedData.filter((item) =>
          item.location.toLowerCase().includes(searchText.toLowerCase())
        );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>
          Welcome to{" "}
          <Text style={{ color: "orange", fontWeight: "bold" }}>Jetset</Text>,{" "}
          {userName || "Guest"}
        </Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            onChangeText={handleSearch}
            value={searchText}
          />
          <SwitchSelector
            style={styles.switchSelector}
            initial={0}
            onPress={(value: string) => {
              setSelectedCategory(value);
              setSearchText("");
            }}
            textColor={"#000"}
            selectedColor={"white"}
            buttonColor={"#A463FF"}
            hasPadding
            options={[
              { label: "Unvisited", value: "u" },
              { label: "Visited", value: "v" },
            ]}
          />
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
    backgroundColor: "#dadada",
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
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A463FF",
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  searchInputContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "orange",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  switchSelector: {
    marginBottom: 10,
  },
  destinationListContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 10,
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  beds: {
    fontSize: 14,
  },
  baths: {
    fontSize: 14,
  },
  action1Text: {
    color: "#A463FF",
    fontWeight: "bold",
    marginRight: 10,
  },
  action2Text: {
    color: "orange",
    fontWeight: "bold",
  },
});
