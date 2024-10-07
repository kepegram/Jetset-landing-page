import React, { useState } from "react";
import { Appearance } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider } from "../profileScreen/profileContext";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Home from "../homeScreen/home";
import Explore from "../exploreScreen/explore";
import Profile from "../profileScreen/profile";
import Edit from "../profileScreen/edit";
import Settings from "../profileScreen/settings";
import Planner from "../plannerScreen/planner";
import Memories from "../memoriesScreen/memories";
import Community from "../communityScreen/community";
import DestinationDetailView from "../homeScreen/destinationDetail";
import ChangePassword from "../profileScreen/changePassword";
import DeleteAccount from "../profileScreen/deleteAccount";

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
  DeleteAccount: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
  return (
    <ProfileProvider>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="DestinationDetailView"
          component={DestinationDetailView}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
      </Stack.Navigator>
    </ProfileProvider>
  );
};

const Tab = createBottomTabNavigator();

const AppNav: React.FC = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });

  return (
    <ProfileProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme === "dark" ? "#121212" : "#fff",
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
          options={({ route }) => ({
            tabBarStyle: ((route) => {
              // Check if the current route is one of the screens where the tab bar should be hidden
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";
              if (
                routeName === "Edit" ||
                routeName === "Settings" ||
                routeName === "ChangePassword"
              ) {
                return { display: "none" };
              }
              return {
                backgroundColor: theme === "dark" ? "#121212" : "#fff",
              };
            })(route),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          })}
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
