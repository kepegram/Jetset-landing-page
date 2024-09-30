import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider } from "../profileScreen/profileContext";
import { Ionicons } from "@expo/vector-icons";
import Home from "../homeScreen/home";
import Notifications from "../notificationsScreen/notifications";
import Explore from "../exploreScreen/explore";
import Profile from "../profileScreen/profile";
import Edit from "../profileScreen/edit";
import Settings from "../profileScreen/settings";

export type RootStackParamList = {
  Profile: undefined;
  Edit: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileStack = () => {
  return (
    <ProfileProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </ProfileProvider>
  );
};

const Tab = createBottomTabNavigator();

const AppTabNav: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#A463FF",
        tabBarInactiveTintColor: "#d3d3d3",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNav;
