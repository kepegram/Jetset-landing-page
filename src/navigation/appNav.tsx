import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../context/themeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { ProfileProvider } from "../context/profileContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
import Planner from "../screens/main/plannerScreen/planner";
import Memories from "../screens/main/memoriesScreen/memories";
import DestinationDetailView from "../screens/main/homeScreen/destinationDetail";
import TripBuilder from "../screens/main/plannerScreen/tripBuilder";

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
  Home: undefined;
  Explore: undefined;
  DestinationDetailView: {
    item: {
      image: string;
      country: string;
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
  Planner: undefined;
  TripBuilder: { tripDetails: any };
  Memories: undefined;
  Main: undefined;
};

// Create the main root stack
const RootStack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
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
    ...screenOptions({ navigation }),
    headerRight: () => (
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Ionicons
          name="settings-sharp"
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
        options={screenOptions}
      />
      <RootStack.Screen name="Edit" component={Edit} options={screenOptions} />
      <RootStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Change Password",
        })}
      />
      <RootStack.Screen
        name="AppTheme"
        component={AppTheme}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Delete Account",
        })}
      />
    </RootStack.Navigator>
  );
};

const PlannerStack = () => {
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
    ...screenOptions({ navigation }),
    headerRight: () => (
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Ionicons
          name="settings-sharp"
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
        name="Planner"
        component={Planner}
        options={{ headerShown: false }}
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
        name="Profile"
        component={Profile}
        options={profileScreenOptions}
      />
      <RootStack.Screen
        name="Settings"
        component={Settings}
        options={screenOptions}
      />
      <RootStack.Screen name="Edit" component={Edit} options={screenOptions} />
      <RootStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Change Password",
        })}
      />
      <RootStack.Screen
        name="AppTheme"
        component={AppTheme}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "Delete Account",
        })}
      />
    </RootStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

// Bottom Tab Navigator Component
const TabNavigator: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentTheme.background,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: currentTheme.tabIcon,
        tabBarInactiveTintColor: currentTheme.inactiveTabIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Planner"
        component={PlannerStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="airplane-outline" color={color} size={34} />
          ),
        }}
      />
      <Tab.Screen
        name="Memories"
        component={Memories}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="picture" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator Component
const AppNav: React.FC = () => {
  const { theme } = useTheme();
  return (
    <ProfileProvider>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <RootStack.Navigator>
        <RootStack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
      <Toast config={toastConfig} />
    </ProfileProvider>
  );
};

export default AppNav;
