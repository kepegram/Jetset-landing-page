import React, { useContext, useState, useCallback, useRef } from "react";
import { View, Text, Image, Alert } from "react-native";
import { CreateTripContext } from "../../../context/createTripContext";
import { AI_PROMPT } from "../../../constants/options";
import { chatSession } from "../../../../aiModal";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

type GenerateTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GenerateTrip"
>;

const GenerateTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<GenerateTripScreenNavigationProp>();
  const { tripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true); // Track if the component is mounted

  const user = FIREBASE_AUTH.currentUser;

  const GenerateAiTrip = async (retryCount = 0) => {
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      tripData?.locationInfo?.name || ""
    )
      .replace("{locationFrom}", tripData?.locationFromInfo?.name || "")
      .replace("{totalDays}", tripData.totalNoOfDays?.toString() || "0")
      .replace("{totalNight}", (tripData.totalNoOfDays - 1).toString() || "0")
      .replace("{traveler}", tripData.traveler?.title || "")
      .replace("{budget}", tripData.budget?.toString() || "")
      .replace("{totalDays}", tripData.totalNoOfDays?.toString() || "0")
      .replace("{totalNight}", (tripData.totalNoOfDays - 1).toString() || "0");

    console.log("Generated Prompt:", FINAL_PROMPT);

    try {
      console.log(`Attempt ${retryCount + 1} to generate AI trip...`);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text();
      console.log("AI Response:", responseText);

      const tripResp = JSON.parse(responseText);

      const docId = Date.now().toString();
      const userTripRef = doc(
        FIREBASE_DB,
        "users",
        user?.uid || "unknown",
        "userTrips",
        docId
      );

      const sanitizedTripData = {
        ...tripData,
        startDate: tripData.startDate?.format("YYYY-MM-DD") || null,
        endDate: tripData.endDate?.format("YYYY-MM-DD") || null,
      };

      await setDoc(userTripRef, {
        userEmail: user?.email || "unknown",
        tripPlan: tripResp,
        tripData: sanitizedTripData,
        docId: docId,
      });

      console.log("Firestore Document Updated Successfully with ID:", docId);

      navigation.navigate("Home");
    } catch (error: any) {
      console.error("AI generation failed:", error.message);
      if (retryCount < 3 && isMounted.current) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying in ${waitTime / 1000} seconds...`);
        setTimeout(() => {
          if (isMounted.current) {
            GenerateAiTrip(retryCount + 1); // Retry with incremented count
          }
        }, waitTime);
      } else {
        Alert.alert(
          "Error",
          "An error occurred while generating your trip. Please try again later.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Home"),
            },
          ]
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true; // Component is mounted
      GenerateAiTrip();

      return () => {
        isMounted.current = false; // Cleanup function to set mounted to false
      };
    }, []) // Empty dependency array ensures it only runs when the screen gains focus
  );

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: currentTheme.background,
        height: "100%",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 35,
          textAlign: "center",
          color: currentTheme.textPrimary,
        }}
      >
        Please Wait...
      </Text>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
          textAlign: "center",
          marginTop: 40,
          color: currentTheme.textSecondary,
        }}
      >
        We are working to generate your dream trip
      </Text>

      <Image
        source={require("../../../assets/plane.gif")}
        style={{
          width: "100%",
          height: 200,
          resizeMode: "contain",
          marginTop: 40,
        }}
      />

      <Text
        style={{
          fontFamily: "outfit",
          color: currentTheme.textSecondary,
          fontSize: 20,
          textAlign: "center",
          marginTop: 30,
        }}
      >
        Do not go back
      </Text>
    </View>
  );
};

export default GenerateTrip;
