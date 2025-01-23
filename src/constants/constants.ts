import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

// Define the type for a destination object
interface Destination {
  id: string;
  name: string;
  image: string;
}

export const usePopularDestinations = () => {
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>(
    []
  );

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log("Fetching popular destinations...");

        // Check if data exists in AsyncStorage
        const storedDestinations = await AsyncStorage.getItem(
          "popularDestinations"
        );
        if (storedDestinations) {
          console.log(
            "Loaded destinations from AsyncStorage:",
            storedDestinations
          );
          setPopularDestinations(JSON.parse(storedDestinations));
          return;
        }

        // Define the destinations to search for
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
        console.log("Destinations to fetch:", destinations);

        // Fetch image for each destination
        const fetchImageForDestination = async (
          destination: string
        ): Promise<Destination> => {
          try {
            console.log(`Fetching image for destination: ${destination}`);
            const response = await fetch(
              `${PEXELS_API_URL}?query=${destination}`,
              {
                headers: {
                  Authorization: PEXELS_API_KEY || "",
                },
              }
            );
            const data = await response.json();
            console.log(`Response for ${destination}:`, data);

            const imageUrl = data.photos[0]?.src?.medium || "";
            console.log(`Image URL for ${destination}: ${imageUrl}`);

            return { id: destination, name: destination, image: imageUrl };
          } catch (error) {
            console.error(`Error fetching image for ${destination}:`, error);
            return { id: destination, name: destination, image: "" };
          }
        };

        // Fetch images for all destinations
        const destinationImages = await Promise.all(
          destinations.map((destination, index) =>
            fetchImageForDestination(destination).then((result) => ({
              ...result,
              id: (index + 1).toString(), // Ensure each destination has a unique ID
            }))
          )
        );
        console.log("Fetched destination images:", destinationImages);

        // Update state and store in AsyncStorage
        setPopularDestinations(destinationImages);
        await AsyncStorage.setItem(
          "popularDestinations",
          JSON.stringify(destinationImages)
        );
        console.log("Saved destinations to AsyncStorage.");
      } catch (error) {
        console.error("Error in fetchImages function:", error);
      }
    };

    fetchImages();
  }, []);

  return popularDestinations;
};
