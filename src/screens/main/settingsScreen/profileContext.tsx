import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase auth
import { FIREBASE_DB } from "../../../../firebase.config"; // Firebase config

interface ProfileContextType {
  profilePicture: string;
  setProfilePicture: (uri: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profilePicture, setProfilePictureState] = useState<string>(
    "https://via.placeholder.com/150"
  );

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const user = getAuth().currentUser;
        if (user) {
          const userDocRef = doc(FIREBASE_DB, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data?.profilePicture) {
              setProfilePictureState(data.profilePicture);
              await AsyncStorage.setItem("profilePicture", data.profilePicture);
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

  return (
    <ProfileContext.Provider
      value={{
        profilePicture,
        setProfilePicture,
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
