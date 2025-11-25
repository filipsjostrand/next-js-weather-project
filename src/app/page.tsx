"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCoordinates, type Coordinates } from "../api/location-to-coordinates-call";
import { getOpenMeteoWeather } from "../api/open-meteo-weather";
import { windDegreesToDirection } from "../api/utils/wind-direction";
import { formatDateWithWeekday } from "../api/utils/format-date";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");

  const [openMeteoData, setOpenMeteoData] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetCoordinatesAndWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    // 1. Get coordinates
    const coords: Coordinates | null = await getCoordinates(city);

    if (!coords) {
      setError("City not found.");
      setLatitude("");
      setLongitude("");
      setLoading(false);
      return;
    }

    setLatitude(coords.latitude);
    setLongitude(coords.longitude);

    // 2. Fetch weather from SMHI + Open Meteo
    const om = await getOpenMeteoWeather(coords.latitude, coords.longitude);

    setOpenMeteoData(om);

    setLoading(false);
  };

function formatHourTimeWithLineBreak(time: string) {
  const [datePart, timePart] = time.split("T");
  return (
    <>
      {datePart} <br /> kl. {timePart}
    </>
  );
}

  return (
    <div className="flex flex-col gap-4 p-4">
          <h1 className="text-[24px] font-bold">Väderprognos-applikation</h1>
        <label className="text-sm">Väder (plats):</label>

        <Textarea
          className="w-72 h-8 pt-2 resize-none"
          rows={1}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ange plats/stad..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {        // Get weather data after pressing the "Enter"-key
              e.preventDefault();
              handleGetCoordinatesAndWeather();
            }
          }}
        />

        <Button
          className="w-72 h-8 pt-2 resize-none"
          onClick={handleGetCoordinatesAndWeather}
          disabled={loading}
        >
          {loading ? "Laddar..." : "Hämta Väderdata"}
        </Button>

        {error && <p className="text-red-500">{error}</p>}

        {/* Coordinates */}
        <div className="flex gap-4 mt-2">
          <div>
            <p className="text-sm">Latitud</p>
            <Input value={latitude} readOnly className="w-24 text-center" />
          </div>
          <div>
            <p className="text-sm">Longitud</p>
            <Input value={longitude} readOnly className="w-24 text-center" />
          </div>
        </div>

        {/* Weather Output */}
        {/* <div className="mt-6">
          <h2 className="font-bold mt-4">Open-Meteo Weather (JSON):</h2>
          <pre className="bg-gray-100 p-2 text-xs max-h-60 overflow-y-auto">
            {openMeteoData ? JSON.stringify(openMeteoData, null, 2) : "No Open-Meteo data yet."}
          </pre>
        </div> */}


  {/* WEATHER RESULT UI */}
  <div className="mt-8">

    {/* Daily Forecast (16 days) */}
    <h2 className="text-xl font-bold mb-2">16-Dagars-prognos</h2>
    {openMeteoData?.daily ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {openMeteoData.daily.time.map((day: string, i: number) => (
          <div key={i} className="p-3 border rounded-md bg-gray-50 shadow-sm">
            <p className="font-semibold">{formatDateWithWeekday(day)}</p>

            <p>🌡 Min: {openMeteoData.daily.temperature_2m_min[i]}°C</p>
            <p>🌡 Max: {openMeteoData.daily.temperature_2m_max[i]}°C</p>

            <p>💧 Nederbörd (risk): {openMeteoData.daily.precipitation_probability_max[i]}%</p>

            <p>💨 Vindbyar (max): {openMeteoData.daily.wind_speed_10m_max[i]} m/s</p>
            <p>🧭 Vindriktning: {windDegreesToDirection(openMeteoData.daily.wind_direction_10m_dominant[i])}</p>

          </div>
        ))}

      </div>
    ) : (
      <p>Ingen plats vald.</p>
    )}

    {/* Hourly Forecast (next 24 hours) */}
    <h2 className="text-xl font-bold mt-10 mb-2">I dag</h2>

    {openMeteoData?.hourly ? (
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto p-2 border rounded-md bg-gray-50 shadow-inner">

    {openMeteoData.hourly.time.slice(0, 24).map((time: string, i: number) => (
      <div key={i} className="flex justify-between border-b pb-1 pt-1">
        <div className="w-32 text-center">{formatHourTimeWithLineBreak(time)}</div>

            <div className="flex-1 flex justify-between px-2">
              <span>🌡 {openMeteoData.hourly.temperature_2m[i]}°C</span>
              <span>💨 {openMeteoData.hourly.wind_speed_10m[i]} m/s (max)</span>
              <span>🧭 {windDegreesToDirection(openMeteoData.hourly.wind_direction_10m[i])}</span>
              <span>⚡ {openMeteoData.hourly.pressure_msl[i]} hPa</span>
              <span>💧 {openMeteoData.hourly.precipitation_probability[i]}%</span>
            </div>
          </div>
        ))}

      </div>
    ) : (
      <p>Ingen plats vald.</p>
    )}

  </div>
</div>
  );
}
