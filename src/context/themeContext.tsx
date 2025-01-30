import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Appearance } from "react-native";
import { FIREBASE_DB } from "../../firebase.config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { lightTheme, darkTheme } from "../theme/theme";

type Theme = "light" | "dark"; // Define a union type for themes

type ThemeContextType = {
  theme: Theme;
  currentTheme: typeof lightTheme | typeof darkTheme;
  setTheme: (newTheme: Theme) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: Appearance.getColorScheme() as Theme,
  currentTheme: Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    Appearance.getColorScheme() as Theme
  );
  const auth = getAuth();
  const user = auth.currentUser;

  // Determine the current theme object
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  // Function to fetch theme from Firestore
  const fetchUserTheme = async () => {
    if (user) {
      const userDocRef = doc(FIREBASE_DB, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.theme;
      }
    }
    return null;
  };

  // Function to update theme in Firestore
  const saveThemeToFirestore = async (newTheme: Theme) => {
    if (user) {
      const userDocRef = doc(FIREBASE_DB, "users", user.uid);
      await setDoc(userDocRef, { theme: newTheme }, { merge: true });
    }
  };

  // Listen for system theme changes and load stored user theme on start
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await fetchUserTheme();
      if (storedTheme) {
        setTheme(storedTheme as Theme);
      } else {
        setTheme(Appearance.getColorScheme() as Theme);
      }
    };

    loadTheme();

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme as Theme);
    });

    return () => listener.remove();
  }, []);

  // Wrap setTheme to also save to Firestore
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    saveThemeToFirestore(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, currentTheme, setTheme: handleSetTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
