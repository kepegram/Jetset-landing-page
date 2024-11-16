import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useTheme } from "../context/themeContext";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { ProfileProvider } from "../context/profileContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import Home from "../screens/main/homeScreen/home";
import Profile from "../screens/main/userScreens/profile";
import Edit from "../screens/main/userScreens/edit";
import Settings from "../screens/main/userScreens/settings";
import ChangePassword from "../screens/main/userScreens/changePassword";
import AppTheme from "../screens/main/userScreens/appTheme";
import DeleteAccount from "../screens/main/userScreens/deleteAccount";
import SearchPlace from "../screens/main/buildTripScreens/searchPlace";
import { CreateTripContext } from "../context/CreateTripContext";
import SelectTraveler from "../screens/main/buildTripScreens/selectTraveler";
import SelectDates from "../screens/main/buildTripScreens/selectDates";
import SetBudget from "../screens/main/buildTripScreens/setBudget";
import ReviewTrip from "../screens/main/buildTripScreens/reviewTrip";

// Define types for root stack params
export type RootStackParamList = {
  App: undefined;
  Home: undefined;
  SearchPlace: undefined;
  SelectTraveler: undefined;
  SelectDates: undefined;
  SetBudget: undefined;
  ReviewTrip: undefined;
  Profile: undefined;
  Edit: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  AppTheme: undefined;
  DeleteAccount: undefined;
};

// Create the main root stack
const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppStack: React.FC = () => {
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

  const tripBuilderScreenOptions = ({
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
    headerRight: () => (
      <Pressable
        onPress={() => {
          Alert.alert(
            "Reset",
            "Are you sure you want to reset your trip? All progress will be lost.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: () => navigation.navigate("Home"),
              },
            ]
          );
        }}
      >
        <Text
          style={{
            color: currentTheme.alternate,
            marginRight: 10,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Reset
        </Text>
      </Pressable>
    ),
  });

  // Custom options for Profile screen
  const profileScreenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    title: "Your Profile",
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
        name="SearchPlace"
        component={SearchPlace}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="SelectTraveler"
        component={SelectTraveler}
        options={({ navigation }) => ({
          ...tripBuilderScreenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="SelectDates"
        component={SelectDates}
        options={({ navigation }) => ({
          ...tripBuilderScreenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="SetBudget"
        component={SetBudget}
        options={({ navigation }) => ({
          ...tripBuilderScreenOptions({ navigation }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="ReviewTrip"
        component={ReviewTrip}
        options={({ navigation }) => ({
          ...tripBuilderScreenOptions({ navigation }),
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
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
          animation: "slide_from_left",
          headerLeft: () => null,
          headerBackVisible: false,
          gestureEnabled: false,
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

const getTabBarStyle = (route: any): { display?: string } | undefined => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  if (
    routeName === "SearchPlace" ||
    routeName === "SelectTraveler" ||
    routeName === "SelectDates" ||
    routeName === "SetBudget" ||
    routeName === "ReviewTrip" ||
    routeName === "Profile" ||
    routeName === "Edit" ||
    routeName === "Settings" ||
    routeName === "ChangePassword" ||
    routeName === "AppTheme" ||
    routeName === "DeleteAccount"
  ) {
    return { display: "none" };
  }
  return undefined;
};

const TabNavigator: React.FC = () => {
  const { currentTheme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: currentTheme.tabIcon,
        tabBarInactiveTintColor: currentTheme.inactiveTabIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={AppStack}
        options={({ route }) => {
          const tabBarStyle = {
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" color={color} size={30} />
            ),
            tabBarStyle,
            tabBarButton: (props) => (
              <Pressable
                {...props}
                onPress={() => {
                  Haptics.selectionAsync();
                }}
              />
            ),
          } as BottomTabNavigationOptions;
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator Component
const AppNav: React.FC = () => {
  const { theme } = useTheme();
  const [tripData, setTripData] = useState<any>([]);
  return (
    <ProfileProvider>
      <CreateTripContext.Provider value={{ tripData, setTripData }}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <RootStack.Navigator>
          <RootStack.Screen
            name="App"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </CreateTripContext.Provider>
    </ProfileProvider>
  );
};

export default AppNav;
