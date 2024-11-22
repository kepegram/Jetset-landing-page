import React from "react";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { AltButton } from "../../../components/ui/button";
import { useTheme } from "../../../context/themeContext";

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Settings"
>;

const Settings: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            FIREBASE_AUTH.signOut();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        {/* Account Section Header with Icon */}
        <View style={styles.sectionHeaderContainer}>
          <Ionicons name="person-outline" size={24} color={currentTheme.icon} />
          <Text
            style={[styles.sectionHeader, { color: currentTheme.textPrimary }]}
          >
            Account
          </Text>
        </View>
        <View
          style={[styles.divider, { backgroundColor: currentTheme.inactive }]}
        />

        <Pressable
          style={styles.settingOption}
          onPress={() => navigation.navigate("Edit")}
        >
          <Text
            style={[styles.optionText, { color: currentTheme.textSecondary }]}
          >
            Edit Profile
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={currentTheme.icon}
          />
        </Pressable>

        <Pressable
          style={styles.settingOption}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text
            style={[styles.optionText, { color: currentTheme.textSecondary }]}
          >
            Change Password
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={currentTheme.icon}
          />
        </Pressable>

        <Pressable
          style={styles.settingOption}
          onPress={() => navigation.navigate("AppTheme")}
        >
          <Text
            style={[styles.optionText, { color: currentTheme.textSecondary }]}
          >
            App Theme
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={currentTheme.icon}
          />
        </Pressable>

        <Pressable style={styles.settingOption} onPress={() => {}}>
          <Text
            style={[styles.optionText, { color: currentTheme.textSecondary }]}
          >
            Privacy & Security
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={currentTheme.icon}
          />
        </Pressable>

        <Pressable
          style={styles.settingOption}
          onPress={() => navigation.navigate("DeleteAccount")}
        >
          <Text
            style={[styles.deleteOptionText, { color: currentTheme.error }]}
          >
            Delete account
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={currentTheme.error}
          />
        </Pressable>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <AltButton onPress={handleLogout} buttonText="Sign out" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  settingsContainer: {
    width: "90%",
    marginTop: 20,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  optionText: {
    fontSize: 18,
  },
  deleteOptionText: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    marginVertical: 5,
  },
  logoutContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
});

export default Settings;
