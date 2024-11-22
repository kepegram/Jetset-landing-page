export const AI_PROMPT = `
  Generate Travel Plan to {location}, for {totalDays} Days and {totalNight} Nights.
  It will be a {whoIsGoing} trip with a {budget} budget.
  
  Give me flight details and flight prices with a real airline url to the airlines website.
  
  Also give me a Hotel options list with:
  - HotelName
  - Hotel address 
  - Price
  - hotel image url
  - geo coordinates
  - rating
  - descriptions
  
  Also suggest an itinerary with:
  - placeName
  - Place Details  
  - Place Image Url
  - Geo Coordinates
  - Ticket Price
  
  For {totalDays} days and {totalNight} nights.
  Give me with a plan for each day with best time to visit all in JSON format.
`;
