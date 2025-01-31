export const AI_PROMPT = `Generate a detailed and realistic JSON Travel Plan for a trip to a {destinationType} destination, lasting {totalDays} days and {totalNight} nights.
The trip is designed for {whoIsGoing} with a {budget} budget level
and the desired activity level is {activityLevel}. Please tailor all recommendations accordingly.

Important requirements:
- All prices must be realistic and match the specified budget level (low=$100-200/day, average=$200-400/day, luxury=$400+/day)
- Hotel ratings must be between 3-5 stars, with at least one 4+ star option
- Include exactly 3 activities/places per day in the itinerary, spaced throughout morning, afternoon and evening
- All coordinates must be real and accurate to within 100 meters
- All URLs must link to official websites or Google Maps listings
- Descriptions must include specific facts, dates, and historical context
- Avoid generic descriptions and marketing language

Return ONLY a valid JSON object with this exact structure:
{
  "travelPlan": {
    "budget": "Total estimated cost in USD (sum of all components)",
    "destination": "Full destination name including city, region and country",
    "photoRef": "Google Places photo reference for destination",
    "flights": {
      "airlineName": "Major international airline name",
      "flightPrice": "Average round-trip price in USD",
      "airlineUrl": "Direct URL to airline's booking page"
    },
    "hotels": [
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Rating out of 5 to one decimal place",
        "description": "Factual description including room types, amenities and recent renovations"
      },
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code", 
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Rating out of 5 to one decimal place",
        "description": "Factual description including room types, amenities and recent renovations"
      },
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)", 
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Rating out of 5 to one decimal place",
        "description": "Factual description including room types, amenities and recent renovations"
      }
    ],
    "itinerary": [
      {
        "day": "Day X: Theme for the day",
        "places": [
          {
            "placeName": "Official attraction name",
            "placeDetails": "Key highlights and practical visitor information",
            "placeExtendedDetails": "Historical background, architectural details, cultural significance and insider tips",
            "geoCoordinates": {
              "latitude": "Decimal coordinates to 6 decimal places",
              "longitude": "Decimal coordinates to 6 decimal places"
            },
            "ticketPrice": "Price in USD or 'Free' (include student/senior discounts if available)",
            "placeUrl": "Direct URL to official website or Google Maps"
          }
        ]
      }
    ]
  }
}`;

export const PLACE_AI_PROMPT = `Generate a detailed and realistic JSON Travel Plan for a trip to {name}, lasting {totalDays} days and {totalNight} nights.
The trip is designed for {whoIsGoing} with a {budget} budget level
and the desired activity level is {activityLevel}. Please tailor all recommendations accordingly.

Important requirements:
- All prices must be realistic and match the specified budget level (low=$100-200/day, average=$200-400/day, luxury=$400+/day)
- Hotel ratings must be between 3-5 stars, with at least one 4+ star option
- Include exactly 3 activities/places per day in the itinerary, spaced throughout morning, afternoon and evening
- All coordinates must be real and accurate to within 100 meters
- All URLs must link to official websites or Google Maps listings
- Descriptions must include specific facts, dates, and historical context
- Avoid generic descriptions and marketing language

Return ONLY a valid JSON object with this exact structure:
{
  "travelPlan": {
    "budget": "Total estimated cost in USD (sum of all components)",
    "destination": "Full destination name including city, region and country",
    "photoRef": "Google Places photo reference for destination",
    "flights": {
      "airlineName": "Major international airline name",
      "flightPrice": "Average round-trip price in USD",
      "airlineUrl": "Direct URL to airline's booking page"
    },
    "hotels": [
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Rating out of 5 to one decimal place",
        "description": "Factual description including room types, amenities and recent renovations"
      },
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Rating out of 5 to one decimal place",
        "description": "Factual description including room types, amenities and recent renovations"
      },
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Rating out of 5 to one decimal place",
        "description": "Factual description including room types, amenities and recent renovations"
      }
    ],
    "itinerary": [
      {
        "day": "Day X: Theme for the day",
        "places": [
          {
            "placeName": "Official attraction name",
            "placeDetails": "Key highlights and practical visitor information",
            "placeExtendedDetails": "Historical background, architectural details, cultural significance and insider tips",
            "geoCoordinates": {
              "latitude": "Decimal coordinates to 6 decimal places",
              "longitude": "Decimal coordinates to 6 decimal places"
            },
            "ticketPrice": "Price in USD or 'Free' (include student/senior discounts if available)",
            "placeUrl": "Direct URL to official website or Google Maps"
          }
        ]
      }
    ]
  }
}`;

export const RECOMMEND_TRIP_AI_PROMPT = `Generate a detailed and realistic JSON Travel Plan for a popular tourist destination that meets these exact parameters:
- Must be a top 50 global tourist destination by visitor numbers
- Duration: Exactly 5 days
- Group size: 2 adults
- Budget level: Average ($300 per person per day)
- Accommodation: 4-star hotels only
- Activity level: Moderate (2-3 hours walking per day)

Important requirements:
- All prices must be current for 2024 including taxes and fees
- Hotel ratings must be exactly 4 stars from major booking platforms
- Include exactly 3 activities per day spaced throughout morning, afternoon and evening
- All coordinates must be accurate to within 100 meters
- All URLs must link to official websites or Google Maps listings
- Descriptions must include specific facts, dates, and historical context
- Avoid generic descriptions and marketing language

Return ONLY a valid JSON object with this exact structure:
{
  "travelPlan": {
    "budget": "Total estimated cost in USD (sum of all components)",
    "numberOfDays": 5,
    "numberOfNights": 4,
    "destination": "Full destination name including city, region and country",
    "destinationDescription": "Brief overview of the destination's history, culture, and main attractions",
    "photoRef": "Google Places photo reference for destination",
    "flights": {
      "airlineName": "Major international airline name",
      "flightPrice": "Average round-trip price in USD",
      "airlineUrl": "Direct URL to airline's booking page"
    },
    "hotels": [
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Exactly 4.0",
        "description": "Factual description including room types, amenities and recent renovations"
      },
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Exactly 4.0",
        "description": "Factual description including room types, amenities and recent renovations"
      },
      {
        "hotelName": "Full official hotel name",
        "hotelAddress": "Complete street address with postal code",
        "price": "Price per night in USD (integer)",
        "geoCoordinates": {
          "latitude": "Decimal coordinates to 6 decimal places",
          "longitude": "Decimal coordinates to 6 decimal places"
        },
        "rating": "Exactly 4.0",
        "description": "Factual description including room types, amenities and recent renovations"
      }
    ],
    "itinerary": [
      {
        "day": "Day X: Theme for the day",
        "places": [
          {
            "placeName": "Official attraction name",
            "placeDetails": "Key highlights and practical visitor information",
            "placeExtendedDetails": "Historical background, architectural details, cultural significance and insider tips",
            "geoCoordinates": {
              "latitude": "Decimal coordinates to 6 decimal places",
              "longitude": "Decimal coordinates to 6 decimal places"
            },
            "ticketPrice": "Price in USD or 'Free' (include student/senior discounts if available)",
            "placeUrl": "Direct URL to official website or Google Maps"
          }
        ]
      }
    ]
  }
}`;
