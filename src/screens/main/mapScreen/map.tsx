import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../../../context/themeContext";

const Map: React.FC = () => {
  const { currentTheme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: currentTheme.background,
      }}
    >
      <Text style={{ color: currentTheme.textPrimary }}>Map</Text>
    </View>
  );
};

export default Map;
