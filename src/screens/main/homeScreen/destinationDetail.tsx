import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Pressable, Modal } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useTheme } from "../profileScreen/themeContext";

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
  const { item } = route.params;

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      {/* Confine the Pressable to the exact dimensions of the image */}
      <View style={currentStyles.imageWrapper}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image source={{ uri: item.image }} style={currentStyles.image} />
        </Pressable>
      </View>

      <View style={currentStyles.details}>
        <Text style={currentStyles.location}>{item.location}</Text>
        <Text style={currentStyles.address}>{item.address}</Text>
      </View>

      <Pressable style={currentStyles.addButton}>
        <Text style={currentStyles.addButtonText}>Add to Planner</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Image source={{ uri: item.image }} style={styles.modalImage} />
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
  },
  imageWrapper: {
    width: "100%", // Ensure that the wrapper has the same width as the image
    height: 300, // Same height as the image
  },
  image: {
    width: "100%",
    height: "100%", // Ensures the image takes up the entire wrapper's space
  },
  details: {
    marginTop: 20,
  },
  location: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  address: {
    fontSize: 16,
    color: "#777",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    alignItems: "center",
  },
  modalImage: {
    width: 400,
    height: 400,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  details: {
    marginTop: 20,
  },
  location: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  address: {
    fontSize: 16,
    color: "#777",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
  },
});
