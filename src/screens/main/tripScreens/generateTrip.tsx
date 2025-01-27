import React, { useContext, useState, useCallback, useRef } from "react";
import { View, Text, Image, Alert, Pressable } from "react-native";
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
import { Ionicons } from '@expo/vector-icons';

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
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{destinationType}",
      tripData?.destinationType || ""
    )
      .replace("{totalDays}", tripData.totalNoOfDays?.toString() || "0")
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
        // Try to clean the response before parsing
        const cleanedResponse = responseText.trim();
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
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 50,
          left: 25,
          zIndex: 1
        }}
      >
        <Ionicons name="arrow-back" size={24} color={currentTheme.textPrimary} />
      </Pressable>

      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
          textAlign: "center",
          color: currentTheme.textPrimary,
          marginBottom: 20,
        }}
      >
        Ready to generate your dream trip?
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
      <View style={{ marginTop: 40, gap: 20, alignItems: 'center' }}>
        <Pressable
          onPress={() => GenerateAiTrip()}
          style={{
            backgroundColor: currentTheme.alternate,
            padding: 15,
            borderRadius: 10,
            width: '80%',
            opacity: loading ? 0.5 : 1,
          }}
          disabled={loading}
        >
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontSize: 16,
              fontFamily: 'outfit-medium',
            }}
          >
            {loading ? 'Generating...' : 'Generate Trip'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => console.log('Final Prompt:', getFinalPrompt())}
          style={{
            backgroundColor: currentTheme.accentBackground,
            padding: 15,
            borderRadius: 10,
            width: '80%',
          }}
        >
          <Text
            style={{
              color: currentTheme.textPrimary,
              textAlign: 'center',
              fontSize: 16,
              fontFamily: 'outfit-medium',
            }}
          >
            Log Prompt
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default GenerateTrip;
