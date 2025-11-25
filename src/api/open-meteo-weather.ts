export async function getOpenMeteoWeather(lat: number, lon: number) {
  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,pressure_msl` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant` +
    `&forecast_days=16` +
    `&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Open-Meteo fetch failed");

    return await res.json();
  } catch (error) {
    console.error("Open-Meteo error:", error);
    return null;
  }
}
