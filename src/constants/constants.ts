import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

export const usePopularDestinations = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const storedDestinations = await AsyncStorage.getItem("popularDestinations");
      if (storedDestinations) {
        setPopularDestinations(JSON.parse(storedDestinations));
        return;
      }

      const destinations = [
        "New York",
        "Paris",
        "Tokyo",
        "London",
        "Dubai",
        "Sydney",
        "Rome",
        "Bangkok",
        "Istanbul",
        "Los Angeles",
      ];

      const fetchImageForDestination = async (destination) => {
        try {
          const response = await fetch(
            `${PEXELS_API_URL}?query=${destination}`,
            {
              headers: {
                Authorization: PEXELS_API_KEY,
              },
            }
          );
          const data = await response.json();
          const imageUrl = data.photos[0]?.src?.medium || "";
          return { name: destination, image: imageUrl };
        } catch (error) {
          console.error(`Error fetching image for ${destination}:`, error);
          return { name: destination, image: "" };
        }
      };

      const destinationImages = await Promise.all(
        destinations.map((destination, index) =>
          fetchImageForDestination(destination).then((result) => ({
            id: (index + 1).toString(),
            ...result,
          }))
        )
      );

      setPopularDestinations(destinationImages);
      await AsyncStorage.setItem("popularDestinations", JSON.stringify(destinationImages));
    };

    fetchImages();
  }, []);

  return popularDestinations;
};

export const budgetOptions = [
  { label: "Cheap", value: "Cheap" },
  { label: "Modest", value: "Modest" },
  { label: "Lavish", value: "Lavish" },
];

export const travelerTypes = [
  { label: "Thrill-seeking", value: "Thrill-seeking" },
  { label: "Foodie", value: "Foodie" },
  { label: "Cultural", value: "Cultural" },
  { label: "Relaxed", value: "Relaxed" },
];

export const accommodationTypes = [
  { label: "Hotel", value: "Hotel" },
  { label: "Hostel", value: "Hostel" },
  { label: "Airbnb", value: "Airbnb" },
  { label: "Camping", value: "Camping" },
];

export const activityLevels = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const preferredClimates = [
  { label: "Warm", value: "Warm" },
  { label: "Mild", value: "Mild" },
  { label: "Cold", value: "Cold" },
];
