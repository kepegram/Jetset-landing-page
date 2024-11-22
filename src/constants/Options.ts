export const SelectTravelersList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: "🥂",
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun loving adventurers",
    icon: "🏡",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekes",
    icon: "⛵",
    people: "5 to 10 People",
  },
];

export const SetBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💵",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💰",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Dont worry about cost",
    icon: "💸",
  },
];

export const AI_PROMPT = `
  Generate Travel Plan to {location}, for {totalDays} Days and {totalNight} Nights.
  It will be for {traveler} with a {budget} budget.
  
  Give me Flight details, Flight Price with a real airline url to the airlines website.
  
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
