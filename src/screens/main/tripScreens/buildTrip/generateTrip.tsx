import React, { useContext, useState, useCallback, useRef, useEffect } from "react";
import { View, Text, Image, Alert, StyleSheet, SafeAreaView } from "react-native";
import { CreateTripContext } from "../../../../context/createTripContext";
import { AI_PROMPT, PLACE_AI_PROMPT } from "../../../../api/ai-prompt";
import { chatSession } from "../../../../../AI-Model";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../../../firebase.config";
import { useTheme } from "../../../../context/themeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type GenerateTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GenerateTrip"
>;

const GenerateTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<GenerateTripScreenNavigationProp>();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const user = FIREBASE_AUTH.currentUser;

  const getFinalPrompt = () => {
    let FINAL_PROMPT;

    if (tripData?.destinationType) {
      FINAL_PROMPT = AI_PROMPT.replace(
        "{destinationType}",
        tripData.destinationType
      );
    } else {
      FINAL_PROMPT = PLACE_AI_PROMPT.replace(
        "{name}",
        tripData.locationInfo?.name || ""
      );
    }

    FINAL_PROMPT = FINAL_PROMPT.replace(
      "{totalDays}",
      tripData.totalNoOfDays?.toString() || "0"
    )
      .replace("{totalNight}", (tripData.totalNoOfDays - 1).toString() || "0")
      .replace("{whoIsGoing}", tripData.whoIsGoing || "")
      .replace("{budget}", tripData.budget?.toString() || "")
      .replace("{accommodationType}", tripData.accommodationType || "")
      .replace("{activityLevel}", tripData.activityLevel || "");

    return FINAL_PROMPT;
  };

  const GenerateAiTrip = async (retryCount = 0) => {
    setLoading(true);
    const FINAL_PROMPT = getFinalPrompt();
    console.log("Generated Prompt:", FINAL_PROMPT);

    try {
      console.log(`Attempt ${retryCount + 1} to generate AI trip...`);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text();
      console.log("AI Response:", responseText);

      let tripResp;
      try {
        // Clean the response by removing any extra closing braces and whitespace
        let cleanedResponse = responseText.trim();
        // Find the last valid JSON object by matching braces
        let braceCount = 0;
        let lastValidIndex = 0;

        for (let i = 0; i < cleanedResponse.length; i++) {
          if (cleanedResponse[i] === "{") braceCount++;
          if (cleanedResponse[i] === "}") {
            braceCount--;
            if (braceCount === 0) lastValidIndex = i;
          }
        }

        cleanedResponse = cleanedResponse.substring(0, lastValidIndex + 1);
        tripResp = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Failed to parse AI response");
      }

      if (!tripResp?.travelPlan) {
        throw new Error("Invalid AI response format");
      }

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
              onPress: () => {
                setTripData({});
                navigation.navigate("MyTripsMain");
              },
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
      return () => {
        isMounted.current = false;
      };
    }, [])
  );

  useEffect(() => {
    GenerateAiTrip();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Creating Your Perfect Trip
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
          Our AI is crafting a personalized itinerary just for you...
        </Text>
        <Image
          source={require("../../../../assets/plane.gif")}
          style={styles.animation}
        />
        <Text style={[styles.warning, { color: currentTheme.textSecondary }]}>
          Please do not close the app while we generate your trip
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  animation: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
    marginBottom: 40,
  },
  warning: {
    fontSize: 14,
    fontFamily: "outfit",
    textAlign: "center",
    opacity: 0.8,
    paddingHorizontal: 30,
  },
});

export default GenerateTrip;
