import "react-native-get-random-values";
import React, { useEffect, useState, useCallback } from "react";
import { Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FIREBASE_AUTH } from "./firebase.config";
import { useColorScheme } from "react-native";
import { ThemeProvider, useTheme } from "./src/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Welcome from "./src/screens/onboarding/welcome/welcome";
import Login from "./src/screens/onboarding/userAuth/login";
import SignUp from "./src/screens/onboarding/userAuth/signup";
import ForgotPassword from "./src/screens/onboarding/userAuth/forgotPassword";
import AppNav from "./src/navigation/appNav";
import Carousel from "./src/screens/onboarding/carousel/carousel";

export type RootStackParamList = {
  Welcome: undefined;
  Carousel: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Preferences: { fromSignUp: boolean };
  AppNav: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

WebBrowser.maybeCompleteAuthSession();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const { currentTheme } = useTheme();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "500450400417-sqtsj83q075sduha6dsrk3c19c9ac1ci.apps.googleusercontent.com",
    androidClientId:
      "500450400417-gg1pf3lqt2k98ov98u85aem2ekc2rsd8.apps.googleusercontent.com",
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params as { id_token: string };
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(FIREBASE_AUTH, credential)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in: ", user);
          })
          .catch((error) => {
            console.error("Error signing in with Google: ", error);
          });
      } else {
        console.error("No ID token found");
      }
    }
  }, [response]);

  useEffect(() => {
    const unsub = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

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

  const screenOptions = ({ navigation }: any) => ({
    headerStyle: {
      backgroundColor: currentTheme.background,
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0,
    },
    headerLeft: () => (
      <Pressable onPress={() => navigation.goBack()}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={currentTheme.textPrimary}
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
              name="AppNav"
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
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {(props) => <Login {...props} promptAsync={promptAsync} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp" options={screenOptions}>
                {(props) => <SignUp {...props} promptAsync={promptAsync} />}
              </Stack.Screen>
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
