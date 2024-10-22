import React from "react";
import { Pressable } from "react-native";
import { useTheme } from "../profileScreen/themeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { ProfileProvider } from "../profileScreen/profileContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Home from "../homeScreen/home";
import Profile from "../profileScreen/profile";
import Edit from "../profileScreen/edit";
import Settings from "../profileScreen/settings";
import Planner from "../plannerScreen/planner";
import Memories from "../memoriesScreen/memories";
import Community from "../communityScreen/community";
import DestinationDetailView from "../homeScreen/destinationDetail";
import ChangePassword from "../profileScreen/changePassword";
import AppTheme from "../profileScreen/appTheme";
import DeleteAccount from "../profileScreen/deleteAccount";
import TripBuilder from "../plannerScreen/tripBuilder";
import { StatusBar } from "expo-status-bar";

// Define types for root stack params
export type RootStackParamList = {
  Home: undefined;
  Explore: undefined;
  DestinationDetailView: {
    item: {
      image: string;
      location: string;
      address: string;
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
  Main: undefined; // Add Main route
};

// Create the main root stack
const RootStack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
  const { theme } = useTheme();

  const screenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    headerStyle: {
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={theme === "dark" ? "#fff" : "#000"}
          style={{ marginLeft: 10 }}
        />
      </Pressable>
    ),
    headerTitleStyle: {
      color: theme === "dark" ? "#fff" : "#000",
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
          color={theme === "dark" ? "#fff" : "#121212"}
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
          title: "Appearance",
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
  const { theme } = useTheme();

  const screenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    headerStyle: {
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={theme === "dark" ? "#fff" : "#000"}
          style={{ marginLeft: 10 }}
        />
      </Pressable>
    ),
    headerTitleStyle: {
      color: theme === "dark" ? "#fff" : "#000",
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
          color={theme === "dark" ? "#fff" : "#121212"}
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
          title: "Appearance",
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

// Tab Navigator Component
const TabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#A463FF", // Custom color
          borderTopWidth: 0, // Remove the top border
          borderRadius: 35, // Makes the bottom bar oval-shaped
          margin: 20, // Add space around the tab bar for a floating effect
          height: 60, // Adjust height for a better oval shape
          paddingBottom: 0, // Add padding for spacing
          position: "absolute", // Make it float above the screen
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#c093ff",
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
      <Tab.Screen
        name="Groups"
        component={Community}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" color={color} size={30} />
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
    </ProfileProvider>
  );
};

export default AppNav;
