import { StyleSheet, View, Animated, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

const AppTheme: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark";
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isDarkTheme ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isDarkTheme]);

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#fff", "#121212"],
  });

  const animatedTextColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#fff"],
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: animatedBackgroundColor }]}
    >
      <View style={styles.themeContainer}>
        <Animated.Text style={[styles.title, { color: animatedTextColor }]}>
          Choose Your Theme
        </Animated.Text>

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
            <Animated.Text
              style={[styles.optionText, { color: animatedTextColor }]}
            >
              Light Mode
            </Animated.Text>
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
            <Animated.Text
              style={[styles.optionText, { color: animatedTextColor }]}
            >
              Dark Mode
            </Animated.Text>
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
    </Animated.View>
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
    borderColor: "#666",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCheckmark: {
    backgroundColor: "#387694",
    borderColor: "#387694",
  },
});
