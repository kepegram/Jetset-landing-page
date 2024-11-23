export const AI_PROMPT = `
  Generate a structured JSON Travel Plan for a trip to {location}, lasting {totalDays} days and {totalNight} nights.
  The trip will be for {whoIsGoing} with a {budget} budget.

  Provide flight details including:
  - Airline Name
  - Flight Price
  - Airline URL

  Provide a list of hotel options, each with:
  - HotelName
  - HotelAddress
  - Price
  - HotelImageUrl
  - GeoCoordinates
  - Rating
  - Description

  Suggest an itinerary with details for each place, including:
  - PlaceName
  - PlaceDetails
  - PlaceImageUrl
  - GeoCoordinates
  - TicketPrice

  Ensure the JSON format is consistent and includes a daily plan with the best times to visit each location.
`;
