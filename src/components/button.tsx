import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type ButtonProps = {
  buttonText: string;
  onPress: (event: GestureResponderEvent) => void; // onPress handler required
};

const Button: React.FC<ButtonProps> = ({ buttonText, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </Pressable>
  );
};

const AltButton: React.FC<ButtonProps> = ({ buttonText, onPress }) => {
  return (
    <Pressable style={styles.altButton} onPress={onPress}>
      <Text style={styles.altButtonText}>{buttonText}</Text>
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
    borderColor: "#A463FF",
    borderWidth: 1,
  },
  altButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 120,
    alignItems: "center",
    backgroundColor: "#A463FF", // Purple background for alternate button
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  altButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export { Button, AltButton };
