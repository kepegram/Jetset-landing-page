import React, { useContext, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { CreateTripContext } from "../context/createTripContext";
import Home from "../screens/main/homeScreen/home";
import RecommendedTripDetails from "../screens/main/tripScreens/recommendedTripDetails";
import Profile from "../screens/main/userScreens/profile";
import Edit from "../screens/main/userScreens/edit";
import Settings from "../screens/main/userScreens/settings";
import ChangePassword from "../screens/main/userScreens/changePassword";
import AppTheme from "../screens/main/userScreens/appTheme";
import DeleteAccount from "../screens/main/userScreens/deleteAccount";
import ReviewTrip from "../screens/main/tripScreens/reviewTrip";
import GenerateTrip from "../screens/main/tripScreens/generateTrip";
import TripDetails from "../screens/main/tripScreens/tripDetails";
import MyTrips from "../screens/main/tripScreens/myTrips";
import CurrentTripDetails from "../screens/main/tripScreens/currentTripDetails";
import DoYouKnow from "../screens/main/tripScreens/buildTrip/doYouKnow";
import SearchPlaces from "../screens/main/tripScreens/buildTrip/searchPlaces";
import ChoosePlaces from "../screens/main/tripScreens/buildTrip/choosePlaces";
import ChooseDate from "../screens/main/tripScreens/buildTrip/chooseDate";
import WhosGoing from "../screens/main/tripScreens/buildTrip/whosGoing";
import MoreInfo from "../screens/main/tripScreens/buildTrip/moreInfo";

export type RootStackParamList = {
  Welcome: undefined;
  Carousel: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  AppNav: undefined;
  App: undefined;
  HomeMain: undefined;
  RecommendedTripDetails: { trip: string; photoRef: string };
  MyTripsMain: undefined;
  DoYouKnow: undefined;
  ChoosePlaces: undefined;
  SearchPlaces: undefined;
  ChooseDate: undefined;
  WhosGoing: undefined;
  MoreInfo: undefined;
  ReviewTrip: undefined;
  GenerateTrip: undefined;
  TripDetails: { trip: string };
  CurrentTripDetails: { trip: string };
  Profile: undefined;
  Edit: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  AppTheme: undefined;
  DeleteAccount: undefined;
  Map: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeStack: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="HomeMain"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="RecommendedTripDetails"
        component={RecommendedTripDetails}
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

const MyTripsStack: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setTripData } = useContext(CreateTripContext) || {};
  const screens = [
    "DoYouKnow",
    "ChoosePlaces",
    "SearchPlaces",
    "ChooseDate",
    "WhosGoing",
    "MoreInfo",
    "ReviewTrip",
    "GenerateTrip",
    "TripDetails",
  ];

  const tripBuilderScreenOptions = ({
    navigation,
    route,
  }: {
    navigation: any;
    route: any;
  }): NativeStackNavigationOptions => {
    const currentScreenIndex = screens.indexOf(route.name) + 1;
    const totalScreens = screens.length;
    const isFirstScreen = route.name === "DoYouKnow";
    const currentScreen = route.name;
    const previousScreen = screens[screens.indexOf(currentScreen) - 1];

    return {
      headerStyle: {
        backgroundColor: currentTheme.background,
      },
      headerShadowVisible: false,
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => {
              if (isFirstScreen) {
                navigation.navigate("MyTripsMain");
              } else {
                navigation.navigate(previousScreen);
              }
            }}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color={currentTheme.textPrimary}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
          {!isFirstScreen && (
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Reset Trip",
                  "Are you sure you want to reset? All progress will be lost.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        setTripData?.({});
                        navigation.navigate("MyTripsMain");
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons
                name="refresh"
                size={25}
                color={currentTheme.textPrimary}
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          )}
        </View>
      ),
      headerRight: () => (
        <Text
          style={{
            color: currentTheme.textPrimary,
            marginRight: 10,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          {`${currentScreenIndex} of ${totalScreens}`}
        </Text>
      ),
    };
  };

  return (
    <RootStack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <RootStack.Screen
        name="MyTripsMain"
        component={MyTrips}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="DoYouKnow"
        component={DoYouKnow}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="ChoosePlaces"
        component={ChoosePlaces}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="SearchPlaces"
        component={SearchPlaces}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="ChooseDate"
        component={ChooseDate}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="WhosGoing"
        component={WhosGoing}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="MoreInfo"
        component={MoreInfo}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
          title: "",
        })}
      />
      <RootStack.Screen
        name="ReviewTrip"
        component={ReviewTrip}
        options={({ navigation, route }) => ({
          ...tripBuilderScreenOptions({ navigation, route }),
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
      <RootStack.Screen
        name="CurrentTripDetails"
        component={CurrentTripDetails}
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

const getTabBarStyle = (route: any): { display?: string } | undefined => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  if (
    routeName === "SearchPlace" ||
    routeName === "BuildTrip" ||
    routeName === "DoYouKnow" ||
    routeName === "ChoosePlaces" ||
    routeName === "SearchPlaces" ||
    routeName === "ChooseDate" ||
    routeName === "WhosGoing" ||
    routeName === "MoreInfo" ||
    routeName === "ReviewTrip" ||
    routeName === "GenerateTrip" ||
    routeName === "RecommendedTripDetails" ||
    routeName === "TripDetails" ||
    routeName === "CurrentTripDetails" ||
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
  const { profilePicture } = useProfile();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
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
            tabBarLabel: "Home",
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
            tabBarLabel: "My Trips",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "airplane" : "airplane-outline"}
                color={color}
                size={33}
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
            tabBarLabel: "Profile",
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

  return (
    <ProfileProvider>
      <CreateTripContext.Provider value={{ tripData, setTripData }}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <RootStack.Navigator initialRouteName="App">
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
