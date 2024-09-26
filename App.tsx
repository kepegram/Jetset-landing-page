import React, { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "./src/components/onboarding/welcome/welcome";
import Login from "./src/components/onboarding/userAuth/login";
import SignUp from "./src/components/onboarding/userAuth/signup";
import AppTabNav from "./src/components/main/tabNavigator/appTabNav";
import { FIREBASE_AUTH } from "./firebase.config";

// Define the types for each screen's navigation prop
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  AppTabNav: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <Stack.Screen name="AppTabNav" component={AppTabNav} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
