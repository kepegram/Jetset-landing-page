export const AI_PROMPT = `
  Generate a structured JSON Travel Plan for a trip to {location}, lasting {totalDays} days and {totalNight} nights.
  The trip will be for {whoIsGoing} with a {budget} budget. The traveler type is {travelerType}, 
  accommodation type is {accommodationType}, activity level is {activityLevel}, 
  and preferred climate is {preferredClimate} so plan the trip accordingly.
  
  The JSON should have the following structure:

  {
    "travelPlan": {
      "budget": "",
      "destination": "",
      "flights": {
        "airlineName": "",
        "flightPrice": "",
        "airlineUrl": ""
      },
      "hotels": [
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        }
      ],
      "itinerary": [
        {
          "day": "",
          "places": [
            {
              "placeName": "",
              "placeDetails": "",
              "placeExtendedDetails": "",
              "geoCoordinates": {
                "latitude": "",
                "longitude": ""
              },
              "ticketPrice": "",
              "placeUrl": ""
            }
          ]
        }
      ]
    }
  }

  Ensure the JSON format is consistent. Provide a placeUrl for each place that takes the user to a google search of the place. 
  Also provide a placeExtendedDetails for each place that provides more information and facts about the place
  the user can read and learn. Also provide multiple hotel options in the "hotels" array.
`;

export const RECOMMEND_TRIP_AI_PROMPT = `
  Generate a structured JSON Travel Plan for a trip with a randomly chosen location, lasting a random number of days and nights.
  The trip will be for a random number group of people with a average budget. The accommodation type is hotel, activity level is normal, 
  and preferred climate is average so plan the trip accordingly.
  
  The JSON should have the following structure:

  {
    "travelPlan": {
      "budget": "",
      "numberOfDays": "",
      "numberOfNights": "",
      "destination": "",
      "flights": {
        "airlineName": "",
        "flightPrice": "",
        "airlineUrl": ""
      },
      "hotels": [
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        }
      ],
      "itinerary": [
        {
          "day": "",
          "places": [
            {
              "placeName": "",
              "placeDetails": "",
              "placeExtendedDetails": "",
              "geoCoordinates": {
                "latitude": "",
                "longitude": ""
              },
              "ticketPrice": "",
              "placeUrl": ""
            }
          ]
        }
      ]
    }
  }

  Ensure the JSON format is consistent. Provide a placeUrl for each place that takes the user to a google search of the place. 
  Also provide a placeExtendedDetails for each place that provides more information and facts about the place
  the user can read and learn. Also provide multiple hotel options in the "hotels" array.
`;

export const SPECIFIC_TERRAIN_TRIP_AI_PROMPT = `
  Generate a structured JSON Travel Plan for a trip to a random {terrainType} terrain, lasting a random number of days and nights.
  The trip will be for a random number group of people with a average budget. The accommodation type is hotel, 
  activity level is normal, 
  and preferred climate is average so plan the trip accordingly.
  
  The JSON should have the following structure:

  {
    "travelPlan": {
      "budget": "",
      "numberOfDays": "",
      "numberOfNights": "",
      "destination": "",
      "flights": {
        "airlineName": "",
        "flightPrice": "",
        "airlineUrl": ""
      },
      "hotels": [
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        }
      ],
      "itinerary": [
        {
          "day": "",
          "places": [
            {
              "placeName": "",
              "placeDetails": "",
              "placeExtendedDetails": "",
              "geoCoordinates": {
                "latitude": "",
                "longitude": ""
              },
              "ticketPrice": "",
              "placeUrl": ""
            }
          ]
        }
      ]
    }
  }

  Ensure the JSON format is consistent. Provide a placeUrl for each place that takes the user to a google search of the place. 
  Also provide a placeExtendedDetails for each place that provides more information and facts about the place
  the user can read and learn. Also provide multiple hotel options in the "hotels" array.
`;

export const SPECIFIC_CITY_TRIP_AI_PROMPT = `
  Generate a structured JSON Travel Plan to {cityName}, lasting a random number of days and nights.
  The trip will be for a random number group of people with a average budget. The accommodation type is hotel, 
  activity level is normal, 
  and preferred climate is average so plan the trip accordingly.
  
  The JSON should have the following structure:

  {
    "travelPlan": {
      "budget": "",
      "numberOfDays": "",
      "numberOfNights": "",
      "destination": "",
      "flights": {
        "airlineName": "",
        "flightPrice": "",
        "airlineUrl": ""
      },
      "hotels": [
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        },
        {
          "hotelName": "",
          "hotelAddress": "",
          "price": "",
          "geoCoordinates": {
            "latitude": "",
            "longitude": ""
          },
          "rating": "",
          "description": ""
        }
      ],
      "itinerary": [
        {
          "day": "",
          "places": [
            {
              "placeName": "",
              "placeDetails": "",
              "placeExtendedDetails": "",
              "geoCoordinates": {
                "latitude": "",
                "longitude": ""
              },
              "ticketPrice": "",
              "placeUrl": ""
            }
          ]
        }
      ]
    }
  }

  Ensure the JSON format is consistent. Provide a placeUrl for each place that takes the user to a google search of the place. 
  Also provide a placeExtendedDetails for each place that provides more information and facts about the place
  the user can read and learn. Also provide multiple hotel options in the "hotels" array.
`;
