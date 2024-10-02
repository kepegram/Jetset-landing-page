import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider } from "../settingsScreen/profileContext";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Home from "../homeScreen/home";
import Explore from "../exploreScreen/explore";
import Profile from "../settingsScreen/profile";
import Edit from "../settingsScreen/edit";
import Settings from "../settingsScreen/settings";
import Planner from "../plannerScreen/planner";
import Memories from "../memoriesScreen/memories";
import Community from "../communityScreen/community";
import DestinationDetailView from "../homeScreen/destinationDetail";
import ChangePassword from "../settingsScreen/changePassword";

export type RootStackParamList = {
  Home: undefined;
  DestinationDetailView: {
    item: {
      image: string;
      location: string;
      address: string;
      beds: number;
      baths: number;
    };
  };
  Profile: undefined;
  Edit: undefined;
  Settings: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
  return (
    <ProfileProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="DestinationDetailView"
          component={DestinationDetailView}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Navigator>
    </ProfileProvider>
  );
};

const Tab = createBottomTabNavigator();

const AppNav: React.FC = () => {
  return (
    <ProfileProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarActiveTintColor: "#A463FF",
          tabBarInactiveTintColor: "#aaa",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
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
              <MaterialIcons name="travel-explore" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Planner"
          component={Planner}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="book" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Memories"
          component={Memories}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Groups"
          component={Community}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="users" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </ProfileProvider>
  );
};

export default AppNav;
