import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
  Appearance,
} from "react-native";
import { FIREBASE_AUTH } from "../../../../firebase.config";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../tabNavigator/appNav";
import { useNavigation } from "@react-navigation/native";
import { AltButton } from "../../../components/button";

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Settings"
>;

const Settings: React.FC = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

  const toggleSwitch = () => setNotificationsEnabled((prevState) => !prevState);

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

  const currentStyles = theme === "dark" ? darkStyles : styles;

  return (
    <View style={currentStyles.container}>
      {/* Back Button */}
      <View style={currentStyles.topIcons}>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Ionicons
            name="arrow-back"
            size={28}
            color={theme === "dark" ? "white" : "black"}
          />
        </Pressable>
      </View>

      <Text style={currentStyles.title}>Settings</Text>

      {/* Settings Options */}
      <View style={currentStyles.settingsContainer}>
        {/* Account Section Header with Icon */}
        <View style={currentStyles.sectionHeaderContainer}>
          <Ionicons name="person-outline" size={24} color="#A463FF" />
          <Text style={currentStyles.sectionHeader}>Account</Text>
        </View>
        <View style={currentStyles.divider} />

        <Pressable
          style={currentStyles.settingOption}
          onPress={() => navigation.navigate("Edit")}
        >
          <Text style={currentStyles.optionText}>Edit Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#777" />
        </Pressable>

        <Pressable
          style={currentStyles.settingOption}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={currentStyles.optionText}>Change Password</Text>
          <MaterialIcons name="chevron-right" size={24} color="#777" />
        </Pressable>

        <Pressable style={currentStyles.settingOption} onPress={() => {}}>
          <Text style={currentStyles.optionText}>Privacy & Security</Text>
          <MaterialIcons name="chevron-right" size={24} color="#777" />
        </Pressable>

        {/* Notifications Section Header with Icon */}
        <View style={currentStyles.sectionHeaderContainer}>
          <Ionicons name="notifications-outline" size={24} color="#A463FF" />
          <Text style={currentStyles.sectionHeader}>Notifications</Text>
        </View>
        <View style={currentStyles.divider} />

        {/* Notification Settings with Switch */}
        <View style={currentStyles.switchOption}>
          <Text style={currentStyles.switchText}>Enable Notifications</Text>
          <Switch
            thumbColor={"#f4f3f4"}
            onValueChange={toggleSwitch}
            value={notificationsEnabled}
          />
        </View>
      </View>

      {/* Logout Button */}
      <View style={currentStyles.logoutContainer}>
        <AltButton onPress={handleLogout} buttonText="Sign out" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topIcons: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 110,
    marginRight: 230,
    color: "#333",
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
    color: "#333",
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
    color: "#777",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  switchOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  switchText: {
    fontSize: 18,
    color: "#777",
  },
  logoutContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 20,
    width: "100%",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#121212",
  },
  topIcons: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 110,
    marginRight: 230,
    color: "white",
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
    color: "white",
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
    color: "#777",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  switchOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  switchText: {
    fontSize: 18,
    color: "#777",
  },
  logoutContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 20,
    width: "100%",
  },
});

export default Settings;
