import { StyleSheet, View, Animated, Image, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../../../context/themeContext";

const AppTheme: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
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
    outputRange: ["#000", "#fff"], // Black for light theme, white for dark theme
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: animatedBackgroundColor }]}
    >
      <View style={styles.buttonContainer}>
        <View style={styles.themeOption}>
          <Animated.Text style={[styles.label, { color: animatedTextColor }]}>
            Light Theme
          </Animated.Text>
          <Pressable onPress={() => toggleTheme("light")}>
            <Image
              source={require("../../../assets/app-light.png")}
              style={styles.image}
            />
          </Pressable>
          <Pressable
            style={[
              styles.radioButton,
              isDarkTheme ? styles.inactiveButton : styles.activeButton,
            ]}
            onPress={() => toggleTheme("light")}
          />
        </View>

        <View style={styles.themeOption}>
          <Animated.Text style={[styles.label, { color: animatedTextColor }]}>
            Dark Theme
          </Animated.Text>
          <Pressable onPress={() => toggleTheme("dark")}>
            <Image
              source={require("../../../assets/app-dark.png")}
              style={styles.image}
            />
          </Pressable>
          <Pressable
            style={[
              styles.radioButton,
              isDarkTheme ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => toggleTheme("dark")}
          />
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  themeOption: {
    alignItems: "center",
    flex: 1,
    padding: 10, // Added padding to separate the options
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 400,
    marginBottom: 10,
  },
  radioButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "#ffc071",
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
});
