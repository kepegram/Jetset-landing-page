import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Appearance } from "react-native";
import { FIREBASE_DB } from "../../../../firebase.config"; // Firestore setup
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase auth

// Define the context value type
type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

// Define the prop types for the ThemeProvider component
type ThemeProviderProps = {
  children: ReactNode;
};

// Define the ThemeContext with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Theme provider
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const auth = getAuth();
  const user = auth.currentUser;

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
  const saveThemeToFirestore = async (newTheme: string) => {
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
        setTheme(storedTheme); // Use the stored theme
      } else {
        setTheme(Appearance.getColorScheme()); // Use system theme as fallback
      }
    };

    loadTheme(); // Load theme when the app starts

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    return () => listener.remove();
  }, []);

  // Toggle theme and save it to Firestore
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    saveThemeToFirestore(newTheme); // Save to Firestore
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
