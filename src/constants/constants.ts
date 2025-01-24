// Define the type for a destination object
interface Destination {
  id: string;
  name: string;
  image: any;
}

export const popularDestinations: Destination[] = [
  {
    id: "1",
    name: "New York",
    image: require("../assets/popular-imgs/ny.jpg"),
  },
  {
    id: "2",
    name: "Paris",
    image: require("../assets/popular-imgs/paris.jpg"),
  },
  {
    id: "3",
    name: "Tokyo",
    image: require("../assets/popular-imgs/tokyo.jpeg"),
  },
  {
    id: "4",
    name: "London",
    image: require("../assets/popular-imgs/london.jpg"),
  },
  {
    id: "5",
    name: "Dubai",
    image: require("../assets/popular-imgs/dubai.jpg"),
  },
  {
    id: "6",
    name: "Sydney",
    image: require("../assets/popular-imgs/sydney.jpg"),
  },
  {
    id: "7",
    name: "Rome",
    image: require("../assets/popular-imgs/rome.jpeg"),
  },
  {
    id: "8",
    name: "Bangkok",
    image: require("../assets/popular-imgs/bangkok.jpg"),
  },
  {
    id: "9",
    name: "Istanbul",
    image: require("../assets/popular-imgs/istanbul.jpg"),
  },
  {
    id: "10",
    name: "Los Angeles",
    image: require("../assets/popular-imgs/la.jpeg"),
  },
];
