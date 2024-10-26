import React, { useState } from "react"; // Removed useEffect import
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../profileScreen/themeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import SwipeableModal from "../../../components/swipeableModal";

const height = Dimensions.get("screen").height;

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
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [companyName, setCompanyName] = useState<string>("Any");
  const [webViewVisible, setWebViewVisible] = useState<boolean>(false);
  const [adultCount, setAdultCount] = useState<number>(1);
  const [childCount, setChildCount] = useState<number>(0);
  const [fromAirportCode, setFromAirportCode] = useState("");
  const [toAirportCode, setToAirportCode] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]); // State for airport suggestions

  const currentStyles = theme === "dark" ? darkStyles : styles;

  const handleCityChange = async (city: string, isFromCity = true) => {
    const accessToken = "gc3WxSoAMGRWIMFsZu6cIWByGtdSPFTV"; // Replace with your Amadeus API key
    try {
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${city}&subType=AIRPORT`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.data); // Set suggestions to the response
      const airportCode = data.data[0]?.iataCode || "";
      isFromCity
        ? setFromAirportCode(airportCode)
        : setToAirportCode(airportCode);
    } catch (error) {
      console.error("Error fetching airport code:", error);
    }
  };

  const handleSearch = () => {
    if (!fromAirportCode || !toAirportCode || !departureDate || !returnDate) {
      alert("Please fill in all fields before proceeding.");
      return;
    }
    setWebViewVisible(true);
  };

  const handleTravelCityChange = (city: string) => {
    setTravelCity(city);
    if (city) {
      handleCityChange(city, true); // Fetch airport codes as user types
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  const handleSelectSuggestion = (airport: any) => {
    setTravelCity(airport.name); // Set the city name from the suggestion
    setFromAirportCode(airport.iataCode); // Set the airport code
    setSuggestions([]); // Clear suggestions after selection
  };

  const airlineOptions = [
    { label: "Any", value: "Any" },
    { label: "Spirit Airlines", value: "Spirit Airlines" },
    { label: "Delta Airlines", value: "Delta Airlines" },
    { label: "American Airlines", value: "American Airlines" },
    { label: "United Airlines", value: "United Airlines" },
  ];

  const handleDepartureDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || departureDate;
    if (currentDate >= new Date()) {
      setDepartureDate(currentDate);
      if (returnDate <= currentDate) {
        setReturnDate(currentDate);
      }
    }
  };

  const handleReturnDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || returnDate;
    if (currentDate > departureDate) {
      setReturnDate(currentDate);
    }
  };

  if (webViewVisible) {
    let searchQueryUrl: string;
    if (companyName === "Any") {
      searchQueryUrl = `https://www.google.com/flights?hl=en#flt=${travelCity}.${
        tripDetails.address
      }.${departureDate.toISOString().split("T")[0]}*${
        tripDetails.address
      }.${travelCity}.${
        returnDate.toISOString().split("T")[0]
      };c:USD;e:1;sc:b;px:${adultCount},${childCount};`;
    } else if (companyName === "Spirit Airlines") {
      searchQueryUrl = `https://www.spirit.com/book/flights?departureCity=${travelCity}&arrivalCity=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adultPassengers=${adultCount}&childPassengers=${childCount}`;
    } else if (companyName === "Delta Airlines") {
      searchQueryUrl = `https://www.delta.com/flight-search/book-a-flight?fromCity=${travelCity}&toCity=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adults=${adultCount}&children=${childCount}`;
    } else if (companyName === "American Airlines") {
      searchQueryUrl = `https://www.aa.com/booking/flights?origin=${travelCity}&destination=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adults=${adultCount}&children=${childCount}`;
    } else if (companyName === "United Airlines") {
      searchQueryUrl = `https://www.united.com/en/us/fsr/choose-flights?from=${travelCity}&to=${
        tripDetails.address
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adultPassengers=${adultCount}&childPassengers=${childCount}`;
    }
    return (
      <SwipeableModal
        visible={webViewVisible}
        onClose={() => setWebViewVisible(false)}
        url={searchQueryUrl}
        height={height - 35}
      />
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
        <Text style={currentStyles.title}>
          Let's go to {tripDetails.address}.
        </Text>
      </ImageBackground>

      <View style={currentStyles.bookingContainer}>
        <View style={currentStyles.travelFromContainer}>
          <Text style={currentStyles.travelFromHeaderText}>From:</Text>
          <TextInput
            style={currentStyles.travelFromInput}
            placeholder="City"
            placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
            onChangeText={handleTravelCityChange} // Update handler
            value={travelCity}
          />
        </View>

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.iataCode}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={currentStyles.suggestion}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Text style={currentStyles.suggestionText}>
                  {item.name} ({item.iataCode})
                </Text>
              </TouchableOpacity>
            )}
            style={currentStyles.suggestionList}
          />
        )}

        {/* Date Pickers */}
        <View style={currentStyles.datePickersRow}>
          <View style={currentStyles.dateContainer}>
            <Text style={currentStyles.dateText}>Departure:</Text>
            <DateTimePicker
              value={departureDate}
              mode="date"
              display="calendar"
              minimumDate={new Date()}
              onChange={handleDepartureDateChange}
            />
          </View>

          <View style={currentStyles.dateContainer}>
            <Text style={currentStyles.dateText}>Return:</Text>
            <DateTimePicker
              value={returnDate}
              mode="date"
              display="calendar"
              minimumDate={departureDate}
              onChange={handleReturnDateChange}
            />
          </View>
        </View>

        {/* Company Name Dropdown */}
        <View style={currentStyles.companyContainer}>
          <Text style={currentStyles.companyHeader}>Airline:</Text>
          <Dropdown
            style={currentStyles.dropdown}
            data={airlineOptions}
            labelField="label"
            valueField="value"
            placeholder="Select an airline"
            value={companyName}
            onChange={(item) => setCompanyName(item.value)}
          />
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
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 40,
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
    top: "80%",
    backgroundColor: "white",
    position: "absolute",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  travelFromContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
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
    width: "100%",
  },
  suggestionList: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1,
    width: "100%",
    maxHeight: 200,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  suggestionText: {
    color: "#333",
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dateContainer: {},
  dateText: {
    fontSize: 16,
    color: "#b8b8b8",
    fontWeight: "bold",
    marginBottom: 5,
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
  dropdown: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  counterContainer: {
    marginBottom: 20,
  },
  countersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  counterSection: {
    width: "48%",
  },
  counterHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#b8b8b8",
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
  closeButton: {
    padding: 15,
    backgroundColor: "#333",
    alignSelf: "center",
  },
  closeButtonText: {
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 40,
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
    top: "90%",
    backgroundColor: "white",
    position: "absolute",
    width: "50%",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  travelFromContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: "38%",
  },
  suggestionList: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1,
    width: "100%",
    maxHeight: 200,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  suggestionText: {
    color: "#333",
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dateContainer: {},
  dateText: {
    fontSize: 16,
    color: "#b8b8b8",
    fontWeight: "bold",
    marginBottom: 5,
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
  dropdown: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    justifyContent: "space-between",
    marginBottom: 10,
  },
  counterSection: {
    width: "48%",
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
  closeButton: {
    padding: 15,
    backgroundColor: "#333",
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
