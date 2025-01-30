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
      <View style={styles.formContainer}>
        <Text 
          style={[
            styles.inputLabel, 
            { color: currentTheme.textPrimary }
          ]}
        >
          Username
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.textPrimary,
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.inactive,
              },
            ]}
            placeholder="Enter your username"
            placeholderTextColor={currentTheme.inactive}
            value={userName || ""}
            onChangeText={setUserName}
            autoCapitalize="none"
            autoCorrect={false}
          />
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
  formContainer: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  inputContainer: {
    width: "100%",
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: 'outfit-bold',
    alignSelf: 'flex-start',
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    fontFamily: 'outfit',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
    gap: 16,
  },
});
