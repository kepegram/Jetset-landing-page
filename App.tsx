import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { User, onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "./src/screens/onboarding/welcome/welcome";
import UserAuth from "./src/screens/onboarding/userAuth/userAuth";
import SignUp from "./src/screens/onboarding/userAuth/signup";
import ForgotPassword from "./src/screens/onboarding/userAuth/forgotPassword";
import AppNav from "./src/screens/main/tabNavigator/appNav";
import { FIREBASE_AUTH } from "./firebase.config";
import { useColorScheme } from "react-native";

// Define the types for each screen's navigation prop
export type RootStackParamList = {
  Welcome: undefined;
  UserAuth: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  AppTabNav: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const colorScheme = useColorScheme(); // Get the user's color scheme preference

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <Stack.Screen name="AppTabNav" component={AppNav} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="UserAuth" component={UserAuth} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
