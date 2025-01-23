import { View, Text, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";

type DoYouKnowNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DoYouKnow"
>;

const DoYouKnow: React.FC = () => {
  const navigation = useNavigation<DoYouKnowNavigationProp>();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>DoYouKnow</Text>
      <Pressable onPress={() => navigation.navigate("SearchPlaces")}>
        <Text>Yes</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("ChoosePlaces")}>
        <Text>No</Text>
      </Pressable>
    </View>
  );
};

export default DoYouKnow;
