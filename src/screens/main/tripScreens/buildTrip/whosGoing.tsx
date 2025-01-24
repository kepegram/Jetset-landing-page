import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { RootStackParamList } from "../../../../navigation/appNav";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { CreateTripContext } from "../../../../context/createTripContext";
import { useTheme } from "../../../../context/themeContext";
import Slider from "@react-native-community/slider";
import { MainButton } from "../../../../components/ui/button";

type WhosGoingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "WhosGoing"
>;

const WhosGoing: React.FC = () => {
  const navigation = useNavigation<WhosGoingNavigationProp>();
  const { currentTheme } = useTheme();
  const { tripData = {}, setTripData = () => {} } =
    useContext(CreateTripContext) || {};
  const [whoIsGoing, setWhoIsGoing] = useState<number>(1);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  const handleWhoIsGoingChange = (value: number) => {
    setWhoIsGoing(value);
    let whoIsGoingText = "Group";
    if (value === 1) {
      whoIsGoingText = "Solo";
    } else if (value === 2) {
      whoIsGoingText = "Couple";
    }
    const updatedTripData = {
      ...tripData,
      whoIsGoing: whoIsGoingText,
    };
    setTripData(updatedTripData);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.headerContainer}>
        <Text
          style={[styles.subheading, { color: currentTheme.textSecondary }]}
        >
          With who?
        </Text>
        <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>
          Choose how many people you're traveling with
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={6}
          step={1}
          value={whoIsGoing}
          onValueChange={handleWhoIsGoingChange}
          minimumTrackTintColor={currentTheme.alternate}
          maximumTrackTintColor={currentTheme.accentBackground}
          thumbTintColor={currentTheme.alternate}
        />
        <View style={styles.markerContainer}>
          {[...Array(6)].map((_, index) => (
            <Text
              key={index}
              style={[styles.markerText, { color: currentTheme.textSecondary }]}
            >
              {index < 5 ? index + 1 : "6+"}
            </Text>
          ))}
        </View>
        <Text
          style={[styles.selectionText, { color: currentTheme.textSecondary }]}
        >
          {whoIsGoing === 1 ? "Solo" : whoIsGoing === 2 ? "Couple" : "Group"}
        </Text>
        <View style={styles.buttonContainer}>
          <MainButton
            onPress={() => {
              console.log("Updated Trip Data:", tripData);
              navigation.navigate("MoreInfo");
            }}
            buttonText="Continue"
            width={"70%"}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 100,
  },
  subheading: {
    fontSize: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
  sliderContainer: {
    marginTop: 100,
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  markerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  markerText: {
    fontSize: 18,
    textAlign: "center",
    width: `${100 / 6}%`,
  },
  selectionText: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 140,
  },
});

export default WhosGoing;
