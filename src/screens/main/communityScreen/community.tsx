import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Community = () => {
  return (
    <View style={styles.container}>
      <Text>Community</Text>
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dadada",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
