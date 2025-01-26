export const AI_PROMPT = `
  Generate a detailed and realistic JSON Travel Plan for a trip to a {destinationType} destination, lasting {totalDays} days and {totalNight} nights.
  The trip is designed for {whoIsGoing} with a {budget} budget level. The preferred accommodation type is {accommodationType} 
  and the desired activity level is {activityLevel}. Please tailor all recommendations accordingly.

  Important requirements:
  - All prices should be realistic and match the specified budget level
  - Hotel ratings should be between 3-5 stars
  - Include 2-4 activities/places per day in the itinerary
  - All coordinates must be real and accurate
  - All URLs should link to official websites when possible
  - Descriptions should be detailed and factual
  
  The JSON must strictly follow this structure:

  {
    "travelPlan": {
      "budget": "Total estimated cost in USD",
      "destination": "Full destination name including country",
      "photoRef": "Google Places photo reference for destination",
      "flights": {
        "airlineName": "Major airline name",
        "flightPrice": "Price in USD",
        "airlineUrl": "Airline's official booking URL"
      },
      "hotels": [
        {
          "hotelName": "Full hotel name",
          "hotelAddress": "Complete street address",
          "price": "Price per night in USD",
          "geoCoordinates": {
            "latitude": "Precise decimal coordinates",
            "longitude": "Precise decimal coordinates"
          },
          "rating": "Rating out of 5",
          "description": "Detailed 2-3 sentence description"
        }
      ],
      "itinerary": [
        {
          "day": "Day number and title",
          "places": [
            {
              "placeName": "Full attraction name",
              "placeDetails": "Brief 1-2 sentence overview",
              "placeExtendedDetails": "Detailed 3-4 sentence description with historical facts",
              "geoCoordinates": {
                "latitude": "Precise decimal coordinates",
                "longitude": "Precise decimal coordinates"
              },
              "ticketPrice": "Price in USD or 'Free'",
              "placeUrl": "Official website URL or Google Maps URL"
            }
          ]
        }
      ]
    }
  }

  Ensure all data is realistic, accurate and properly formatted. Each place should have complete and engaging descriptions.
  Include at least 3 hotel options of varying price points within the specified budget range.
  The itinerary should be logically organized to minimize travel time between locations.
`;

export const RECOMMEND_TRIP_AI_PROMPT = `
  Generate a detailed and realistic JSON Travel Plan for an exciting destination, with the following parameters:
  - Choose a popular tourist destination
  - Duration: 4-7 days
  - Group size: 2-4 people
  - Budget level: Average ($200-400 per person per day)
  - Accommodation: Mid-range hotels
  - Activity level: Moderate with a mix of sightseeing and activities

  Important requirements:
  - All prices should be realistic for 2023
  - Hotel ratings should be 3.5+ stars
  - Include 2-4 activities per day
  - All coordinates must be real and accurate
  - All URLs should link to official websites when possible
  - Descriptions should be detailed and factual

  The JSON must strictly follow this structure:

  {
    "travelPlan": {
      "budget": "Total estimated cost in USD",
      "numberOfDays": "Integer between 4-7",
      "numberOfNights": "Days minus 1",
      "destination": "Full destination name including country",
      "photoRef": "Google Places photo reference for destination",
      "flights": {
        "airlineName": "Major airline name",
        "flightPrice": "Average price in USD",
        "airlineUrl": "Airline's official booking URL"
      },
      "hotels": [
        {
          "hotelName": "Full hotel name",
          "hotelAddress": "Complete street address",
          "price": "Price per night in USD",
          "geoCoordinates": {
            "latitude": "Precise decimal coordinates",
            "longitude": "Precise decimal coordinates"
          },
          "rating": "Rating out of 5",
          "description": "Detailed 2-3 sentence description"
        }
      ],
      "itinerary": [
        {
          "day": "Day number and title",
          "places": [
            {
              "placeName": "Full attraction name",
              "placeDetails": "Brief 1-2 sentence overview",
              "placeExtendedDetails": "Detailed 3-4 sentence description with historical facts",
              "geoCoordinates": {
                "latitude": "Precise decimal coordinates",
                "longitude": "Precise decimal coordinates"
              },
              "ticketPrice": "Price in USD or 'Free'",
              "placeUrl": "Official website URL or Google Maps URL"
            }
          ]
        }
      ]
    }
  }

  Ensure all data is realistic, accurate and properly formatted. Each place should have complete and engaging descriptions.
  Include exactly 3 hotel options of varying price points. The itinerary should be logically organized to minimize travel time.
`;
