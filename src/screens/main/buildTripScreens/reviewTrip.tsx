import { View, Text, Pressable } from "react-native";
import React from "react";
import { useContext } from "react";
import { CreateTripContext } from "../../../context/CreateTripContext";
import moment from "moment";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";

type ReviewTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReviewTrip"
>;

const ReviewTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<ReviewTripScreenNavigationProp>();
  const { tripData, setTripData } = useContext(CreateTripContext);

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
        Review your trip
      </Text>

      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: currentTheme.textSecondary,
          }}
        >
          Before generating your trip, please review your selections
        </Text>

        {/* Destination Info  */}
        <View
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
            }}
          >
            📍
          </Text>
          <View>
            <Text
              style={{
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              Destination
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: currentTheme.textPrimary,
              }}
            >
              {tripData?.locationInfo?.name}
            </Text>
          </View>
        </View>

        {/* Date Selected Info  */}
        <View
          style={{
            marginTop: 25,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
            }}
          >
            🗓️
          </Text>
          <View>
            <Text
              style={{
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              Travel Date
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: currentTheme.textPrimary,
              }}
            >
              {moment(tripData?.startDate).format("MMM DD") +
                " To " +
                moment(tripData.endDate).format("MMM DD") +
                " "}
              ({tripData?.totalNoOfDays} days)
            </Text>
          </View>
        </View>

        {/* Traveles Info  */}
        <View
          style={{
            marginTop: 25,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
            }}
          >
            🚌
          </Text>
          <View>
            <Text
              style={{
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              Who is Traveling
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: currentTheme.textPrimary,
              }}
            >
              {tripData?.traveler?.title}
            </Text>
          </View>
        </View>

        {/* Budget Info  */}
        <View
          style={{
            marginTop: 25,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
            }}
          >
            💰
          </Text>
          <View>
            <Text
              style={{
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              Budget
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: currentTheme.textPrimary,
              }}
            >
              {tripData?.budget}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        // onPress={() => router.replace("/create-trip/generate-trip")}
        style={{
          padding: 15,
          backgroundColor: currentTheme.alternate,
          borderRadius: 15,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: currentTheme.buttonText,
            fontSize: 20,
          }}
        >
          Build My trip
        </Text>
      </Pressable>
    </View>
  );
};

export default ReviewTrip;
