// Define the type for a destination object
interface Destination {
  id: string;
  name: string;
  image: any;
  description: string;
}

export const popularDestinations: Destination[] = [
  {
    id: "1",
    name: "New York, USA",
    image: require("../assets/popular-imgs/ny.jpg"),
    description:
      "The Big Apple is a global hub of culture, finance, and entertainment. Home to iconic landmarks like the Empire State Building, Times Square, and Central Park. With over 800 languages spoken, it's the most linguistically diverse city in the world. The subway system runs 24/7 and spans over 850 miles of track.",
  },
  {
    id: "2",
    name: "Paris, France",
    image: require("../assets/popular-imgs/paris.jpg"),
    description:
      "The City of Light captivates with its elegant architecture, world-class museums, and culinary excellence. The Eiffel Tower, built in 1889, receives about 7 million visitors annually. The Louvre houses over 380,000 objects and 35,000 works of art. Paris has more than 450 parks and gardens.",
  },
  {
    id: "3",
    name: "Tokyo, Japan",
    image: require("../assets/popular-imgs/tokyo.jpeg"),
    description:
      "A city where tradition meets ultra-modernity. Tokyo is the world's largest metropolitan economy and a leader in technology and innovation. Home to the world's busiest pedestrian crossing (Shibuya), over 160,000 restaurants, and more Michelin stars than any other city.",
  },
  {
    id: "4",
    name: "London, UK",
    image: require("../assets/popular-imgs/london.jpg"),
    description:
      "A historic metropolis on the Thames River, blending centuries-old tradition with contemporary culture. The city has four UNESCO World Heritage sites, including the Tower of London. The London Underground is the world's oldest underground railway network, opened in 1863.",
  },
  {
    id: "5",
    name: "Dubai, UAE",
    image: require("../assets/popular-imgs/dubai.jpg"),
    description:
      "A futuristic city rising from the desert, known for architectural marvels and luxury shopping. Home to the world's tallest building, the Burj Khalifa (2,717 ft). The city transformed from a fishing village to a global metropolis in just 50 years. Features the world's largest mall and artificial islands.",
  },
  {
    id: "6",
    name: "Sydney, Australia",
    image: require("../assets/popular-imgs/sydney.jpg"),
    description:
      "Australia's largest city, famous for its harbor, beaches, and iconic Opera House. The Sydney Harbour Bridge is the world's largest steel arch bridge. The city hosts the largest natural harbor in the world with over 240 kilometers of shoreline. Home to five of Australia's top universities.",
  },
  {
    id: "7",
    name: "Rome, Italy",
    image: require("../assets/popular-imgs/rome.jpeg"),
    description:
      "The Eternal City is a living museum of art, architecture, and ancient history. Contains the world's smallest country, Vatican City. The Colosseum is the largest amphitheater ever built. Romans toss about €3,000 into the Trevi Fountain each day. Has over 2,000 fountains, the most of any city.",
  },
  {
    id: "8",
    name: "Bangkok, Thailand",
    image: require("../assets/popular-imgs/bangkok.jpg"),
    description:
      "Thailand's vibrant capital, known for ornate temples, street food, and bustling markets. The full ceremonial name of Bangkok is the longest place name in the world (169 characters). Home to over 400 temples and the world's largest outdoor market. Street food capital of the world.",
  },
  {
    id: "9",
    name: "Istanbul, Turkey",
    image: require("../assets/popular-imgs/istanbul.jpg"),
    description:
      "The only city in the world spanning two continents, where East meets West. Home to the Grand Bazaar, one of the world's oldest and largest covered markets. The Hagia Sophia has served as both a church and a mosque. The city has been capital to three major empires: Roman, Byzantine, and Ottoman.",
  },
  {
    id: "10",
    name: "Los Angeles, USA",
    image: require("../assets/popular-imgs/la.jpeg"),
    description:
      "The entertainment capital of the world, known for Hollywood, beaches, and cultural diversity. Home to the world's first movie theater and the film industry. Has the largest urban park in North America (Griffith Park). The Hollywood Sign was originally created as a real estate advertisement.",
  },
];
