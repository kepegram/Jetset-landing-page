import { View, Text, Pressable } from "react-native";
import React from "react";
import { RootStackParamList } from "../../../../navigation/appNav";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type MoreInfoNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MoreInfo"
>;

const MoreInfo: React.FC = () => {
  const navigation = useNavigation<MoreInfoNavigationProp>();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>MoreInfo</Text>
      <Pressable onPress={() => navigation.navigate("ReviewTrip")}>
        <Text>Review</Text>
      </Pressable>
    </View>
  );
};

export default MoreInfo;
