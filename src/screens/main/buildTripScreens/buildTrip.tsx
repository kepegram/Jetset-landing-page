import {
  TextInput,
  View,
  Pressable,
  Text,
  ImageBackground,
} from "react-native";
import { useTheme } from "../../../context/themeContext";
import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateTripContext } from "../../../context/createTripContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/appNav";

type BuildTripNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BuildTrip"
>;

const BuildTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const { tripData } = useContext(CreateTripContext);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [tripName, setTripName] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const navigation = useNavigation<BuildTripNavigationProp>();

  const handleTripNameChange = async (text: string) => {
    setTripName(text);
    console.log(text);
    await AsyncStorage.setItem("tripName", text);
  };

  const isFormValid =
    tripData.locationInfo && tripName && selectedOption !== null;

  useEffect(() => {
    console.log(tripData.locationInfo.photoRef);
  }, [tripData]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <ImageBackground
        source={{
          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
        }}
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              color: currentTheme.textSecondary,
              fontSize: 15,
              marginBottom: 5,
              paddingLeft: 30,
              alignSelf: "flex-start",
            }}
          >
            I want to go to...
          </Text>
          {tripData.locationInfo && (
            <Text
              style={{
                color: "white",
                fontSize: 34,
                paddingLeft: 30,
                alignSelf: "flex-start",
              }}
            >
              {tripData.locationInfo.name}
            </Text>
          )}
        </View>
      </ImageBackground>

      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 30,
        }}
      >
        <View style={{ width: "100%" }}>
          {[1, 2, 3].map((inputNumber) => (
            <View key={inputNumber} style={{ width: "100%", marginBottom: 20 }}>
              {inputNumber === 1 && (
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={currentTheme.textSecondary}
                  style={{ position: "absolute", left: 10, top: 10 }}
                />
              )}
              {inputNumber === 2 && (
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={currentTheme.textSecondary}
                  style={{ position: "absolute", left: 10, top: 10 }}
                />
              )}
              {inputNumber === 3 && (
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  color={currentTheme.textSecondary}
                  style={{ position: "absolute", left: 10, top: 10 }}
                />
              )}
              <TextInput
                placeholder={
                  inputNumber === 1
                    ? "From?"
                    : inputNumber === 2
                    ? "When?"
                    : "Budget?"
                }
                placeholderTextColor={currentTheme.textSecondary}
                onFocus={() => setFocusedInput(inputNumber)}
                onBlur={() => setFocusedInput(null)}
                style={{
                  height: 50,
                  borderBottomColor:
                    focusedInput === inputNumber
                      ? currentTheme.alternate
                      : currentTheme.accentBackground,
                  borderBottomWidth: focusedInput === inputNumber ? 2 : 1,
                  paddingLeft:
                    inputNumber === 1 || inputNumber === 2 || inputNumber === 3
                      ? 40
                      : 10,
                  width: "100%",
                  position: "relative",
                }}
              />
            </View>
          ))}
          <View style={{ width: "100%", marginBottom: 20 }}>
            <TextInput
              placeholder="Trip Name"
              placeholderTextColor={currentTheme.textSecondary}
              onChangeText={handleTripNameChange}
              onFocus={() => setFocusedInput(4)}
              onBlur={() => setFocusedInput(null)}
              style={{
                height: 50,
                borderBottomColor:
                  focusedInput === 4
                    ? currentTheme.alternate
                    : currentTheme.accentBackground,
                borderBottomWidth: focusedInput === 4 ? 2 : 1,
                paddingLeft: 10,
                width: "100%",
              }}
            />
          </View>
          <Text
            style={{
              color: currentTheme.textPrimary,
              marginBottom: 20,
              alignSelf: "flex-start",
            }}
          >
            Who's going?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              justifyContent: "space-between",
              width: "80%",
              marginBottom: 20,
            }}
          >
            {[1, 2, 3].map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  console.log(
                    option === 1
                      ? "Solo selected"
                      : option === 2
                      ? "Couple selected"
                      : "Group selected"
                  );
                  setSelectedOption(option);
                }}
                style={{
                  borderColor: currentTheme.alternate,
                  borderWidth: 1,
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor:
                    selectedOption === option
                      ? currentTheme.alternate
                      : currentTheme.background,
                  flex: 1,
                  marginHorizontal: 5,
                }}
              >
                <Text
                  style={{
                    color: currentTheme.textPrimary,
                    textAlign: "center",
                  }}
                >
                  {option === 1
                    ? "Solo"
                    : option === 2
                    ? "Couple"
                    : "Group (3+)"}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => navigation.navigate("ReviewTrip")}
            style={{
              backgroundColor: isFormValid
                ? currentTheme.alternate
                : currentTheme.accentBackground,
              padding: 15,
              borderRadius: 5,
              width: "80%",
              alignItems: "center",
              marginTop: 20,
              alignSelf: "center",
            }}
            disabled={!isFormValid}
          >
            <Text
              style={{
                color: isFormValid ? "white" : currentTheme.textSecondary,
                fontSize: 16,
              }}
            >
              Start My Trip
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default BuildTrip;
