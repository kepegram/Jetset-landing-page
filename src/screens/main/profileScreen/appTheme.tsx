import { StyleSheet, Switch, Text, View } from "react-native";
import React from "react";
import { useTheme } from "./themeContext"; // Import the custom hook

const AppTheme: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function from context

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      <Text style={currentStyles.text}>Current Theme: {theme}</Text>

      <Switch
        thumbColor={"#f4f3f4"}
        onValueChange={toggleTheme}
        value={theme === "dark"}
      />
    </View>
  );
};

export default AppTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "#f4f3f4",
    marginBottom: 10,
  },
});
