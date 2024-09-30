import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileContextType {
  profilePicture: string;
  setProfilePicture: (uri: string) => void;
  headerColors: string[];
  setHeaderColors: (colors: string[]) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profilePicture, setProfilePictureState] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [headerColors, setHeaderColorsState] = useState<string[]>(["#A463FF"]);

  // Fetch stored header colors and profile picture on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedProfilePicture = await AsyncStorage.getItem(
          "profilePicture"
        );
        const savedHeaderColors = await AsyncStorage.getItem("headerColors");

        if (savedProfilePicture) {
          setProfilePictureState(savedProfilePicture);
        }
        if (savedHeaderColors) {
          setHeaderColorsState(JSON.parse(savedHeaderColors));
        }
      } catch (error) {
        console.error("Failed to load profile data from storage:", error);
      }
    };

    loadProfileData();
  }, []); // Empty array ensures this effect runs only once when the component mounts

  const setProfilePicture = async (uri: string) => {
    try {
      await AsyncStorage.setItem("profilePicture", uri);
      setProfilePictureState(uri);
    } catch (error) {
      console.error("Failed to set profile picture:", error);
    }
  };

  const setHeaderColors = async (colors: string[]) => {
    try {
      await AsyncStorage.setItem("headerColors", JSON.stringify(colors));
      setHeaderColorsState(colors);
    } catch (error) {
      console.error("Failed to set header colors:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profilePicture,
        setProfilePicture,
        headerColors,
        setHeaderColors,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
