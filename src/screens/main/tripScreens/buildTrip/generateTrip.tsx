import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { CreateTripContext } from "../../../../context/createTripContext";
import { AI_PROMPT, PLACE_AI_PROMPT } from "../../../../api/ai-prompt";
import { chatSession } from "../../../../api/AI-Model";
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

interface TripResponse {
  travelPlan: {
    [key: string]: any;
  };
}

const GenerateTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<GenerateTripScreenNavigationProp>();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const user = FIREBASE_AUTH.currentUser;

  // Construct the final AI prompt based on trip data
  const getFinalPrompt = () => {
    let FINAL_PROMPT;

    // Choose prompt template based on destination type
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

    // Replace placeholders with actual trip data
    FINAL_PROMPT = FINAL_PROMPT.replace(
      "{totalDays}",
      tripData.totalNoOfDays?.toString() || "0"
    )
      .replace("{totalNight}", (tripData.totalNoOfDays - 1).toString() || "0")
      .replace("{whoIsGoing}", tripData.whoIsGoing || "")
      .replace("{budget}", tripData.budget?.toString() || "")
      .replace("{activityLevel}", tripData.activityLevel || "");

    return FINAL_PROMPT;
  };

  // Generate AI trip plan with retry logic
  const generateAiTrip = async (retryCount = 0): Promise<void> => {
    if (!user?.uid) {
      Alert.alert("Error", "You must be logged in to generate a trip");
      return;
    }

    setLoading(true);
    const finalPrompt = getFinalPrompt();

    try {
      // Get AI response and parse it
      const result = await chatSession.sendMessage(finalPrompt);
      const responseText = await result.response.text();
      const tripResp = parseAIResponse(responseText);

      // Save generated trip to Firestore
      await saveTripToFirestore(tripResp);

      // Clear AsyncStorage and navigate to trips screen
      await AsyncStorage.clear();
      navigation.navigate("MyTripsMain");
    } catch (error) {
      handleGenerationError(error, retryCount);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const parseAIResponse = (responseText: string): TripResponse => {
    const cleanedResponse = cleanJsonResponse(responseText);
    try {
      const parsed = JSON.parse(cleanedResponse);
      if (!parsed?.travelPlan) {
        throw new Error("Invalid AI response format");
      }
      return parsed;
    } catch (error) {
      console.error("JSON parsing error:", error);
      throw new Error("Failed to parse AI response");
    }
  };

  const cleanJsonResponse = (response: string): string => {
    let cleanedResponse = response.trim();
    let braceCount = 0;
    let lastValidIndex = 0;

    for (let i = 0; i < cleanedResponse.length; i++) {
      if (cleanedResponse[i] === "{") braceCount++;
      if (cleanedResponse[i] === "}") {
        braceCount--;
        if (braceCount === 0) lastValidIndex = i;
      }
    }

    return cleanedResponse.substring(0, lastValidIndex + 1);
  };

  const saveTripToFirestore = async (tripResp: TripResponse) => {
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
      docId,
      createdAt: new Date().toISOString(),
    });
  };

  const handleGenerationError = (error: any, retryCount: number) => {
    console.error("AI generation failed:", error.message);
    if (retryCount < 3 && isMounted.current) {
      const waitTime = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying in ${waitTime / 1000} seconds...`);
      setTimeout(() => {
        if (isMounted.current) {
          generateAiTrip(retryCount + 1);
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
  };

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, [])
  );

  // Start generating trip when screen loads
  useEffect(() => {
    if (!loading) {
      generateAiTrip();
    }
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
          Creating Your Perfect Trip
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
          Our AI is crafting a personalized itinerary just for you...
        </Text>
        <Image
          source={require("../../../../assets/app-imgs/plane.gif")}
          style={styles.animation}
        />
        <Text style={[styles.warning, { color: currentTheme.textSecondary }]}>
          Please wait while we generate your trip...
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
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
});

export default GenerateTrip;
