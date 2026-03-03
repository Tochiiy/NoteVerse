const OPEN_METEO_WEATHER_URL =
  import.meta.env.VITE_OPEN_METEO_WEATHER_URL ||
  "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_GEOCODE_URL =
  import.meta.env.VITE_OPEN_METEO_GEOCODE_URL ||
  "https://geocoding-api.open-meteo.com/v1/reverse";
const MAP_EMBED_BASE_URL =
  import.meta.env.VITE_MAP_EMBED_BASE_URL || "https://maps.google.com/maps";

export const fetchWeatherByCoords = async (latitude, longitude) => {
  const weatherUrl = `${OPEN_METEO_WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`;
  const response = await fetch(weatherUrl);

  if (!response.ok) {
    throw new Error("Weather request failed");
  }

  return response.json();
};

export const fetchLocationByCoords = async (latitude, longitude) => {
  const locationUrl = `${OPEN_METEO_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;
  const response = await fetch(locationUrl);

  if (!response.ok) {
    throw new Error("Location request failed");
  }

  return response.json();
};

export const buildMapEmbedUrl = (coords) => {
  if (!coords) {
    return "";
  }

  return `${MAP_EMBED_BASE_URL}?q=${coords.latitude},${coords.longitude}&z=12&output=embed`;
};
