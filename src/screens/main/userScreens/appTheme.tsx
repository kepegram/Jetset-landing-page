import { StyleSheet, View, Pressable, Text } from "react-native";
import React from "react";
import { useTheme } from "../../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

const AppTheme: React.FC = () => {
  // Get theme context values
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#121212" : "#fff" },
      ]}
    >
      <View style={styles.themeContainer}>
        <Text style={[styles.title, { color: isDarkTheme ? "#fff" : "#000" }]}>
          Choose Your Theme
        </Text>

        <View style={styles.optionsContainer}>
          <Pressable
            style={[
              styles.themeOption,
              !isDarkTheme && styles.activeThemeOption,
              { borderColor: isDarkTheme ? "#666" : "#387694" },
            ]}
            onPress={() => setTheme("light")}
          >
            <Ionicons
              name="sunny"
              size={32}
              color={isDarkTheme ? "#666" : "#387694"}
            />
            <Text
              style={[
                styles.optionText,
                { color: isDarkTheme ? "#fff" : "#000" },
              ]}
            >
              Light Mode
            </Text>
            <View
              style={[styles.checkmark, !isDarkTheme && styles.activeCheckmark]}
            >
              {!isDarkTheme && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.themeOption,
              isDarkTheme && styles.activeThemeOption,
              { borderColor: isDarkTheme ? "#387694" : "#666" },
            ]}
            onPress={() => setTheme("dark")}
          >
            <Ionicons
              name="moon"
              size={32}
              color={isDarkTheme ? "#387694" : "#666"}
            />
            <Text
              style={[
                styles.optionText,
                { color: isDarkTheme ? "#fff" : "#000" },
              ]}
            >
              Dark Mode
            </Text>
            <View
              style={[styles.checkmark, isDarkTheme && styles.activeCheckmark]}
            >
              {isDarkTheme && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AppTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themeContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    marginBottom: 30,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 20,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  activeThemeOption: {
    backgroundColor: "rgba(56, 118, 148, 0.1)",
  },
  optionText: {
    fontSize: 18,
    fontFamily: "outfit",
    marginLeft: 15,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCheckmark: {
    backgroundColor: "#387694",
    borderColor: "#387694",
  },
});
