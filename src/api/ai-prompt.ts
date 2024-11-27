export const AI_PROMPT = `
  Generate a structured JSON Travel Plan for a trip to {location}, lasting {totalDays} days and {totalNight} nights.
  The trip will be for {whoIsGoing} with a {budget} budget.

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
          "hotelImageUrl": "",
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
              "ticketPrice": "$",
            }
          ]
        }
      ]
    }
  }

  Ensure the JSON format is consistent and includes a daily plan with the best times to visit each location.
`;
