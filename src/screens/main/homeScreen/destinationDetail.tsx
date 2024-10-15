import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useTheme } from "../profileScreen/themeContext";
import { FIREBASE_DB } from "../../../../firebase.config";
import { collection, addDoc } from "firebase/firestore";

type DestinationDetailViewProps = {
  navigation: StackNavigationProp<RootStackParamList, "DestinationDetailView">;
  route: RouteProp<RootStackParamList, "DestinationDetailView">;
};

const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { item } = route.params ?? {}; // Handle possible undefined `route.params`
  const image = item?.image || "https://via.placeholder.com/400"; // Fallback image
  const country = item?.location || "Unknown location";
  const city = item?.address || "No address available";

  const currentStyles = theme === "dark" ? darkStyles : styles;

  const addToBucketlist = async (item) => {
    try {
      await addDoc(collection(FIREBASE_DB, "bucketlist"), {
        location: item.location,
        address: item.address,
        image: item.image,
        timestamp: new Date(),
      });

      Alert.alert("Bucketlist", `${item.location} added to bucket list.`, [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Error",
        "There was a problem adding the trip to your bucketlist."
      );
    }
  };

  return (
    <View style={currentStyles.container}>
      {/* Image section with modal trigger */}
      <View style={currentStyles.imageWrapper}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image source={{ uri: image }} style={currentStyles.image} />
        </Pressable>
      </View>

      {/* Destination details */}
      <View style={currentStyles.details}>
        <Text style={currentStyles.city}>{city}</Text>
        <Text style={currentStyles.country}>{country}</Text>
      </View>

      {/* Add to Planner button */}
      <Pressable
        style={currentStyles.addButton}
        onPress={() => addToBucketlist(item)}
      >
        <Text style={currentStyles.addButtonText}>Add to Planner</Text>
      </Pressable>

      {/* Modal to display enlarged image */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={currentStyles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={currentStyles.modalContent}>
            <Image source={{ uri: image }} style={currentStyles.modalImage} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DestinationDetailView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    marginTop: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  country: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#A463FF",
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalContent: {
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    marginTop: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  country: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#A463FF",
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  modalContent: {
    alignItems: "center",
  },
  modalImage: {
    width: 400,
    height: 400,
  },
});
