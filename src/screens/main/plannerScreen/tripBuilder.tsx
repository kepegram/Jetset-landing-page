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
import DateTimePicker from "@react-native-community/datetimepicker";
import { WebView } from "react-native-webview";

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

  const [travelCity, setTravelCity] = useState("");
  const [travelState, setTravelState] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [showDeparturePicker, setShowDeparturePicker] =
    useState<boolean>(false);
  const [showReturnPicker, setShowReturnPicker] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("Any");
  const [webViewVisible, setWebViewVisible] = useState<boolean>(false);

  // New state variables for counters
  const [adultCount, setAdultCount] = useState<number>(1); // Default to 1 adult
  const [childCount, setChildCount] = useState<number>(0); // Default to 0 children

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

  const handleSearch = () => {
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
    let searchQueryUrl;

    // Priceline search URL construction when companyName is "Any"
    if (companyName === "Any") {
      searchQueryUrl = `https://www.priceline.com/flights/#/search/${travelCity}-${travelState}/${
        tripDetails.address
      }-${tripDetails.location}/${departureDate.toISOString().split("T")[0]}/${
        returnDate.toISOString().split("T")[0]
      }/${adultCount}/${childCount}/economy`;
    }
    // Redirect to Spirit Airlines
    else if (companyName === "Spirit Airlines") {
      searchQueryUrl = `https://www.spirit.com/book/flights?departureCity=${travelCity}&arrivalCity=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adultPassengers=${adultCount}&childPassengers=${childCount}`;
    }
    // Redirect to Delta Airlines
    else if (companyName === "Delta Airlines") {
      searchQueryUrl = `https://www.delta.com/flight-search/book-a-flight?fromCity=${travelCity}&toCity=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adults=${adultCount}&children=${childCount}`;
    }
    // Redirect to American Airlines
    else if (companyName === "American Airlines") {
      searchQueryUrl = `https://www.aa.com/booking/flights?origin=${travelCity}&destination=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adults=${adultCount}&children=${childCount}`;
    }
    // Redirect to United Airlines
    else if (companyName === "United Airlines") {
      searchQueryUrl = `https://www.united.com/en/us/fsr/choose-flights?from=${travelCity}&to=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adultPassengers=${adultCount}&childPassengers=${childCount}`;
    }

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => setWebViewVisible(false)} // Back button action
          // Styling for the back button
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <WebView
          source={{
            uri: searchQueryUrl,
          }}
        />
      </View>
    );
  }

  // Counter Increment/Decrement Functions
  const incrementAdults = () => setAdultCount(adultCount + 1);
  const decrementAdults = () => {
    if (adultCount > 1) setAdultCount(adultCount - 1); // Prevent negative count
  };

  const incrementChildren = () => setChildCount(childCount + 1);
  const decrementChildren = () => {
    if (childCount > 0) setChildCount(childCount - 1); // Prevent negative count
  };

  return (
    <View style={currentStyles.container}>
      {/* Image background */}
      <ImageBackground
        source={{ uri: tripDetails.image }}
        style={currentStyles.imageBackground}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={currentStyles.overlay} />
        <Text style={currentStyles.city}>
          Let's go to {tripDetails.address}, {tripDetails.location}.
        </Text>
      </ImageBackground>

      {/* Traveling From Section */}
      <View style={currentStyles.bookingContainer}>
        <View style={currentStyles.travelFromContainer}>
          <Text style={currentStyles.travelFromHeaderText}>From:</Text>
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
            <Text style={currentStyles.dateText}>Departure:</Text>
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
            <Text style={currentStyles.dateText}>Return:</Text>
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

        {/* Adults and Children Counters */}
        <View style={currentStyles.counterContainer}>
          <View style={currentStyles.countersRow}>
            <View style={currentStyles.counterSection}>
              <Text style={currentStyles.counterHeader}>Adults:</Text>
              <View style={currentStyles.counterButtons}>
                <TouchableOpacity
                  onPress={decrementAdults}
                  style={currentStyles.counterButton}
                >
                  <Text style={currentStyles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={currentStyles.counterText}>{adultCount}</Text>
                <TouchableOpacity
                  onPress={incrementAdults}
                  style={currentStyles.counterButton}
                >
                  <Text style={currentStyles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={currentStyles.counterSection}>
              <Text style={currentStyles.counterHeader}>Children:</Text>
              <View style={currentStyles.counterButtons}>
                <TouchableOpacity
                  onPress={decrementChildren}
                  style={currentStyles.counterButton}
                >
                  <Text style={currentStyles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={currentStyles.counterText}>{childCount}</Text>
                <TouchableOpacity
                  onPress={incrementChildren}
                  style={currentStyles.counterButton}
                >
                  <Text style={currentStyles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Let's Go Button */}
        <TouchableOpacity
          style={currentStyles.searchButton}
          onPress={handleSearch}
        >
          <Text style={currentStyles.searchButtonText}>Search Flights</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripBuilder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the parent container
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent grey
  },
  city: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  bookingContainer: {
    marginTop: 5,
    padding: 20,
    borderRadius: 15,
    shadowOpacity: 30,
    top: "90%",
    shadowColor: "grey",
    backgroundColor: "white",
    position: "absolute",
  },
  travelFromContainer: {
    width: "100%",
    flexDirection: "row", // Align inputs in a row
    justifyContent: "space-between", // Space between inputs
    alignItems: "center", // Align vertically in the center if needed
  },
  travelFromHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b8b8b8",
  },
  travelFromInput: {
    height: 40,
    fontSize: 16,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#A463FF",
    marginBottom: 20,
    width: "38%", // Adjust width for row alignment
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dateContainer: {
    width: "48%",
  },
  dateText: {
    fontSize: 16,
    color: "#b8b8b8",
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateButton: {
    alignItems: "center",
    padding: 10,
  },
  dateButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  companyContainer: {
    width: "100%",
    marginTop: 10,
  },
  companyHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b8b8b8",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to the next line if needed
    marginTop: 10,
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A463FF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#A463FF",
  },
  radioText: {
    marginLeft: 5,
    color: "#000",
  },
  counterContainer: {
    marginBottom: 20,
  },
  countersRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Space between Adult and Children sections
    marginBottom: 10,
  },
  counterSection: {
    width: "48%", // Adjust width to ensure they fit in the row
  },
  counterHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  counterButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  counterButton: {
    backgroundColor: "#A463FF",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  counterButtonText: {
    color: "white",
    fontSize: 18,
  },
  counterText: {
    fontSize: 18,
    width: 40,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#A463FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the parent container
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent grey
  },
  city: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  bookingContainer: {
    marginTop: 5,
    padding: 20,
    borderRadius: 15,
    shadowOpacity: 30,
    top: "90%",
    shadowColor: "grey",
    backgroundColor: "white",
    position: "absolute",
  },
  travelFromContainer: {
    width: "100%",
    flexDirection: "row", // Align inputs in a row
    justifyContent: "space-between", // Space between inputs
    alignItems: "center", // Align vertically in the center if needed
  },
  travelFromHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b8b8b8",
  },
  travelFromInput: {
    height: 40,
    fontSize: 16,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#A463FF",
    marginBottom: 20,
    width: "38%", // Adjust width for row alignment
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dateContainer: {
    width: "48%",
  },
  dateText: {
    fontSize: 16,
    color: "#b8b8b8",
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateButton: {
    alignItems: "center",
    padding: 10,
  },
  dateButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  companyContainer: {
    width: "100%",
    marginTop: 10,
  },
  companyHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b8b8b8",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to the next line if needed
    marginTop: 10,
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A463FF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#A463FF",
  },
  radioText: {
    marginLeft: 5,
    color: "#000",
  },
  counterContainer: {
    marginBottom: 20,
  },
  countersRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Space between Adult and Children sections
    marginBottom: 10,
  },
  counterSection: {
    width: "48%", // Adjust width to ensure they fit in the row
  },
  counterHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  counterButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  counterButton: {
    backgroundColor: "#A463FF",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  counterButtonText: {
    color: "white",
    fontSize: 18,
  },
  counterText: {
    fontSize: 18,
    width: 40,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#A463FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
