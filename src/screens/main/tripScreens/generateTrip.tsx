import React, { useContext, useState, useCallback, useRef } from "react";
import { View, Text, Image, Alert } from "react-native";
import { CreateTripContext } from "../../../context/createTripContext";
import { AI_PROMPT } from "../../../api/ai-prompt";
import { chatSession } from "../../../../AI-Model";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../firebase.config";
import { useTheme } from "../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type GenerateTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GenerateTrip"
>;

const GenerateTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<GenerateTripScreenNavigationProp>();
  const { tripData } = useContext(CreateTripContext) || {};
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const user = FIREBASE_AUTH.currentUser;

  const GenerateAiTrip = async (retryCount = 0) => {
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{destinationType}",
      tripData?.destinationType || ""
    )
      .replace("{totalDays}", tripData.totalNoOfDays?.toString() || "0")
      .replace("{totalNight}", (tripData.totalNoOfDays - 1).toString() || "0")
      .replace("{whoIsGoing}", tripData.whoIsGoing || "")
      .replace("{budget}", tripData.budget?.toString() || "")
      .replace("{travelerType}", tripData.travelerType || "")
      .replace("{accommodationType}", tripData.accommodationType || "")
      .replace("{activityLevel}", tripData.activityLevel || "");

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

      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");

      navigation.navigate("MyTripsMain");
    } catch (error: any) {
      console.error("AI generation failed:", error.message);
      if (retryCount < 3 && isMounted.current) {
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${waitTime / 1000} seconds...`);
        setTimeout(() => {
          if (isMounted.current) {
            GenerateAiTrip(retryCount + 1);
          }
        }, waitTime);
      } else {
        Alert.alert(
          "Error",
          "An error occurred while generating your trip. Please try again later.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("HomeMain"),
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
      isMounted.current = true;
      GenerateAiTrip();

      return () => {
        isMounted.current = false;
      };
    }, [])
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
          fontSize: 20,
          textAlign: "center",
          color: currentTheme.textPrimary,
        }}
      >
        Please wait, we are building your dream trip
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
    </View>
  );
};

export default GenerateTrip;
