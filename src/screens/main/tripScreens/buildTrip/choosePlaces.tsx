import { View, Text, Pressable } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";

type ChoosePlacesNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChoosePlaces"
>;

const ChoosePlaces: React.FC = () => {
  const navigation = useNavigation<ChoosePlacesNavigationProp>();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ChoosePlaces</Text>
      <Pressable onPress={() => navigation.navigate("ChooseDate")}>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
};

export default ChoosePlaces;
