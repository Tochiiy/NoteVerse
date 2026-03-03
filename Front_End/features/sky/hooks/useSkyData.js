import { useEffect, useMemo, useState } from "react";
import {
  buildMapEmbedUrl,
  fetchLocationByCoords,
  fetchWeatherByCoords,
} from "../api/skyApi";
import {
  getFallbackModeFromLocalTime,
  getModeFromWeather,
  WEATHER_LABELS,
} from "../constants/weather";

const getLocalTimeLabel = (timezone) => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
  }
};

const getLocationLabel = (locationData) => {
  const place = locationData?.results?.[0];
  const cityName = place?.city || place?.name || place?.admin1;
  const countryName = place?.country;

  if (cityName && countryName) {
    return `${cityName}, ${countryName}`;
  }

  if (countryName) {
    return countryName;
  }

  return "Your location";
};

export const useSkyData = () => {
  const [mode, setMode] = useState("sun");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [weatherText, setWeatherText] = useState("Loading weather...");
  const [locationText, setLocationText] = useState("Your location");
  const [temperature, setTemperature] = useState(undefined);
  const [coords, setCoords] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    const setFallback = () => {
      setMode(getFallbackModeFromLocalTime());
      setWeatherText("Local sky");
      setLocationText("Your location");
      setTemperature(undefined);
    };

    const detectSky = () => {
      if (!navigator.geolocation) {
        setFallback();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async ({ coords: userCoords }) => {
          try {
            const weatherData = await fetchWeatherByCoords(
              userCoords.latitude,
              userCoords.longitude,
            );

            if (!mounted) {
              return;
            }

            const weatherCode = weatherData?.current?.weather_code;
            const isDay = weatherData?.current?.is_day === 1;
            const detectedTimezone = weatherData?.timezone || timezone;
            const currentTemperature = weatherData?.current?.temperature_2m;

            setMode(getModeFromWeather(weatherCode, isDay));
            setTimezone(detectedTimezone);
            setWeatherText(WEATHER_LABELS[weatherCode] || "Current weather");
            setTemperature(
              typeof currentTemperature === "number"
                ? currentTemperature
                : undefined,
            );
            setCoords({
              latitude: userCoords.latitude,
              longitude: userCoords.longitude,
            });

            fetchLocationByCoords(userCoords.latitude, userCoords.longitude)
              .then((locationData) => {
                if (!mounted) {
                  return;
                }

                setLocationText(getLocationLabel(locationData));
              })
              .catch(() => {
                setLocationText("Your location");
              });
          } catch {
            setFallback();
          }
        },
        () => {
          setFallback();
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    };

    detectSky();
    const weatherIntervalId = window.setInterval(detectSky, 1000 * 60 * 10);

    return () => {
      mounted = false;
      window.clearInterval(weatherIntervalId);
    };
  }, [timezone]);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const clockIntervalId = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000 * 60);

    return () => window.clearInterval(clockIntervalId);
  }, []);

  const timeLabel = useMemo(
    () => getLocalTimeLabel(timezone),
    [timezone, tick],
  );

  const mapUrl = useMemo(() => buildMapEmbedUrl(coords), [coords]);

  return {
    mode,
    weatherText,
    locationText,
    temperature,
    timeLabel,
    mapUrl,
  };
};
