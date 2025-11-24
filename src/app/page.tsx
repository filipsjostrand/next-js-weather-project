"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCoordinates, type Coordinates } from "../api/location-to-coordinates-call";

export let exportedCoordinates: Coordinates | null = null; // exported variable

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCoordinates = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const coords: Coordinates | null = await getCoordinates(city);
      if (coords) {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        exportedCoordinates = coords; // export to other files if needed
      } else {
        setLatitude("");
        setLongitude("");
        exportedCoordinates = null;
        setError("City not found. Please enter a valid city.");
      }
    } catch (err) {
      setError("Error fetching coordinates.");
      exportedCoordinates = null;
      setLatitude("");
      setLongitude("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* City input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm">Weather Location (City):</label>
        <Textarea
          className="w-72 h-8 pt-2 resize-none"
          rows={1}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <Button className="w-70 h-8 pt-2 resize-none" onClick={handleGetCoordinates} disabled={loading || !city.trim()}>
          {loading ? "Loading..." : "Get Coordinates"}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Latitude + Longitude */}
      <div className="flex gap-4 mt-4">
        <div className="flex flex-col">
          <label className="text-sm">Latitude:</label>
          <Input
            type="number"
            className="w-24 text-center"
            step="any"
            value={latitude}
            readOnly
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">Longitude:</label>
          <Input
            type="number"
            className="w-24 text-center"
            step="any"
            value={longitude}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
