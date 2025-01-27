import React from "react";
import { Pressable, StyleSheet, Text, View, Alert, SafeAreaView } from "react-native";
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
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.settingsContainer}>
        {/* Account Section Header with Icon */}
        <View style={styles.sectionHeaderContainer}>
          <Ionicons name="person-outline" size={28} color={currentTheme.icon} />
          <Text
            style={[styles.sectionHeader, { color: currentTheme.textPrimary }]}
          >
            Account
          </Text>
        </View>
        <View
          style={[styles.divider, { backgroundColor: currentTheme.inactive }]}
        />

        {/* Settings Options */}
        <View style={styles.optionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              { backgroundColor: pressed ? currentTheme.inactive + '20' : 'transparent' }
            ]}
            onPress={() => navigation.navigate("Edit")}
          >
            <View style={styles.optionContent}>
              <Ionicons name="person-circle-outline" size={24} color={currentTheme.icon} />
              <Text style={[styles.optionText, { color: currentTheme.textSecondary }]}>
                Edit Profile
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              { backgroundColor: pressed ? currentTheme.inactive + '20' : 'transparent' }
            ]}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.optionContent}>
              <Ionicons name="lock-closed-outline" size={24} color={currentTheme.icon} />
              <Text style={[styles.optionText, { color: currentTheme.textSecondary }]}>
                Change Password
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              { backgroundColor: pressed ? currentTheme.inactive + '20' : 'transparent' }
            ]}
            onPress={() => navigation.navigate("AppTheme")}
          >
            <View style={styles.optionContent}>
              <Ionicons name="color-palette-outline" size={24} color={currentTheme.icon} />
              <Text style={[styles.optionText, { color: currentTheme.textSecondary }]}>
                App Theme
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              { backgroundColor: pressed ? currentTheme.inactive + '20' : 'transparent' }
            ]}
            onPress={() => {}}
          >
            <View style={styles.optionContent}>
              <Ionicons name="shield-outline" size={24} color={currentTheme.icon} />
              <Text style={[styles.optionText, { color: currentTheme.textSecondary }]}>
                Privacy & Security
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingOption,
              pressed && styles.optionPressed,
              { backgroundColor: pressed ? currentTheme.error + '20' : 'transparent' }
            ]}
            onPress={() => navigation.navigate("DeleteAccount")}
          >
            <View style={styles.optionContent}>
              <Ionicons name="trash-outline" size={24} color={currentTheme.error} />
              <Text style={[styles.deleteOptionText, { color: currentTheme.error }]}>
                Delete account
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={currentTheme.error} />
          </Pressable>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <AltButton onPress={handleLogout} buttonText="Sign out" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsContainer: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  optionsContainer: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionPressed: {
    opacity: 0.8,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
  },
  deleteOptionText: {
    fontSize: 18,
    marginLeft: 15,
  },
  divider: {
    height: 1,
    marginVertical: 5,
  },
  logoutContainer: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
});

export default Settings;
