export const defaultTrips = [
  {
    travelPlan: {
      budget: "5000",
      numberOfDays: 5,
      numberOfNights: 4,
      destination: "Paris, Île-de-France, France",
      destinationDescription:
        "The City of Light beckons with its iconic architecture, world-class museums, and unparalleled culinary scene, offering a perfect blend of history, culture, and romance.",
      imageUrl:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
      flights: {
        airlineName: "Air France",
        flightPrice: "1200",
        airlineUrl: "https://www.airfrance.com",
      },
      hotels: [
        {
          hotelName: "Hôtel du Louvre",
          hotelAddress: "Place André Malraux, 75001 Paris, France",
          price: 350,
          geoCoordinates: {
            latitude: 48.863852,
            longitude: 2.336981,
          },
          rating: 4.5,
          description:
            "Historic 4-star hotel in central Paris, featuring elegant Napoleon III-style architecture, luxury rooms with city views, and a prime location near the Louvre Museum",
          bookingUrl: "https://www.hoteldulouvre.com",
        },
      ],
      itinerary: [
        {
          day: "Day 1: Classic Paris Landmarks",
          places: [
            {
              placeName: "Eiffel Tower",
              placeDetails:
                "World's most iconic iron lattice tower offering breathtaking city views from three observation levels",
              placeExtendedDetails:
                "Completed in 1889 for the World's Fair, the 324-meter tower features two restaurants, multiple viewing platforms, and a newly renovated first floor with glass floor sections",
              geoCoordinates: {
                latitude: 48.858372,
                longitude: 2.294481,
              },
              ticketPrice:
                "26.10 EUR for adults to summit, 16.70 EUR to second floor",
              placeUrl: "https://www.toureiffel.paris/en",
            },
            {
              placeName: "Arc de Triomphe",
              placeDetails:
                "Iconic triumphal arch commissioned by Napoleon, offering panoramic views of the city's historical axis",
              placeExtendedDetails:
                "Standing 50 meters high, this monument honors those who fought for France. The observation deck provides stunning views of the Champs-Élysées and the city's radial street pattern",
              geoCoordinates: {
                latitude: 48.873792,
                longitude: 2.295028,
              },
              ticketPrice: "13 EUR for adults, free for under 18",
              placeUrl: "https://www.paris-arc-de-triomphe.fr/en/",
            },
            {
              placeName: "Seine River Dinner Cruise",
              placeDetails:
                "Evening dinner cruise along the Seine River, passing illuminated landmarks while enjoying French cuisine",
              placeExtendedDetails:
                "3-hour cruise featuring a 3-course gourmet dinner, live music, and views of Paris's monuments beautifully lit at night",
              geoCoordinates: {
                latitude: 48.862725,
                longitude: 2.359619,
              },
              ticketPrice: "89 EUR per person",
              placeUrl: "https://www.ducasse-seine.com/en/",
            },
          ],
        },
        {
          day: "Day 2: Art and Culture",
          places: [
            {
              placeName: "Louvre Museum",
              placeDetails:
                "World's largest art museum, home to thousands of works including the Mona Lisa",
              placeExtendedDetails:
                "Former royal palace housing 380,000 objects across 60,600 square meters of exhibition space. Home to iconic works like the Venus de Milo and Winged Victory",
              geoCoordinates: {
                latitude: 48.860294,
                longitude: 2.338629,
              },
              ticketPrice: "17 EUR for adults, free for under 18",
              placeUrl: "https://www.louvre.fr/en/",
            },
            {
              placeName: "Musée d'Orsay",
              placeDetails:
                "Impressive collection of Impressionist art housed in a former railway station",
              placeExtendedDetails:
                "Features the world's largest collection of Impressionist and Post-Impressionist masterpieces, including works by Monet, Van Gogh, and Renoir",
              geoCoordinates: {
                latitude: 48.859961,
                longitude: 2.326561,
              },
              ticketPrice: "16 EUR for adults, free for EU residents under 26",
              placeUrl: "https://www.musee-orsay.fr/en",
            },
            {
              placeName: "Le Marais Evening Walk",
              placeDetails:
                "Historic district featuring preserved medieval architecture, trendy boutiques, and vibrant nightlife",
              placeExtendedDetails:
                "One of Paris's oldest neighborhoods, featuring Jewish heritage sites, beautiful mansions turned museums, and some of the city's best falafel stands",
              geoCoordinates: {
                latitude: 48.857937,
                longitude: 2.357089,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.google.com/maps/place/Le+Marais",
            },
          ],
        },
        {
          day: "Day 3: Montmartre and Sacré-Cœur",
          places: [
            {
              placeName: "Sacré-Cœur Basilica",
              placeDetails:
                "Stunning white basilica offering panoramic views of Paris from the highest point in the city",
              placeExtendedDetails:
                "Built between 1875 and 1914, this Roman Catholic church features Byzantine architecture and one of the largest mosaics in the world. The viewing platform provides spectacular 360-degree views of Paris",
              geoCoordinates: {
                latitude: 48.886705,
                longitude: 2.343126,
              },
              ticketPrice: "Free entry, 6 EUR for dome access",
              placeUrl: "http://www.sacre-coeur-montmartre.com/english/",
            },
            {
              placeName: "Place du Tertre",
              placeDetails:
                "Historic square in Montmartre famous for its artists and outdoor cafes",
              placeExtendedDetails:
                "Since the early 20th century, this charming square has been home to numerous artists who set up their easels daily to paint portraits and sell their artwork",
              geoCoordinates: {
                latitude: 48.886463,
                longitude: 2.340388,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.google.com/maps/place/Place+du+Tertre",
            },
            {
              placeName: "Moulin Rouge",
              placeDetails:
                "World-famous cabaret venue featuring the traditional French cancan since 1889",
              placeExtendedDetails:
                "The birthplace of the modern form of the cancan dance. Evening shows include dinner options and spectacular performances in this historic venue",
              geoCoordinates: {
                latitude: 48.88416,
                longitude: 2.332322,
              },
              ticketPrice: "87-185 EUR depending on show and dinner options",
              placeUrl: "https://www.moulinrouge.fr/en/",
            },
          ],
        },
        {
          day: "Day 4: Palace of Versailles",
          places: [
            {
              placeName: "Palace of Versailles",
              placeDetails:
                "Opulent royal château and gardens, former home of French kings including Louis XIV",
              placeExtendedDetails:
                "This UNESCO World Heritage site spans 721,182 square feet and features 700 rooms, including the famous Hall of Mirrors. The palace gardens cover nearly 2,000 acres with fountains and sculptures",
              geoCoordinates: {
                latitude: 48.804722,
                longitude: 2.120556,
              },
              ticketPrice: "18 EUR for palace, 20 EUR for palace and gardens",
              placeUrl: "https://www.chateauversailles.fr/en/",
            },
            {
              placeName: "Gardens of Versailles",
              placeDetails:
                "Immaculately manicured gardens featuring fountains, sculptures, and the Grand Canal",
              placeExtendedDetails:
                "Designed by André Le Nôtre, these formal French gardens took 40 years to complete and feature 50 fountains, 620 water jets, and over 200,000 trees",
              geoCoordinates: {
                latitude: 48.804588,
                longitude: 2.12381,
              },
              ticketPrice: "9.50 EUR for gardens only, free in winter",
              placeUrl:
                "https://www.chateauversailles.fr/en/discover/estate/gardens",
            },
            {
              placeName: "Grand Trianon",
              placeDetails:
                "Private palace built for Louis XIV and his mistress, featuring pink marble colonnades",
              placeExtendedDetails:
                "This elegant château served as a private retreat for French kings and later as a guesthouse for visiting dignitaries. Its gardens feature unique French-style flowerbeds",
              geoCoordinates: {
                latitude: 48.814722,
                longitude: 2.103889,
              },
              ticketPrice: "12 EUR, included in some palace passes",
              placeUrl:
                "https://www.chateauversailles.fr/discover/estate/trianon-palaces",
            },
          ],
        },
        {
          day: "Day 5: Modern Paris and Shopping",
          places: [
            {
              placeName: "Centre Pompidou",
              placeDetails:
                "Modern and contemporary art museum in an iconic inside-out building",
              placeExtendedDetails:
                "Europe's largest modern art museum houses over 100,000 works and features its structural system on its exterior. The top floor offers panoramic views of Paris",
              geoCoordinates: {
                latitude: 48.860642,
                longitude: 2.352245,
              },
              ticketPrice: "14 EUR for adults, free for under 18",
              placeUrl: "https://www.centrepompidou.fr/en/",
            },
            {
              placeName: "Galeries Lafayette",
              placeDetails:
                "Historic department store featuring luxury brands under an Art Nouveau glass dome",
              placeExtendedDetails:
                "Founded in 1912, this iconic shopping destination features a stunning Belle Époque architecture and a rooftop terrace offering views of Paris",
              geoCoordinates: {
                latitude: 48.873792,
                longitude: 2.332592,
              },
              ticketPrice: "Free entry",
              placeUrl: "https://www.galerieslafayette.com/",
            },
            {
              placeName: "Le Marais Night Food Tour",
              placeDetails:
                "Evening food tour through one of Paris's most historic and trendy neighborhoods",
              placeExtendedDetails:
                "Sample traditional French cuisine and modern fusion dishes while exploring the historic Jewish quarter and trendy boutiques",
              geoCoordinates: {
                latitude: 48.857937,
                longitude: 2.357089,
              },
              ticketPrice: "95 EUR per person",
              placeUrl: "https://www.google.com/maps/place/Le+Marais",
            },
          ],
        },
      ],
    },
  },
  {
    travelPlan: {
      budget: "4800",
      numberOfDays: 5,
      numberOfNights: 4,
      destination: "Rome, Lazio, Italy",
      destinationDescription:
        "The Eternal City captivates visitors with its ancient ruins, Renaissance masterpieces, and vibrant street life, offering an unparalleled journey through history.",
      imageUrl:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2096&auto=format&fit=crop",
      flights: {
        airlineName: "Alitalia",
        flightPrice: "1100",
        airlineUrl: "https://www.alitalia.com",
      },
      hotels: [
        {
          hotelName: "Hotel de la Ville",
          hotelAddress: "Via Sistina 69, 00187 Rome, Italy",
          price: 320,
          geoCoordinates: {
            latitude: 41.905807,
            longitude: 12.485426,
          },
          rating: 4.5,
          description:
            "Elegant 4-star hotel at the top of the Spanish Steps, featuring recently renovated rooms, a rooftop bar with panoramic views, and a luxury spa",
          bookingUrl: "https://www.hoteldelaville.com",
        },
      ],
      itinerary: [
        {
          day: "Day 1: Ancient Rome",
          places: [
            {
              placeName: "Colosseum",
              placeDetails:
                "The world's largest ancient amphitheater and Rome's most iconic landmark",
              placeExtendedDetails:
                "Built in 70-80 AD, this 50,000-seat arena hosted gladiatorial contests and public spectacles. Recent renovations have opened previously restricted underground areas to visitors",
              geoCoordinates: {
                latitude: 41.890251,
                longitude: 12.492373,
              },
              ticketPrice:
                "16 EUR for adults, includes Roman Forum and Palatine Hill",
              placeUrl: "https://www.parcocolosseo.it/en/",
            },
            {
              placeName: "Roman Forum",
              placeDetails:
                "Ancient city center with temples, government buildings and public spaces",
              placeExtendedDetails:
                "The heart of ancient Rome for over 1,000 years, featuring ruins of important government buildings, temples, and public spaces where Roman civilization flourished",
              geoCoordinates: {
                latitude: 41.892467,
                longitude: 12.485364,
              },
              ticketPrice: "Included with Colosseum ticket",
              placeUrl: "https://www.parcocolosseo.it/en/area/the-roman-forum/",
            },
            {
              placeName: "Palatine Hill",
              placeDetails: "Birthplace of Rome and former home to emperors",
              placeExtendedDetails:
                "The most famous of Rome's seven hills, featuring ruins of imperial palaces and offering panoramic views of the Forum and Circus Maximus",
              geoCoordinates: {
                latitude: 41.889283,
                longitude: 12.487804,
              },
              ticketPrice: "Included with Colosseum ticket",
              placeUrl: "https://www.parcocolosseo.it/en/area/the-palatine/",
            },
          ],
        },
        {
          day: "Day 2: Vatican City",
          places: [
            {
              placeName: "Vatican Museums",
              placeDetails:
                "Vast museum complex housing art collections of the Catholic Church",
              placeExtendedDetails:
                "Over 70,000 works of art collected by popes throughout the centuries, including the famous Sistine Chapel with Michelangelo's frescoes",
              geoCoordinates: {
                latitude: 41.906159,
                longitude: 12.453389,
              },
              ticketPrice: "17 EUR for adults, reduced rates available",
              placeUrl: "https://www.museivaticani.va/en/home.html",
            },
            {
              placeName: "St. Peter's Basilica",
              placeDetails:
                "The largest church in the world and center of the Catholic faith",
              placeExtendedDetails:
                "Renaissance masterpiece designed by Bramante, Michelangelo, and Bernini, featuring the iconic dome and Michelangelo's Pietà",
              geoCoordinates: {
                latitude: 41.902169,
                longitude: 12.453959,
              },
              ticketPrice: "Free entry, 8 EUR for dome access",
              placeUrl:
                "http://www.vatican.va/various/basiliche/san_pietro/index_en.htm",
            },
            {
              placeName: "Castel Sant'Angelo",
              placeDetails: "Former papal fortress and prison, now a museum",
              placeExtendedDetails:
                "Built as Emperor Hadrian's mausoleum, later converted to a papal fortress with secret passage to Vatican. Offers panoramic views of Rome",
              geoCoordinates: {
                latitude: 41.903111,
                longitude: 12.46637,
              },
              ticketPrice: "15 EUR for adults",
              placeUrl: "http://castelsantangelo.beniculturali.it/",
            },
          ],
        },
        {
          day: "Day 3: Renaissance Rome",
          places: [
            {
              placeName: "Pantheon",
              placeDetails:
                "Best-preserved monument of ancient Rome, now a church",
              placeExtendedDetails:
                "Built in 126 AD, features the world's largest unreinforced concrete dome and houses tombs of Italian kings and Raphael",
              geoCoordinates: {
                latitude: 41.898614,
                longitude: 12.476869,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.pantheonroma.com/en/",
            },
            {
              placeName: "Trevi Fountain",
              placeDetails: "Rome's largest and most famous Baroque fountain",
              placeExtendedDetails:
                "Completed in 1762, this 26.3-meter-high fountain is famous for the tradition of throwing coins over your shoulder to ensure return to Rome",
              geoCoordinates: {
                latitude: 41.900932,
                longitude: 12.483313,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.turismoroma.it/en/places/trevi-fountain",
            },
            {
              placeName: "Spanish Steps",
              placeDetails:
                "Monumental staircase connecting Piazza di Spagna with Trinità dei Monti church",
              placeExtendedDetails:
                "Built between 1723-1725, these 174 steps are a popular gathering place and offer beautiful views of the city",
              geoCoordinates: {
                latitude: 41.90599,
                longitude: 12.482727,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.turismoroma.it/en/places/spanish-steps",
            },
          ],
        },
        {
          day: "Day 4: Art and Culture",
          places: [
            {
              placeName: "Galleria Borghese",
              placeDetails:
                "Magnificent art collection in a 17th-century villa",
              placeExtendedDetails:
                "Houses masterpieces by Bernini, Caravaggio, Titian, and Raphael in a stunning villa surrounded by beautiful gardens",
              geoCoordinates: {
                latitude: 41.914158,
                longitude: 12.492346,
              },
              ticketPrice: "13 EUR, reservation required",
              placeUrl: "https://galleriaborghese.beniculturali.it/en/",
            },
            {
              placeName: "Villa Borghese Gardens",
              placeDetails:
                "Rome's most famous park, perfect for afternoon relaxation",
              placeExtendedDetails:
                "Sprawling gardens featuring museums, theaters, a zoo, boat rentals on a small lake, and beautiful walking paths",
              geoCoordinates: {
                latitude: 41.912572,
                longitude: 12.485352,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.turismoroma.it/en/places/villa-borghese",
            },
            {
              placeName: "Trastevere",
              placeDetails:
                "Charming medieval neighborhood known for restaurants and nightlife",
              placeExtendedDetails:
                "Picturesque district with narrow cobblestone streets, traditional restaurants, and beautiful churches including Santa Maria in Trastevere",
              geoCoordinates: {
                latitude: 41.88934,
                longitude: 12.469019,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.turismoroma.it/en/places/trastevere",
            },
          ],
        },
        {
          day: "Day 5: Ancient Appian Way",
          places: [
            {
              placeName: "Catacombs of San Callisto",
              placeDetails:
                "Ancient underground burial tunnels of early Christians",
              placeExtendedDetails:
                "One of Rome's largest and most important catacombs, containing dozens of martyrs, 16 popes, and hundreds of Christians",
              geoCoordinates: {
                latitude: 41.857012,
                longitude: 12.513642,
              },
              ticketPrice: "8 EUR for guided tour",
              placeUrl: "http://www.catacombe.roma.it/en/index.php",
            },
            {
              placeName: "Appian Way",
              placeDetails:
                "Ancient Roman road connecting Rome to southern Italy",
              placeExtendedDetails:
                "Built in 312 BC, this historic road features ancient monuments, tombs, and Christian catacombs along its route",
              geoCoordinates: {
                latitude: 41.854774,
                longitude: 12.522614,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.parcoappiaantica.it/en/",
            },
            {
              placeName: "Baths of Caracalla",
              placeDetails: "Massive ancient Roman public baths",
              placeExtendedDetails:
                "Built between 212-216 AD, these monumental baths could accommodate up to 1,600 bathers and featured gyms, libraries, and gardens",
              geoCoordinates: {
                latitude: 41.879167,
                longitude: 12.492223,
              },
              ticketPrice: "8 EUR",
              placeUrl: "https://www.coopculture.it/en/heritage.cfm?id=6",
            },
          ],
        },
      ],
    },
  },
  {
    travelPlan: {
      budget: "5200",
      numberOfDays: 5,
      numberOfNights: 4,
      destination: "Tokyo, Kanto Region, Japan",
      destinationDescription:
        "A dazzling metropolis where ancient traditions meet cutting-edge technology, offering visitors an unforgettable blend of culture, cuisine, and contemporary life.",
      imageUrl:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1971&auto=format&fit=crop",
      flights: {
        airlineName: "Japan Airlines",
        flightPrice: "1400",
        airlineUrl: "https://www.jal.com",
      },
      hotels: [
        {
          hotelName: "Park Hotel Tokyo",
          hotelAddress:
            "Shiodome Media Tower, 1-7-1 Higashi Shimbashi, Minato-ku, Tokyo 105-7227, Japan",
          price: 280,
          geoCoordinates: {
            latitude: 35.662109,
            longitude: 139.760876,
          },
          rating: 4.4,
          description:
            "Contemporary 4-star hotel occupying the upper floors of a skyscraper, featuring artist-designed rooms, panoramic views of Tokyo Tower, and direct access to multiple transit lines",
          bookingUrl: "https://www.parkhoteltokyo.com",
        },
      ],
      itinerary: [
        {
          day: "Day 1: Modern Tokyo",
          places: [
            {
              placeName: "Shibuya Crossing",
              placeDetails:
                "The world's busiest pedestrian crossing, surrounded by massive video screens and neon signs",
              placeExtendedDetails:
                "This famous scramble crossing handles over 2.4 million people daily. The Starbucks overlooking the crossing offers one of the best viewing spots",
              geoCoordinates: {
                latitude: 35.659494,
                longitude: 139.700292,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.google.com/maps/place/Shibuya+Crossing",
            },
            {
              placeName: "Tokyo Skytree",
              placeDetails:
                "World's tallest tower offering spectacular views of Tokyo from two observation decks",
              placeExtendedDetails:
                "Standing 634 meters tall, this broadcasting tower features glass-floor sections, high-speed elevators, and restaurants with panoramic views",
              geoCoordinates: {
                latitude: 35.710063,
                longitude: 139.8107,
              },
              ticketPrice:
                "2060 JPY for first observatory, 3200 JPY for both decks",
              placeUrl: "http://www.tokyo-skytree.jp/en/",
            },
            {
              placeName: "Akihabara Electric Town",
              placeDetails:
                "Famous electronics and anime district with colorful shops and gaming arcades",
              placeExtendedDetails:
                "A paradise for tech enthusiasts and pop culture fans, featuring multi-story electronics stores, anime shops, and maid cafes",
              geoCoordinates: {
                latitude: 35.69974,
                longitude: 139.771389,
              },
              ticketPrice: "Free to explore",
              placeUrl:
                "https://www.gotokyo.org/en/destinations/eastern-tokyo/akihabara/",
            },
          ],
        },
        {
          day: "Day 2: Traditional Tokyo",
          places: [
            {
              placeName: "Senso-ji Temple",
              placeDetails:
                "Tokyo's oldest and most significant Buddhist temple",
              placeExtendedDetails:
                "Founded in 645 AD, featuring the iconic Kaminarimon Gate, traditional shopping street Nakamise, and five-story pagoda",
              geoCoordinates: {
                latitude: 35.714765,
                longitude: 139.796655,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.senso-ji.jp/english/",
            },
            {
              placeName: "Meiji Shrine",
              placeDetails:
                "Serene Shinto shrine dedicated to Emperor Meiji and Empress Shoken",
              placeExtendedDetails:
                "Set in a peaceful forest of 120,000 trees, featuring massive torii gates, traditional gardens, and sacred rituals",
              geoCoordinates: {
                latitude: 35.676466,
                longitude: 139.699185,
              },
              ticketPrice: "Free",
              placeUrl: "https://www.meijijingu.or.jp/en/",
            },
            {
              placeName: "Harajuku",
              placeDetails:
                "Youth culture and fashion district famous for trendy shops and unique street style",
              placeExtendedDetails:
                "Center of Japanese youth culture and fashion, featuring Takeshita Street's colorful boutiques and trendy cafes",
              geoCoordinates: {
                latitude: 35.671678,
                longitude: 139.70355,
              },
              ticketPrice: "Free",
              placeUrl:
                "https://www.gotokyo.org/en/destinations/central-tokyo/harajuku/",
            },
          ],
        },
        {
          day: "Day 3: Tokyo Bay Area",
          places: [
            {
              placeName: "Tsukiji Outer Market",
              placeDetails:
                "Historic market district famous for fresh seafood and sushi restaurants",
              placeExtendedDetails:
                "Over 400 shops and restaurants offering fresh seafood, traditional foods, and cooking supplies",
              geoCoordinates: {
                latitude: 35.665498,
                longitude: 139.770538,
              },
              ticketPrice: "Free to explore, food prices vary",
              placeUrl: "http://www.tsukiji.or.jp/english/",
            },
            {
              placeName: "TeamLab Planets",
              placeDetails:
                "Immersive digital art museum where visitors wade through water installations",
              placeExtendedDetails:
                "Interactive digital art space featuring large-scale installations that respond to visitor movement",
              geoCoordinates: {
                latitude: 35.645783,
                longitude: 139.794317,
              },
              ticketPrice: "3200 JPY for adults",
              placeUrl: "https://planets.teamlab.art/tokyo/",
            },
            {
              placeName: "Odaiba",
              placeDetails:
                "Futuristic artificial island with shopping, entertainment, and a replica Statue of Liberty",
              placeExtendedDetails:
                "Features the Gundam statue, Fuji TV Building, Rainbow Bridge views, and numerous shopping malls",
              geoCoordinates: {
                latitude: 35.624722,
                longitude: 139.775833,
              },
              ticketPrice: "Free to explore",
              placeUrl:
                "https://www.gotokyo.org/en/destinations/southern-tokyo/odaiba/",
            },
          ],
        },
        {
          day: "Day 4: Parks and Gardens",
          places: [
            {
              placeName: "Shinjuku Gyoen",
              placeDetails:
                "Sprawling national garden featuring Japanese, English, and French landscapes",
              placeExtendedDetails:
                "58.3 hectares of beautifully maintained gardens with tea houses, greenhouses, and over 20,000 trees",
              geoCoordinates: {
                latitude: 35.685175,
                longitude: 139.710052,
              },
              ticketPrice: "500 JPY for adults",
              placeUrl: "https://www.env.go.jp/garden/shinjukugyoen/english/",
            },
            {
              placeName: "Ueno Park",
              placeDetails: "Large public park housing major museums and zoo",
              placeExtendedDetails:
                "Famous for cherry blossoms, contains Tokyo National Museum, National Museum of Nature and Science, and Ueno Zoo",
              geoCoordinates: {
                latitude: 35.71542,
                longitude: 139.773821,
              },
              ticketPrice: "Free (museum entry fees separate)",
              placeUrl:
                "https://www.gotokyo.org/en/destinations/eastern-tokyo/ueno/",
            },
            {
              placeName: "Tokyo National Museum",
              placeDetails: "Japan's oldest and largest art museum",
              placeExtendedDetails:
                "Houses the world's largest collection of Japanese art, including samurai swords, kimonos, and ancient pottery",
              geoCoordinates: {
                latitude: 35.718971,
                longitude: 139.776125,
              },
              ticketPrice: "1000 JPY for adults",
              placeUrl:
                "https://www.tnm.jp/modules/r_free_page/index.php?id=113",
            },
          ],
        },
        {
          day: "Day 5: Tokyo Nightlife",
          places: [
            {
              placeName: "Shinjuku Golden Gai",
              placeDetails:
                "Network of narrow alleyways housing over 200 tiny bars and restaurants",
              placeExtendedDetails:
                "Historic district preserving the atmosphere of old Tokyo, featuring unique themed bars and local cuisine",
              geoCoordinates: {
                latitude: 35.694167,
                longitude: 139.704722,
              },
              ticketPrice: "Free to explore, drinks average 700-1000 JPY",
              placeUrl: "https://www.gotokyo.org/en/spot/482/index.html",
            },
            {
              placeName: "Tokyo Tower",
              placeDetails:
                "Iconic orange and white tower inspired by the Eiffel Tower",
              placeExtendedDetails:
                "333-meter tall communications and observation tower, illuminated at night with special lighting displays",
              geoCoordinates: {
                latitude: 35.658581,
                longitude: 139.745433,
              },
              ticketPrice: "1200 JPY for main deck, 3000 JPY for both decks",
              placeUrl: "https://www.tokyotower.co.jp/en/",
            },
            {
              placeName: "Roppongi Hills Observation Deck",
              placeDetails:
                "Modern observation deck offering night views of Tokyo",
              placeExtendedDetails:
                "Located on the 52nd floor of Mori Tower, featuring an art museum, outdoor sky deck, and 360-degree city views",
              geoCoordinates: {
                latitude: 35.660903,
                longitude: 139.729424,
              },
              ticketPrice: "2000 JPY for adults",
              placeUrl: "https://www.roppongihills.com/en/observatory/",
            },
          ],
        },
      ],
    },
  },
];
