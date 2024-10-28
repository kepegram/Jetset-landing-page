import React, { useEffect, useState, useCallback } from "react";
import { Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { User, onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FIREBASE_AUTH } from "./firebase.config";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import Welcome from "./src/screens/onboarding/welcome/welcome";
import Login from "./src/screens/onboarding/userAuth/login";
import SignUp from "./src/screens/onboarding/userAuth/signup";
import ForgotPassword from "./src/screens/onboarding/userAuth/forgotPassword";
import AppNav from "./src/screens/main/tabNavigator/appNav";
import { ThemeProvider } from "./src/context/themeContext";
import Carousel from "./src/screens/onboarding/carousel/carousel";

export type RootStackParamList = {
  Welcome: undefined;
  Carousel: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  AppTabNav: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const screenOptions = ({ navigation }: any) => ({
    headerStyle: {
      backgroundColor: colorScheme === "dark" ? "#121212" : "#fff",
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0,
    },
    headerLeft: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={colorScheme === "dark" ? "#fff" : "black"}
          style={{ marginLeft: 15 }}
        />
      </Pressable>
    ),
    headerTitle: "",
  });

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer onReady={onLayoutRootView}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack.Navigator initialRouteName="Welcome">
          {user ? (
            <Stack.Screen
              name="AppTabNav"
              component={AppNav}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Carousel"
                component={Carousel}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={screenOptions}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={screenOptions}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
