import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useProfile } from "../../../context/profileContext";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Home: React.FC = () => {
  const { currentTheme } = useTheme();
  const { profilePicture } = useProfile();

  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Animated.View
        style={[
          styles.topBar,
          {
            backgroundColor: currentTheme.background,
          },
        ]}
      >
        <View style={styles.topRow}>
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
  },
  appName: {
    fontSize: 25,
    fontWeight: "bold",
  },
  profilePicture: {
    width: 32,
    height: 32,
    borderRadius: 20,
  },
});

export default Home;
