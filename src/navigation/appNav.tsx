import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../context/themeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { ProfileProvider } from "../context/profileContext";
import { Ionicons } from "@expo/vector-icons";
import { toastStyles } from "../theme/theme";
import { StatusBar } from "expo-status-bar";
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";
import Home from "../screens/main/homeScreen/home";
import Profile from "../screens/main/profileScreen/profile";
import Edit from "../screens/main/profileScreen/edit";
import Settings from "../screens/main/profileScreen/settings";
import ChangePassword from "../screens/main/profileScreen/changePassword";
import AppTheme from "../screens/main/profileScreen/appTheme";
import DeleteAccount from "../screens/main/profileScreen/deleteAccount";
import Trips from "../screens/main/tripsScreen/trips";
import DestinationDetailView from "../screens/main/homeScreen/destinationDetail";
import TripBuilder from "../screens/main/tripsScreen/tripBuilder";

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View
      style={{
        padding: 16,
        backgroundColor: toastStyles.success.primary,
        borderRadius: 8,
      }}
    >
      {text1 ? (
        <Text style={{ color: toastStyles.success.text, fontWeight: "bold" }}>
          {text1}
        </Text>
      ) : null}
      {text2 ? (
        <Text style={{ color: toastStyles.success.text }}>{text2}</Text>
      ) : null}
    </View>
  ),
  error: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View
      style={{
        padding: 16,
        backgroundColor: toastStyles.error.primary,
        borderRadius: 8,
      }}
    >
      {text1 ? (
        <Text style={{ color: toastStyles.error.text, fontWeight: "bold" }}>
          {text1}
        </Text>
      ) : null}
      {text2 ? (
        <Text style={{ color: toastStyles.error.text }}>{text2}</Text>
      ) : null}
    </View>
  ),
};

// Define types for root stack params
export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Trips: undefined;
  TripBuilder: { tripDetails: any };
  DestinationDetailView: {
    item: {
      image: string;
      country: string;
      state: string;
      city: string;
      population: string;
      region: string;
      continent: string;
      longitude: number;
      latitude: number;
    };
  };
  Profile: undefined;
  Edit: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  AppTheme: undefined;
  DeleteAccount: undefined;
};

// Create the main root stack
const RootStack = createNativeStackNavigator<RootStackParamList>();

const HomeStack: React.FC = () => {
  const { currentTheme } = useTheme();

  const screenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    headerStyle: {
      backgroundColor: currentTheme.background,
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={currentTheme.textPrimary}
          style={{ marginLeft: 10 }}
        />
      </Pressable>
    ),
    headerTitleStyle: {
      color: currentTheme.textPrimary,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  // Custom options for Profile screen
  const profileScreenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    animation: "slide_from_left",
    ...screenOptions({ navigation }),
    headerLeft: () => (
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Ionicons
          name="settings-sharp"
          size={28}
          color={currentTheme.textPrimary}
          style={{ marginLeft: 10 }}
        />
      </Pressable>
    ),
    headerRight: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-forward-sharp"
          size={28}
          color={currentTheme.textPrimary}
          style={{ marginRight: 10 }}
        />
      </Pressable>
    ),
  });

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Trips"
        component={Trips}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="DestinationDetailView"
        component={DestinationDetailView}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="Profile"
        component={Profile}
        options={profileScreenOptions}
      />
      <RootStack.Screen
        name="TripBuilder"
        component={TripBuilder}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          animation: "slide_from_left",
          headerLeft: () => null,
          headerBackVisible: false, // This hides the default back button on iOS
          gestureEnabled: false, // This disables the swipe-back gesture
          headerRight: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-forward-sharp"
                size={28}
                color={currentTheme.textPrimary}
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        })}
      />
      <RootStack.Screen
        name="Edit"
        component={Edit}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          animation: "none",
        })}
      />
      <RootStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Change Password",
          animation: "none",
        })}
      />
      <RootStack.Screen
        name="AppTheme"
        component={AppTheme}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
          animation: "none",
        })}
      />
      <RootStack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Delete Account",
          animation: "none",
        })}
      />
    </RootStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

// Root Navigator Component
const AppNav: React.FC = () => {
  const { theme } = useTheme();
  return (
    <ProfileProvider>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <RootStack.Navigator>
        <RootStack.Screen
          name="Main"
          component={HomeStack}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
      <Toast config={toastConfig} />
    </ProfileProvider>
  );
};

export default AppNav;
