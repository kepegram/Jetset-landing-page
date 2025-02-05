import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import { FIREBASE_DB } from "../../firebase.config";

// Define the shape of our profile context
interface ProfileContextType {
  profilePicture: string; // URL of user's profile picture
  setProfilePicture: (uri: string) => void; // Function to update profile picture
  displayName: string; // User's display name
  setDisplayName: (name: string) => void; // Function to update display name
}

// Create the context with undefined default value
export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

// ProfileProvider component that manages profile state and provides it to children
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state with default profile picture and empty display name
  const [profilePicture, setProfilePictureState] = useState<string>(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
  );
  const [displayName, setDisplayNameState] = useState<string>("");

  useEffect(() => {
    // Load profile data from multiple sources (Firebase Auth, Firestore)
    const loadProfileData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userDocRef = doc(FIREBASE_DB, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          // First priority: Use Google profile details if available
          if (user.photoURL) {
            setProfilePictureState(user.photoURL);
            await AsyncStorage.setItem("profilePicture", user.photoURL);
          }
          if (user.displayName) {
            setDisplayNameState(user.displayName);
            await AsyncStorage.setItem("displayName", user.displayName);
          }

          // Second priority: Load from Firestore if available
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data?.profilePicture) {
              setProfilePictureState(data.profilePicture);
              await AsyncStorage.setItem("profilePicture", data.profilePicture);
            }
            if (data?.displayName) {
              setDisplayNameState(data.displayName);
              await AsyncStorage.setItem("displayName", data.displayName);
            }
          } else {
            console.log("No document found for user:", user.uid);
          }
        }
      } catch (error) {
        console.error("Failed to load profile data from Firestore:", error);
      }
    };

    loadProfileData();
  }, []);

  // Handler to update profile picture - saves to AsyncStorage and updates state
  const setProfilePicture = async (uri: string) => {
    try {
      await AsyncStorage.setItem("profilePicture", uri);
      setProfilePictureState(uri);
    } catch (error) {
      console.error("Failed to set profile picture:", error);
    }
  };

  // Handler to update display name - saves to AsyncStorage and updates state
  const setDisplayName = async (name: string) => {
    try {
      await AsyncStorage.setItem("displayName", name);
      setDisplayNameState(name);
    } catch (error) {
      console.error("Failed to set display name:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profilePicture,
        setProfilePicture,
        displayName,
        setDisplayName,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook for accessing profile context
// Throws error if used outside of ProfileProvider
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
