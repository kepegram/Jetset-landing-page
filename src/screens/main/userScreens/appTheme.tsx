import { StyleSheet, View, Animated, Image, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../../../context/themeContext";

const AppTheme: React.FC = () => {
  const { theme, currentTheme, toggleTheme } = useTheme();
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
      <View style={styles.buttonContainer}>
        <View style={styles.themeOption}>
          <Animated.Text style={[styles.label, { color: animatedTextColor }]}>
            Light Theme
          </Animated.Text>
          <Pressable onPress={() => toggleTheme("light")}>
            <Image
              source={require("../../../assets/light.png")}
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

        <View style={styles.spacer} />

        <View style={styles.themeOption}>
          <Animated.Text style={[styles.label, { color: animatedTextColor }]}>
            Dark Theme
          </Animated.Text>
          <Pressable onPress={() => toggleTheme("dark")}>
            <Image
              source={require("../../../assets/dark.png")}
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
    padding: 20,
    width: "100%",
  },
  themeOption: {
    alignItems: "center",
    flex: 1,
    padding: 10,
  },
  spacer: {
    width: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 410,
    marginBottom: 10,
  },
  radioButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: "grey",
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "#387694",
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
});
