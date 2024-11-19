import { View, Text, FlatList, Pressable, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { CreateTripContext } from "../../../context/createTripContext";
import { SelectTravelersList } from "../../../constants/options";
import OptionCard from "../../../components/createTrip/optionCard";
import { useTheme } from "../../../context/themeContext";
import { RootStackParamList } from "../../../navigation/appNav";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

// Define the type of items in SelectTravelesList
interface Traveler {
  id: number;
  title: string;
  desc: string;
  icon: string;
  people: string;
}

type SelectTravelerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SelectTraveler"
>;

const SelectTraveler: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<SelectTravelerScreenNavigationProp>();
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler | null>(
    null
  );
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    setTripData({ ...tripData, traveler: selectedTraveler });
  }, [selectedTraveler]);

  return (
    <View
      style={{
        padding: 25,
        backgroundColor: currentTheme.background,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 35,
          color: currentTheme.textPrimary,
        }}
      >
        Who's Traveling?
      </Text>

      <View
        style={{
          marginTop: 20,
        }}
      >
        <FlatList
          data={SelectTravelersList}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => setSelectedTraveler(item)}
              style={{
                marginVertical: 10,
              }}
            >
              <OptionCard option={item} selectedOption={selectedTraveler} />
            </Pressable>
          )}
        />
      </View>

      <Pressable
        style={{
          padding: 15,
          backgroundColor: currentTheme.alternate,
          borderRadius: 15,
          marginTop: 20,
        }}
        onPress={() => navigation.navigate("SelectDates")}
      >
        <Text
          style={{
            color: currentTheme.buttonText,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Proceed to select date
        </Text>
      </Pressable>
    </View>
  );
};

export default SelectTraveler;
