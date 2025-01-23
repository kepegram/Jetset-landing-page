import { View, Text, Pressable } from "react-native";
import React from "react";
import { RootStackParamList } from "../../../../navigation/appNav";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type WhosGoingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "WhosGoing"
>;

const WhosGoing: React.FC = () => {
    const navigation = useNavigation<WhosGoingNavigationProp>();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>WhosGoing</Text>
      <Pressable onPress={() => navigation.navigate("MoreInfo")}>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
};

export default WhosGoing;
