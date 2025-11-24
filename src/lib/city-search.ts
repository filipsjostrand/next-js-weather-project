export type CitySuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function searchCity(query: string): Promise<CitySuggestion[]> {
  if (!query) return [];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5`,
    {
      headers: {
        "User-Agent": "next-weather-app", // required by Nominatim
      },
    }
  );

  if (!res.ok) return [];
  return res.json();
}
