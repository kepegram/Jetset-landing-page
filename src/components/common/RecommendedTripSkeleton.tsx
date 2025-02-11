import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  Platform,
} from "react-native";
import { useTheme } from "../../context/themeContext";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface RecommendedTripSkeletonProps {
  loadingProgress?: number;
  isFirstCard?: boolean;
}

const RecommendedTripSkeleton: React.FC<RecommendedTripSkeletonProps> = ({
  loadingProgress = 0,
  isFirstCard = false,
}) => {
  const { currentTheme } = useTheme();
  const shimmerValue = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const translateX = shimmerValue.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={{ alignItems: "center" }}>
      {isFirstCard && (
        <Text
          style={[styles.loadingText, { color: currentTheme.textSecondary }]}
        >
          Generating trips... {loadingProgress}/3
        </Text>
      )}
      <View
        style={[
          styles.tripCard,
          { backgroundColor: currentTheme.accentBackground },
        ]}
      >
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.15)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>

        <View
          style={[
            styles.imageArea,
            { backgroundColor: currentTheme.textSecondary + "10" },
          ]}
        />
        <View style={styles.infoContainer}>
          <View
            style={[
              styles.locationIcon,
              { backgroundColor: currentTheme.textSecondary + "20" },
            ]}
          />
          <View style={styles.textContainer}>
            <View
              style={[
                styles.titleBar,
                { backgroundColor: currentTheme.textSecondary + "20" },
              ]}
            />
            <View
              style={[
                styles.descriptionBar,
                { backgroundColor: currentTheme.textSecondary + "20" },
              ]}
            />
            <View
              style={[
                styles.descriptionBar,
                {
                  width: "60%",
                  backgroundColor: currentTheme.textSecondary + "20",
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tripCard: {
    borderRadius: 15,
    marginRight: 20,
    width: width * 0.6,
    height: width * 0.8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shimmer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  imageArea: {
    width: "100%",
    height: width * 0.6,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    gap: 8,
  },
  locationIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  titleBar: {
    height: 20,
    width: "80%",
    borderRadius: 4,
  },
  descriptionBar: {
    height: 14,
    width: "90%",
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
  },
});

export default RecommendedTripSkeleton;
