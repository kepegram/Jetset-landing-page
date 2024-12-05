import { View, Text, Pressable } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { CreateTripContext } from "../../../context/createTripContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/appNav";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/themeContext";
import moment from "moment";
import { MainButton } from "../../../components/ui/button";

type ReviewTripScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReviewTrip"
>;

const ReviewTrip: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation<ReviewTripScreenNavigationProp>();
  const { tripData } = useContext(CreateTripContext);
  const [localTripData, setLocalTripData] = useState(tripData);

  useEffect(() => {
    setLocalTripData(tripData);
  }, [tripData]);

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
              {localTripData?.locationInfo?.name}
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
              {moment(localTripData?.startDate).format("MMM DD") +
                " - " +
                moment(localTripData.endDate).format("MMM DD") +
                " "}
              ({localTripData?.totalNoOfDays} days)
            </Text>
          </View>
        </View>

        {/* Travelers Info  */}
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
              {localTripData?.whoIsGoing}
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
              {localTripData?.budget}
            </Text>
          </View>
        </View>

        {/* Traveler Type Info  */}
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
            🧳
          </Text>
          <View>
            <Text
              style={{
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              Traveler Type
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: currentTheme.textPrimary,
              }}
            >
              {localTripData?.travelerType}
            </Text>
          </View>
        </View>

        {/* Accommodation Type Info  */}
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
            🏨
          </Text>
          <View>
            <Text
              style={{
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              Accommodation Type
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: currentTheme.textPrimary,
              }}
            >
              {localTripData?.accommodationType}
            </Text>
          </View>
        </View>

        {/* Activity Level Info  */}
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
            🏃‍♂️
          </Text>
          <View>
            <Text
              style={{
                fontSize: 17,
                color: currentTheme.textSecondary,
              }}
            >
              Activity Level
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: currentTheme.textPrimary,
              }}
            >
              {localTripData?.activityLevel}
            </Text>
          </View>
        </View>
      </View>

      <MainButton
        onPress={() => navigation.navigate("GenerateTrip")}
        buttonText="Build My Trip"
        style={{
          alignSelf: "center",
          marginTop: 50,
        }}
        backgroundColor={currentTheme.alternate}
        width="80%"
      />
    </View>
  );
};

export default ReviewTrip;
