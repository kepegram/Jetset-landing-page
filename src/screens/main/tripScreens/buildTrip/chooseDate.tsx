import { View, Text, Pressable } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";

type ChooseDateNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChooseDate"
>;

const ChooseDate: React.FC = () => {
  const navigation = useNavigation<ChooseDateNavigationProp>();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ChooseDate</Text>
      <Pressable onPress={() => navigation.navigate("WhosGoing")}>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
};

export default ChooseDate;
