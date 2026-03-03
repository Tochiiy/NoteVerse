import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  CloudSun,
  MapPin,
  ThermometerSun,
} from "lucide-react";
import { useSkyData } from "../features/sky/hooks/useSkyData";

function RainEffect() {
  const { mode, weatherText, locationText, temperature, timeLabel, mapUrl } =
    useSkyData();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const drops = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 1 + Math.random() * 1.4,
        opacity: 0.55 + Math.random() * 0.4,
      })),
    [],
  );

  const isRain = mode === "rain";
  const isSun = mode === "sun";
  const isAurora = mode === "aurora";
  const isMeteor = mode === "meteor";

  return (
    <div className="space-y-3">
      <div className="relative h-24 overflow-hidden rounded-2xl border border-primary/40 shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/35 via-info/25 to-primary/10" />

        {isSun && (
          <>
            <div className="sun-glow" />
            <div className="sun-core" />
            <div className="sun-ring" />
          </>
        )}

        {isAurora && (
          <>
            <div className="aurora aurora-1" />
            <div className="aurora aurora-2" />
          </>
        )}

        {isRain &&
          drops.map((drop) => (
            <span
              key={`rain-${drop.id}`}
              className="rain-drop"
              style={{
                left: `${drop.left}%`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration}s`,
                opacity: drop.opacity,
              }}
            />
          ))}

        {isMeteor &&
          drops.slice(0, 14).map((drop) => (
            <span
              key={`meteor-${drop.id}`}
              className="meteor-drop"
              style={{
                left: `${drop.left}%`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration + 0.6}s`,
                opacity: drop.opacity,
              }}
            />
          ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-base-100/40 to-secondary/20" />
        <div className="pointer-events-none absolute right-3 top-2 rounded-full bg-base-100/70 px-2 py-1 text-[10px] font-semibold tracking-wider text-base-content/70">
          {timeLabel} • {weatherText} • {locationText}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/75 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

        <div className="relative z-10 mb-3 flex items-center justify-between md:hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Live Location Map
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-xs rounded-lg"
            onClick={() => setIsMapOpen((prev) => !prev)}
            aria-label={isMapOpen ? "Hide map" : "Show map"}
          >
            {isMapOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isMapOpen ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-2 space-y-3">
            <div className="rounded-xl border border-base-content/10 bg-base-100/80 p-3 shadow-md">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-base-content/60">
                <MapPin size={14} className="text-primary" />
                Location
              </p>
              <p className="text-sm font-semibold text-base-content">
                {locationText}
              </p>
            </div>

            <div className="rounded-xl border border-base-content/10 bg-base-100/80 p-3 shadow-md">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-base-content/60">
                <Clock3 size={14} className="text-info" />
                Local Time
              </p>
              <p className="text-sm font-semibold text-base-content">
                {timeLabel}
              </p>
            </div>

            <div className="rounded-xl border border-base-content/10 bg-base-100/80 p-3 shadow-md">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-base-content/60">
                <CloudSun size={14} className="text-warning" />
                Weather
              </p>
              <p className="text-sm font-semibold text-base-content">
                {weatherText}
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-base-content/70">
                <ThermometerSun size={14} className="text-error" />
                {typeof temperature === "number" ? `${temperature}°C` : "--"}
              </p>
            </div>
          </div>

          <div
            className={`md:col-span-3 overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/70 shadow-xl transition-all duration-300 ${
              isMapOpen
                ? "max-h-[280px] opacity-100"
                : "max-h-0 border-transparent opacity-0 md:max-h-[280px] md:border-base-content/10 md:opacity-100"
            }`}
          >
            {mapUrl ? (
              <iframe
                title="User location map"
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full"
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-base-content/60">
                Allow location access to display your live map.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RainEffect;
