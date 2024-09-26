import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../homeScreen/home";
import Notifications from "../notificationsScreen/notifications";
import Settings from "../settingsScreen/settings";
import Profile from "../profileScreen/profile";

// Create the tab navigator
const Tab = createBottomTabNavigator();

const AppTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#000",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#d3d3d3",
      }}
    >
      <Tab.Screen name="HomeScreen" component={Home} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default AppTabNav;


