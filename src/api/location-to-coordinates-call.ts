// nominatim.openstreetmap.org
// weather-call.ts

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/**
 * Convert a city name to latitude and longitude using OpenStreetMap Nominatim API
 * @param city - The city name to geocode
 * @returns Coordinates { latitude, longitude } or null if not found
 */
export async function getCoordinates(city: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`,
      {
        headers: {
          "User-Agent": "NextJsWeatherApp/1.0 (your-email@example.com)", // Nominatim requires a user-agent
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch coordinates:", response.statusText);
      console.log("city = " + city);

      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn(`No coordinates found for city: ${city}`);
      return null;
    }

    const { lat, lon } = data[0];

    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),

    };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

// // Example usage
// async function test() {
//   const coords = await getCoordinates("Stockholm");
//   console.log(coords); // { latitude: 59.3293, longitude: 18.0686 }
// }

// test();
