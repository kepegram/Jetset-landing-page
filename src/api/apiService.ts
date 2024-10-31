import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase.config";

const ITEMS_PER_PAGE = 20;
const USERNAME = "kpegra1";

// Fetch coordinates for a country and city
export const fetchCoordinates = async (country: string, city: string) => {
  const API_KEY = "28c0017aba5f471fa18fe9fdb3cd026e";
  const cacheKey = `${country}-${city}`;
  const cachedData = await AsyncStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    country + ", " + city
  )}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      const coordinates = { latitude: lat, longitude: lng };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(coordinates));
      return coordinates;
    } else {
      console.error("No coordinates found for country:", country);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

// Fetch filtered destinations
export const fetchFilterDestinations = async (
  filter: string,
  setDestinationData: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  currentPage: number,
  reset = false
) => {
  setLoading(true);
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    const cacheKey = `destinations-${user.uid}-${filter}`;
    if (!reset) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setDestinationData(parsedData);
        setLoading(false);
        return;
      }
    }

    const visitedSnapshot = await getDocs(
      collection(FIREBASE_DB, `users/${user.uid}/visited`)
    );
    const bucketlistSnapshot = await getDocs(
      collection(FIREBASE_DB, `users/${user.uid}/bucketlist`)
    );

    const visitedItems = visitedSnapshot.docs.map((doc) => doc.data());
    const bucketlistItems = bucketlistSnapshot.docs.map((doc) => doc.data());

    const response = await fetch(
      `http://api.geonames.org/countryInfoJSON?username=${USERNAME}`
    );
    const data = await response.json();

    if (!data.geonames) {
      throw new Error("Geonames data not found in response");
    }

    const filteredByContinent = data.geonames.filter((item) => {
      if (filter === "All") return true;
      return item.continentName === filter;
    });

    const uniqueCountries = new Set();
    const formattedData = await Promise.all(
      filteredByContinent.map(async (item, index: number) => {
        const isVisited = visitedItems.some(
          (visited) => visited.country === item.countryName
        );
        const isInBucketlist = bucketlistItems.some(
          (bucketlist) => bucketlist.country === item.countryName
        );

        if (
          !isVisited &&
          !isInBucketlist &&
          !uniqueCountries.has(item.countryCode) &&
          item.countryName &&
          item.countryName.trim() !== "" &&
          item.capital &&
          item.capital.trim() !== ""
        ) {
          uniqueCountries.add(item.countryCode);
          const pexelsImage = await fetchPexelsImage(item.countryName);

          return {
            id: `${item.countryCode}-${index}`,
            image: pexelsImage || "https://via.placeholder.com/400",
            country: item.countryName,
            city: item.capital,
            population: item.population || "N/A",
            continent: item.continent || "N/A",
          };
        }
        return null;
      })
    );

    const resolvedData = formattedData.filter((item) => item !== null);
    const shuffledData = resolvedData.sort(() => Math.random() - 0.5);
    const paginatedData = shuffledData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    if (reset) {
      setDestinationData(paginatedData);
    } else {
      setDestinationData((prev) => [...prev, ...paginatedData]);
    }

    await AsyncStorage.setItem(cacheKey, JSON.stringify(paginatedData));
  } catch (error) {
    console.error("Error fetching destination data:", error);
  } finally {
    setLoading(false);
  }
};

// Fetch image from Pexels API
export const fetchPexelsImage = async (countryName: string) => {
  const cacheKey = `pexelsImage-${countryName}`;
  const cachedData = await AsyncStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const PEXELS_API_KEY =
    "VpRUFZAwfA3HA4cwIoYVnHO51Lr36RauMaODMYPSTJpPGbRkmtFLa7pX";
  const url = `https://api.pexels.com/v1/search?query=${countryName}&per_page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.original;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(imageUrl));
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.error("Error fetching image from Pexels: ", error);
    return null;
  }
};
