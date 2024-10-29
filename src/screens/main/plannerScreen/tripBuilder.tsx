import React, { useEffect, useState } from "react";
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
import { useTheme } from "../../../context/themeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import SwipeableModal from "../../../ui/swipeableModal";

const height = Dimensions.get("screen").height;

type TripDetails = {
  image: string;
  country: string;
  city: string;
};

const TripBuilder: React.FC = () => {
  const { currentTheme } = useTheme();
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
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch airport code using both country and city
    fetchAirportCode(tripDetails.city, tripDetails.country);
  }, [tripDetails.city, tripDetails.country]);

  const fetchAccessToken = async () => {
    const clientId = "gc3WxSoAMGRWIMFsZu6cIWByGtdSPFTV";
    const clientSecret = "svyZerXiXew2efAe";
    try {
      const response = await fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        }
      );
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const fetchAirportCode = async (cityQuery: string, countryQuery: string) => {
    try {
      console.log(
        `Fetching airport code with city: ${cityQuery} and country: ${countryQuery}`
      );

      const accessToken = await fetchAccessToken();
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${cityQuery}, ${countryQuery}&subType=AIRPORT`,
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
      const airportCode = data.data[0]?.iataCode || "";
      setToAirportCode(airportCode);

      console.log(`Airport code fetched: ${airportCode}`);
    } catch (error) {
      console.error("Error fetching airport code:", error);
    }
  };

  const handleCityChange = async (city: string) => {
    try {
      const accessToken = await fetchAccessToken();
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
      setSuggestions(data.data);
      const airportCode = data.data[0]?.iataCode || "";
      setFromAirportCode(airportCode);
    } catch (error) {
      console.error("Error fetching airport code:", error);
    }
  };

  const handleSearch = () => {
    if (!travelCity || !departureDate || !returnDate) {
      alert("Please fill in all fields before proceeding.");
      return;
    } else {
      //setWebViewVisible(true);
      console.log(fromAirportCode, toAirportCode);
    }
  };

  const handleTravelCityChange = (city: string) => {
    setTravelCity(city);
    if (city) {
      handleCityChange(city);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (airport: any) => {
    setTravelCity(airport.name);
    setFromAirportCode(airport.iataCode);
    setSuggestions([]);
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
      searchQueryUrl = `https://www.google.com`;
    } else if (companyName === "Spirit Airlines") {
      searchQueryUrl = `https://www.spirit.com/book/flights?departureCity=${travelCity}&arrivalCity=${
        tripDetails.city
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adultPassengers=${adultCount}&childPassengers=${childCount}`;
    } else if (companyName === "Delta Airlines") {
      searchQueryUrl = `https://www.delta.com/flight-search/book-a-flight?fromCity=${travelCity}&toCity=${
        tripDetails.city
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adults=${adultCount}&children=${childCount}`;
    } else if (companyName === "American Airlines") {
      searchQueryUrl = `https://www.aa.com/booking/flights?origin=${travelCity}&destination=${
        tripDetails.city
      }&departureDate=${departureDate.toISOString().split("T")[0]}&returnDate=${
        returnDate.toISOString().split("T")[0]
      }&adults=${adultCount}&children=${childCount}`;
    } else if (companyName === "United Airlines") {
      searchQueryUrl = `https://www.united.com/en/us/fsr/choose-flights?from=${travelCity}&to=${
        tripDetails.city
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
    if (adultCount > 1) setAdultCount(adultCount - 1);
  };

  const incrementChildren = () => setChildCount(childCount + 1);
  const decrementChildren = () => {
    if (childCount > 0) setChildCount(childCount - 1);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <ImageBackground
        source={{ uri: tripDetails.image }}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay} />
        <Text style={[styles.title, { color: currentTheme.buttonText }]}>
          Let's go to {tripDetails.city}.
        </Text>
      </ImageBackground>

      <View
        style={[
          styles.backgroundBelowImage,
          { backgroundColor: currentTheme.background },
        ]}
      />

      <View
        style={[
          styles.bookingContainer,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <View style={styles.travelFromContainer}>
          <Text
            style={[
              styles.travelFromHeaderText,
              { color: currentTheme.textSecondary },
            ]}
          >
            From:
          </Text>
          <TextInput
            style={[
              styles.travelFromInput,
              {
                color: currentTheme.textPrimary,
                borderBottomColor: currentTheme.primary,
              },
            ]}
            placeholder="City"
            placeholderTextColor={currentTheme.textSecondary}
            onChangeText={handleTravelCityChange}
            value={travelCity}
          />
        </View>

        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.iataCode}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    { color: currentTheme.textPrimary },
                  ]}
                >
                  {item.name} ({item.iataCode})
                </Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
          />
        )}

        <View style={styles.datePickersRow}>
          <View style={styles.dateContainer}>
            <Text
              style={[styles.dateText, { color: currentTheme.textSecondary }]}
            >
              Departure:
            </Text>
            <DateTimePicker
              value={departureDate}
              mode="date"
              display="calendar"
              minimumDate={new Date()}
              onChange={handleDepartureDateChange}
            />
          </View>

          <View style={styles.dateContainer}>
            <Text
              style={[styles.dateText, { color: currentTheme.textSecondary }]}
            >
              Return:
            </Text>
            <DateTimePicker
              value={returnDate}
              mode="date"
              display="calendar"
              minimumDate={departureDate}
              onChange={handleReturnDateChange}
            />
          </View>
        </View>

        <View style={styles.companyContainer}>
          <Text
            style={[
              styles.companyHeader,
              { color: currentTheme.textSecondary },
            ]}
          >
            Airline:
          </Text>
          <Dropdown
            style={[styles.dropdown, { borderColor: currentTheme.primary }]}
            data={airlineOptions}
            labelField="label"
            valueField="value"
            placeholder="Select an airline"
            placeholderStyle={{ color: currentTheme.textPrimary }}
            value={companyName}
            onChange={(item) => setCompanyName(item.value)}
          />
        </View>

        {/* Adults and Children Counters */}
        <View style={styles.counterContainer}>
          <View style={styles.countersRow}>
            <View style={styles.counterSection}>
              <Text
                style={[
                  styles.counterHeader,
                  { color: currentTheme.textSecondary },
                ]}
              >
                Adults:
              </Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  onPress={decrementAdults}
                  style={[
                    styles.counterButton,
                    { backgroundColor: currentTheme.contrast },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterButtonText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    -
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.counterText,
                    { color: currentTheme.textPrimary },
                  ]}
                >
                  {adultCount}
                </Text>
                <TouchableOpacity
                  onPress={incrementAdults}
                  style={[
                    styles.counterButton,
                    { backgroundColor: currentTheme.contrast },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterButtonText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterSection}>
              <Text
                style={[
                  styles.counterHeader,
                  { color: currentTheme.textSecondary },
                ]}
              >
                Children:
              </Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity
                  onPress={decrementChildren}
                  style={[
                    styles.counterButton,
                    { backgroundColor: currentTheme.contrast },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterButtonText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    -
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.counterText,
                    { color: currentTheme.textPrimary },
                  ]}
                >
                  {childCount}
                </Text>
                <TouchableOpacity
                  onPress={incrementChildren}
                  style={[
                    styles.counterButton,
                    { backgroundColor: currentTheme.contrast },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterButtonText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Let's Go Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: currentTheme.buttonBackground },
          ]}
          onPress={handleSearch}
        >
          <Text
            style={[
              styles.searchButtonText,
              { color: currentTheme.buttonText },
            ]}
          >
            Search Flights
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripBuilder;

const styles = StyleSheet.create({
  container: {
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
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  backgroundBelowImage: {
    height: Dimensions.get("screen").height - 365,
    width: "100%",
  },
  bookingContainer: {
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    position: "absolute",
    top: 150,
    left: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  travelFromContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  travelFromHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  travelFromInput: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1,
    marginBottom: 20,
    width: "100%",
  },
  suggestionList: {
    position: "absolute",
    zIndex: 1,
    width: "110%",
    maxHeight: 200,
    top: "20%",
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
  },
  datePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dateContainer: {},
  dateText: {
    fontSize: 16,
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
  },
  dropdown: {
    height: 40,
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
  },
  counterButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  counterButton: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  counterButtonText: {
    fontSize: 18,
  },
  counterText: {
    fontSize: 18,
    width: 40,
    textAlign: "center",
  },
  searchButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 15,
    alignSelf: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
  },
});
