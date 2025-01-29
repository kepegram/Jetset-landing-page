import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";
import { RootStackParamList } from "../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainButton } from "../ui/button";

type StartNewTripCardProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  textColor?: string;
  subTextColor?: string;
};

const StartNewTripCard: React.FC<StartNewTripCardProps> = ({
  navigation,
  textColor,
  subTextColor,
}) => {
  const { currentTheme } = useTheme();
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.cardContainer,
          { backgroundColor: currentTheme.accentBackground },
        ]}
      >
        <View style={styles.contentContainer}>
          <MaterialCommunityIcons
            name="airplane-takeoff"
            size={50}
            color={currentTheme.alternate}
          />
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.titleText,
                { color: textColor || currentTheme.textPrimary },
              ]}
            >
              Ready for Your Next Adventure?
            </Text>
            <Text
              style={[
                styles.subtitleText,
                { color: subTextColor || currentTheme.textSecondary },
              ]}
            >
              Start planning your dream trip today and create unforgettable
              memories
            </Text>
          </View>
          <MainButton
            buttonText="Start Planning"
            onPress={() => navigation.navigate("WhereTo")}
            width={200}
            backgroundColor={currentTheme.alternate}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    padding: 30,
    alignItems: "center",
    gap: 25,
  },
  textContainer: {
    alignItems: "center",
    gap: 12,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default StartNewTripCard;
