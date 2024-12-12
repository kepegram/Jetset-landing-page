import React, { useState, useEffect } from "react";
import { Alert, Image, Pressable, Text } from "react-native";
import { useTheme } from "../context/themeContext";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { ProfileProvider, useProfile } from "../context/profileContext";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { CreateTripContext } from "../context/createTripContext";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import Home from "../screens/main/homeScreen/home";
import RecommendedTripDetails from "../screens/main/tripScreens/recommendedTripDetails";
import Profile from "../screens/main/userScreens/profile";
import Edit from "../screens/main/userScreens/edit";
import Settings from "../screens/main/userScreens/settings";
import ChangePassword from "../screens/main/userScreens/changePassword";
import AppTheme from "../screens/main/userScreens/appTheme";
import DeleteAccount from "../screens/main/userScreens/deleteAccount";
import BuildTrip from "../screens/main/tripScreens/buildTrip";
import ReviewTrip from "../screens/main/tripScreens/reviewTrip";
import GenerateTrip from "../screens/main/tripScreens/generateTrip";
import TripDetails from "../screens/main/tripScreens/tripDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyTrips from "../screens/main/tripScreens/myTrips";
import Preferences from "../screens/onboarding/welcome/preferences";
import Map from "../screens/main/mapScreen/map";

export type RootStackParamList = {
  Welcome: undefined;
  Carousel: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  AppNav: undefined;
  Preferences: { fromSignUp: boolean };
  App: undefined;
  Home: undefined;
  RecommendedTripDetails: { trip: string };
  MyTripsMain: undefined;
  BuildTrip: undefined;
  ReviewTrip: undefined;
  GenerateTrip: undefined;
  TripDetails: { trip: string };
  Profile: undefined;
  Edit: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  AppTheme: undefined;
  DeleteAccount: undefined;
  Map: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="RecommendedTripDetails"
        component={RecommendedTripDetails}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

const MyTripsStack: React.FC = () => {
  const { currentTheme } = useTheme();

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
                onPress: async () => {
                  await AsyncStorage.clear();
                  navigation.navigate("BuildTrip");
                },
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

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="MyTripsMain"
        component={MyTrips}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="BuildTrip"
        component={BuildTrip}
        options={{
          headerLeft: () => {
            const navigation = useNavigation();
            return (
              <Pressable
                onPress={async () => {
                  await AsyncStorage.clear();
                  navigation.goBack();
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </Pressable>
            );
          },
          headerShown: false,
        }}
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
        name="GenerateTrip"
        component={GenerateTrip}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="TripDetails"
        component={TripDetails}
        options={{
          headerLeft: () => {
            const navigation = useNavigation();
            return (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </Pressable>
            );
          },
          headerShown: false,
        }}
      />
    </RootStack.Navigator>
  );
};

const ProfileStack: React.FC = () => {
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

  const profileScreenOptions = ({
    navigation,
  }: {
    navigation: any;
  }): NativeStackNavigationOptions => ({
    title: "Your Profile",
    ...screenOptions({ navigation }),
    headerLeft: () => null,
    headerBackVisible: false,
  });

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          ...profileScreenOptions({ navigation }),
          title: "",
          headerShown: false,
        })}
      />
      <RootStack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
        })}
      />
      <RootStack.Screen
        name="Edit"
        component={Edit}
        options={({ navigation }) => ({
          ...screenOptions({ navigation }),
        })}
      />
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

const getTabBarStyle = (route: any): { display?: string } | undefined => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  if (
    routeName === "SearchPlace" ||
    routeName === "BuildTrip" ||
    routeName === "SelectTraveler" ||
    routeName === "SelectDates" ||
    routeName === "SetBudget" ||
    routeName === "ReviewTrip" ||
    routeName === "GenerateTrip" ||
    routeName === "Edit" ||
    routeName === "Settings" ||
    routeName === "ChangePassword" ||
    routeName === "AppTheme" ||
    routeName === "DeleteAccount" ||
    routeName === "RecommendedTripDetails" ||
    routeName === "TripDetails"
  ) {
    return { display: "none" };
  }
  return undefined;
};

const TabNavigator: React.FC = () => {
  const { currentTheme } = useTheme();
  const { profilePicture } = useProfile();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: currentTheme.tabIcon,
        tabBarInactiveTintColor: currentTheme.inactiveTabIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const tabBarStyle = {
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarStyle,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={30}
              />
            ),
          } as BottomTabNavigationOptions;
        }}
      />
      <Tab.Screen
        name="MyTrips"
        component={MyTripsStack}
        options={({ route }) => {
          const tabBarStyle = {
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarStyle,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "bag-suitcase" : "bag-suitcase-outline"}
                color={color}
                size={33}
              />
            ),
          } as BottomTabNavigationOptions;
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={({ route }) => {
          const tabBarStyle = {
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarStyle,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome
                name={focused ? "map" : "map-o"}
                color={color}
                size={26}
              />
            ),
          } as BottomTabNavigationOptions;
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={({ route }) => {
          const tabBarStyle = {
            backgroundColor: currentTheme.background,
            ...(getTabBarStyle(route) || {}),
          };
          return {
            tabBarStyle,
            tabBarIcon: ({ focused }) => (
              <Image
                source={{ uri: profilePicture }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  borderColor: focused
                    ? currentTheme.alternate
                    : currentTheme.background,
                  borderWidth: focused ? 2 : 0,
                }}
              />
            ),
          } as BottomTabNavigationOptions;
        }}
      />
    </Tab.Navigator>
  );
};

const AppNav: React.FC = () => {
  const { theme } = useTheme();
  const [tripData, setTripData] = useState<any>([]);
  const [preferencesSet, setPreferencesSet] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPreferencesSet = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const docRef = doc(
          FIREBASE_DB,
          `users/${user.uid}/userPreferences`,
          user.uid
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPreferencesSet(true);
          console.log("(APPNAV CHECK) Preferences: ", docSnap.data());
        } else {
          setPreferencesSet(false);
          console.log("(APPNAV CHECK) Preferences are not set");
        }
      } else {
        setPreferencesSet(false);
        console.log("(APPNAV CHECK) No user is signed in");
      }
    };

    checkPreferencesSet();
  }, []);

  if (preferencesSet === null) {
    return null;
  }

  return (
    <ProfileProvider>
      <CreateTripContext.Provider value={{ tripData, setTripData }}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <RootStack.Navigator
          initialRouteName={preferencesSet ? "App" : "Preferences"}
        >
          {!preferencesSet && (
            <RootStack.Screen
              name="Preferences"
              component={Preferences}
              options={{ headerShown: false }}
            />
          )}
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
