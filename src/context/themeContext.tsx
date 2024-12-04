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
  theme: Theme; // Use the union type here
  currentTheme: typeof lightTheme | typeof darkTheme;
  toggleTheme: (newTheme: Theme) => void; // Update here to accept the specific theme type
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: Appearance.getColorScheme() as Theme, // Default to system UI theme
  currentTheme: Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme,
  toggleTheme: () => {},
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
        return userData.theme; // Return stored theme
      }
    }
    return null; // Return null if no theme is found
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
        setTheme(storedTheme as Theme); // Use the stored theme
      } else {
        setTheme(Appearance.getColorScheme() as Theme); // Use system theme as fallback
      }
    };

    loadTheme(); // Load theme when the app starts

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme as Theme);
    });

    return () => listener.remove();
  }, []);

  // Toggle theme and save it to Firestore
  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    saveThemeToFirestore(newTheme); // Save to Firestore
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
