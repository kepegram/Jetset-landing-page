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
              "geoCoordinates": {
                "latitude": "",
                "longitude": ""
              },
              "ticketPrice": "",
            }
          ]
        }
      ]
    }
  }

  Ensure the JSON format is consistent and includes a daily plan with the best times to visit each location. 
  Provide multiple hotel options in the "hotels" array.
`;
