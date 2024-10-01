import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back button icon

type DestinationDetailViewProps = {
  navigation: StackNavigationProp<RootStackParamList, "DestinationDetailView">;
  route: RouteProp<RootStackParamList, "DestinationDetailView">;
};

const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={26} color="black" />
        {/* Black back arrow */}
      </Pressable>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.beds}>{item.beds} beds</Text>
        <Text style={styles.baths}>{item.baths} baths</Text>
      </View>
      <Pressable style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Planner</Text>
      </Pressable>
    </View>
  );
};

export default DestinationDetailView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginTop: 60, // Adjusted for better spacing
  },
  details: {
    marginTop: 20,
  },
  location: {
    fontSize: 24,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
    color: "#777",
  },
  beds: {
    fontSize: 16,
  },
  baths: {
    fontSize: 16,
  },
  backButton: {
    position: "absolute", // Position the back button at the top
    top: 45, // Distance from the top
    left: 20, // Distance from the left
  },
  addButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#A463FF",
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
