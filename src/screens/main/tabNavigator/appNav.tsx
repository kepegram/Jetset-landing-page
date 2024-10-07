import React from "react";
import { LogBox, Pressable } from "react-native";
import { useTheme } from "../profileScreen/themeContext";
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
import AppTheme from "../profileScreen/appTheme";
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
  AppTheme: undefined;
  DeleteAccount: undefined;
  Memories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
  const { theme } = useTheme(); // Get current color scheme

  const screenOptions = ({ navigation }: any) => ({
    headerStyle: {
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
      borderBottomWidth: 0, // Remove the bottom border
      shadowColor: "transparent", // Remove shadow on iOS
      elevation: 0, // Remove shadow on Android
    },
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
      color: theme === "dark" ? "#fff" : "#000", // Change the header font color based on the theme
      fontSize: 18, // You can also customize the font size
      fontWeight: "bold", // Customize font weight if needed
    },
  });

  return (
    <ProfileProvider>
      <Stack.Navigator>
        {/* Home screen with headerShown, no back button or custom header style */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />

        {/* Other screens where the custom header with no bottom border is applied */}
        <Stack.Screen
          name="DestinationDetailView"
          component={DestinationDetailView}
          options={screenOptions}
        />

        {/* Profile screen with an additional settings icon */}
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={({ navigation }) => ({
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
          })}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={screenOptions}
        />
        <Stack.Screen name="Edit" component={Edit} options={screenOptions} />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={({ navigation }) => ({
            ...screenOptions({ navigation }),
            title: "Change Password",
          })}
        />
        <Stack.Screen
          name="AppTheme"
          component={AppTheme}
          options={({ navigation }) => ({
            ...screenOptions({ navigation }),
            title: "App Theme",
          })}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{ ...screenOptions, title: "Delete Account" }}
        />
      </Stack.Navigator>
    </ProfileProvider>
  );
};

const Tab = createBottomTabNavigator();

const AppNav: React.FC = () => {
  const { theme } = useTheme();

  LogBox.ignoreLogs([
    " WARN  Found screens with the same name nested inside one another.",
  ]);

  // Appearance.addChangeListener((scheme) => {
  //   setTheme(scheme.colorScheme);
  // });

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
          options={({ route }) => {
            // Determine the focused route name
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            // Conditionally hide the tab bar for specific routes
            const shouldHideTabBar = [
              "Edit",
              "Settings",
              "ChangePassword",
            ].includes(routeName);

            return {
              tabBarStyle: shouldHideTabBar
                ? { display: "none" } // Hide tab bar on specific screens
                : {
                    backgroundColor: theme === "dark" ? "#121212" : "#fff",
                  },
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            };
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
