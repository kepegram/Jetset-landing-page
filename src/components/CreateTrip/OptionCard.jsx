import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../../context/themeContext";

export default function OptionCard({ option, selectedOption }) {
  const { currentTheme } = useTheme();
  return (
    <View
      style={[
        {
          padding: 25,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: currentTheme.accentBackground,
          borderRadius: 15,
        },
        selectedOption?.id == option?.id && {
          borderWidth: 2,
          borderColor: currentTheme.alternate,
        },
      ]}
    >
      <View>
        <Text
          style={{
            fontSize: 20,
            color: currentTheme.textPrimary,
          }}
        >
          {option?.title}
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: currentTheme.textSecondary,
          }}
        >
          {option?.desc}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 35,
        }}
      >
        {option.icon}
      </Text>
    </View>
  );
}
