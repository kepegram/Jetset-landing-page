import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_DB } from "../../../../firebase.config";
import { CustomButton, AltButton } from "../../../components/ui/button";
import { useTheme } from "../../../context/themeContext";

type ChangeUsernameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChangeUsername"
>;

const ChangeUsername: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<ChangeUsernameScreenNavigationProp>();
  const [userName, setUserName] = useState<string | null>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = getAuth().currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data?.name || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        await setDoc(
          doc(FIREBASE_DB, "users", user.uid),
          { name: userName },
          { merge: true }
        );
        console.log("Username updated successfully.");
        navigation.navigate("Edit");
      } catch (error) {
        console.error("Error saving username:", error);
      }
    }
  };

  const handleCancel = () => {
    navigation.navigate("Edit");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text
            style={[styles.inputLabel, { color: currentTheme.textPrimary }]}
          >
            Username
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: currentTheme.inactive,
                backgroundColor:
                  currentTheme.background === "#FFFFFF" ? "#F5F5F5" : "#2A2A2A",
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: currentTheme.textPrimary }]}
              placeholder="Enter your username"
              placeholderTextColor={currentTheme.secondary}
              value={userName || ""}
              onChangeText={setUserName}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton onPress={handleCancel} buttonText="Cancel" />
          <AltButton onPress={handleSave} buttonText="Save" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangeUsername;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  formContainer: {
    width: "100%",
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: "outfit-medium",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    gap: 12,
  },
});
