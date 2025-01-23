import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import { FIREBASE_DB } from "../../firebase.config";

interface ProfileContextType {
  profilePicture: string;
  setProfilePicture: (uri: string) => void;
  displayName: string;
  setDisplayName: (name: string) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profilePicture, setProfilePictureState] = useState<string>(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
  );
  const [displayName, setDisplayNameState] = useState<string>("");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userDocRef = doc(FIREBASE_DB, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          // Use Google profile details if available
          if (user.photoURL) {
            setProfilePictureState(user.photoURL);
            await AsyncStorage.setItem("profilePicture", user.photoURL);
          }
          if (user.displayName) {
            setDisplayNameState(user.displayName);
            await AsyncStorage.setItem("displayName", user.displayName);
          }

          // Otherwise, load from Firestore if available
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

  const setProfilePicture = async (uri: string) => {
    try {
      await AsyncStorage.setItem("profilePicture", uri);
      setProfilePictureState(uri);
    } catch (error) {
      console.error("Failed to set profile picture:", error);
    }
  };

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

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
