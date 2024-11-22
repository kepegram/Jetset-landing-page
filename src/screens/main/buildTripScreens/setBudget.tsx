import { View, Text, FlatList, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SetBudgetOptions } from "../../../constants/options";
import OptionCard from "../../../components/createTrip/optionCard";
import { CreateTripContext } from "../../../context/createTripContext";
import { useTheme } from "../../../context/themeContext";

// Define the type for each item in the SetBudgetOptions
interface BudgetOption {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

const SetBudget: React.FC = () => {
  const { currentTheme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<
    BudgetOption | undefined
  >();
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    if (selectedOption) {
      setTripData({
        ...tripData,
        budget: selectedOption.title,
      });
    }
  }, [selectedOption]);

  const onClickContinue = () => {
    if (!selectedOption) {
      alert("Select Your Budget");
      return;
    }
  };

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
        Budget?
      </Text>

      <View
        style={{
          marginTop: 20,
        }}
      >
        <FlatList
          data={SetBudgetOptions}
          renderItem={({ item }) => (
            <Pressable
              style={{ marginVertical: 10 }}
              onPress={() => setSelectedOption(item)}
            >
              <OptionCard option={item} selectedOption={selectedOption} />
            </Pressable>
          )}
        />
      </View>

      <Pressable
        onPress={() => onClickContinue()}
        style={{
          padding: 15,
          backgroundColor: currentTheme.alternate,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: currentTheme.buttonText,
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </Pressable>
    </View>
  );
};

export default SetBudget;
