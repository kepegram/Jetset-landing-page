import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useTheme } from "../../../../context/themeContext";

type DoYouKnowNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DoYouKnow"
>;

const DoYouKnow: React.FC = () => {
  const navigation = useNavigation<DoYouKnowNavigationProp>();
  const { currentTheme } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.subheading, { color: currentTheme.textSecondary }]}>
          Destination
        </Text>
        <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
          Do you know where you want to go?
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => navigation.navigate("SearchPlaces")}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? currentTheme.alternate : 'transparent',
                borderColor: currentTheme.textPrimary,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>
              Yes, I know my destination
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("ChoosePlaces")}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? currentTheme.alternate : 'transparent',
                borderColor: currentTheme.textPrimary,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>
              No, help me choose
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 100,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  }
});

export default DoYouKnow;
