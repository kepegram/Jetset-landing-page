import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../profileScreen/themeContext";
import DateTimePicker from "@react-native-community/datetimepicker"; // Expo DateTimePicker
import { WebView } from "react-native-webview"; // Import WebView for Google search

// Define the type for trip details
type TripDetails = {
  image: string;
  location: string;
  address: string;
};

const TripBuilder: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const { tripDetails } = route.params as { tripDetails: TripDetails };

  const [travelCity, setTravelCity] = useState(""); // City input
  const [travelState, setTravelState] = useState(""); // State or country input
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [showDeparturePicker, setShowDeparturePicker] =
    useState<boolean>(false);
  const [showReturnPicker, setShowReturnPicker] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("Any");
  const [webViewVisible, setWebViewVisible] = useState<boolean>(false);

  const currentStyles = theme === "dark" ? darkStyles : styles;

  const handleDepartureDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || departureDate;
    setShowDeparturePicker(false);
    setDepartureDate(currentDate);

    // Ensure return date is after the departure date
    if (returnDate <= currentDate) {
      setReturnDate(currentDate);
    }
  };

  const handleReturnDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || returnDate;
    setShowReturnPicker(false);

    // Only allow return dates after the departure date
    if (currentDate > departureDate) {
      setReturnDate(currentDate);
    }
  };

  const handleLetsGo = () => {
    // Validate required fields
    if (!travelCity || !travelState || !departureDate || !returnDate) {
      alert(
        "Please fill in all fields (City, State, and both dates) before proceeding."
      );
      return; // Prevent proceeding if validation fails
    }
    setWebViewVisible(true);
  };

  if (webViewVisible) {
    const searchQuery =
      companyName === "Any"
        ? `Priceline flights from ${travelCity}, ${travelState} to ${
            tripDetails.address
          }, ${
            tripDetails.location
          } on ${departureDate.toDateString()} returning ${returnDate.toDateString()}`
        : `${companyName} flights from ${travelCity}, ${travelState} to ${
            tripDetails.address
          }, ${
            tripDetails.location
          } on ${departureDate.toDateString()} returning ${returnDate.toDateString()}`;

    return (
      <WebView
        source={{
          uri: `https://www.google.com/search?q=${encodeURIComponent(
            searchQuery
          )}`,
        }}
      />
    );
  }

  return (
    <ScrollView style={currentStyles.container}>
      {/* Image background */}
      <ImageBackground
        source={{ uri: tripDetails.image }}
        style={currentStyles.imageBackground}
      >
        <View style={currentStyles.overlay} />
        <Text style={currentStyles.city}>{tripDetails.address}</Text>
        <Text style={currentStyles.country}>{tripDetails.location}</Text>
      </ImageBackground>

      {/* Traveling From Section */}
      <View style={currentStyles.travelFromContainer}>
        <Text style={currentStyles.travelFromHeaderText}>Traveling From:</Text>
        <TextInput
          style={currentStyles.travelFromInput}
          placeholder="City"
          placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          onChangeText={setTravelCity}
          value={travelCity}
        />
        <TextInput
          style={currentStyles.travelFromInput}
          placeholder="State or Country"
          placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          onChangeText={setTravelState}
          value={travelState}
        />
      </View>

      {/* Date Pickers */}
      <View style={currentStyles.datePickersRow}>
        <View style={currentStyles.dateContainer}>
          <Text style={currentStyles.dateText}>Departure Date:</Text>
          <TouchableOpacity
            onPress={() => setShowDeparturePicker(true)}
            style={currentStyles.dateButton}
          >
            <Text style={currentStyles.dateButtonText}>
              {departureDate.toDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={currentStyles.dateContainer}>
          <Text style={currentStyles.dateText}>Return Date:</Text>
          <TouchableOpacity
            onPress={() => setShowReturnPicker(true)}
            style={currentStyles.dateButton}
          >
            <Text style={currentStyles.dateButtonText}>
              {returnDate.toDateString()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DateTimePicker for Departure Date */}
      {showDeparturePicker && (
        <DateTimePicker
          value={departureDate}
          mode="date"
          display="calendar"
          onChange={handleDepartureDateChange}
        />
      )}

      {/* DateTimePicker for Return Date */}
      {showReturnPicker && (
        <DateTimePicker
          value={returnDate}
          mode="date"
          display="calendar"
          minimumDate={departureDate} // Ensure the return date is after the departure date
          onChange={handleReturnDateChange}
        />
      )}

      {/* Company Name Selection */}
      <View style={currentStyles.companyContainer}>
        <Text style={currentStyles.companyHeader}>Company Name:</Text>
        {/* Radio Buttons for Company Name Selection */}
        <View style={currentStyles.radioGroup}>
          {[
            "Any",
            "Spirit Airlines",
            "Delta Airlines",
            "American Airlines",
            "United Airlines",
          ].map((option) => (
            <TouchableOpacity
              key={option}
              style={currentStyles.radioButton}
              onPress={() => setCompanyName(option)}
            >
              <View style={currentStyles.radioCircle}>
                {companyName === option && (
                  <View style={currentStyles.selectedRadioCircle} />
                )}
              </View>
              <Text style={currentStyles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Let's Go Button */}
      <TouchableOpacity
        style={currentStyles.letsGoButton}
        onPress={handleLetsGo}
      >
        <Text style={currentStyles.letsGoButtonText}>Let's Go</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TripBuilder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the parent container
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent grey
  },
  city: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  country: {
    fontSize: 22,
    color: "#A463FF",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  travelFromContainer: {
    width: "100%",
    marginTop: 20,
  },
  travelFromHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  travelFromInput: {
    height: 40,
    fontSize: 16,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#A463FF",
    marginBottom: 20,
    width: "100%",
  },
  companyContainer: {
    width: "100%",
    marginTop: 20,
  },
  companyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to the next line if needed
    marginTop: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, // Space between radio buttons
    marginBottom: 10, // Space below each radio button
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A463FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRadioCircle: {
    backgroundColor: "#A463FF",
    height: 15, // Inner circle height
    width: 15, // Inner circle width
    borderRadius: 7.5, // Inner circle border radius
  },
  radioText: {
    fontSize: 16,
    color: "#000",
  },
  letsGoButton: {
    marginTop: 20,
    backgroundColor: "#A463FF",
    padding: 15,
    borderRadius: 5,
  },
  letsGoButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 10,
    width: "48%", // Adjust width as necessary
  },
  dateText: {
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: "#A463FF",
    padding: 10,
    borderRadius: 5,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

// Add darkStyles if you have a dark theme.
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the parent container
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent grey
  },
  city: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  country: {
    fontSize: 22,
    color: "#A463FF",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  travelFromContainer: {
    width: "100%",
    marginTop: 20,
  },
  travelFromHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  travelFromInput: {
    height: 40,
    fontSize: 16,
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#A463FF",
    marginBottom: 20,
    width: "100%",
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 10,
    width: "48%", // Adjust width as necessary
  },
  dateText: {
    fontSize: 16,
    color: "#fff",
  },
  dateButton: {
    backgroundColor: "#A463FF",
    padding: 10,
    borderRadius: 5,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  companyContainer: {
    width: "100%",
    marginTop: 20,
  },
  companyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to the next line if needed
    marginTop: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, // Space between radio buttons
    marginBottom: 10, // Space below each radio button
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A463FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRadioCircle: {
    backgroundColor: "#A463FF",
    height: 15, // Inner circle height
    width: 15, // Inner circle width
    borderRadius: 7.5, // Inner circle border radius
  },
  radioText: {
    fontSize: 16,
    color: "#fff",
  },
  letsGoButton: {
    marginTop: 20,
    backgroundColor: "#A463FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },
  letsGoButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
