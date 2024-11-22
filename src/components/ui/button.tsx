import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { useTheme } from "../../context/themeContext";

type ButtonProps = {
  buttonText: string;
  onPress: (event: GestureResponderEvent) => void;
};

const Button: React.FC<ButtonProps> = ({ buttonText, onPress }) => {
  const { currentTheme } = useTheme();

  return (
    <Pressable
      style={[styles.button, { borderColor: currentTheme.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>
        {buttonText}
      </Text>
    </Pressable>
  );
};

const AltButton: React.FC<ButtonProps> = ({ buttonText, onPress }) => {
  const { currentTheme } = useTheme();

  return (
    <Pressable
      style={[
        styles.altButton,
        { backgroundColor: currentTheme.buttonBackground },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.altButtonText, { color: currentTheme.buttonText }]}>
        {buttonText}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 120,
    alignItems: "center",
    borderWidth: 1,
  },
  altButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 120,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  altButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export { Button, AltButton };
