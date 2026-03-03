export const WEATHER_LABELS = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Heavy rain showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunder + hail",
  99: "Severe thunder + hail",
};

const RAIN_CODES = [
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
];

const CLOUDY_CODES = [1, 2, 3, 45, 48, 71, 73, 75, 77, 85, 86];

export const getModeFromWeather = (weatherCode, isDay) => {
  if (RAIN_CODES.includes(weatherCode)) {
    return "rain";
  }

  if (CLOUDY_CODES.includes(weatherCode)) {
    return "aurora";
  }

  return isDay ? "sun" : "meteor";
};

export const getFallbackModeFromLocalTime = () => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "sun" : "meteor";
};
