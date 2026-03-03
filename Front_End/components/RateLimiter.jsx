import { useEffect, useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";

// Reusable warning banner shown when a user hits request limits.
function RateLimiter({
  title = "Rate limit reached",
  message = "Too many requests. Please wait and try again.",
  retryAfter,
}) {
  const totalWaitSeconds = useMemo(() => {
    if (typeof retryAfter !== "number") return 0;
    return Math.max(0, Math.ceil(retryAfter));
  }, [retryAfter]);

  const [secondsLeft, setSecondsLeft] = useState(totalWaitSeconds);

  useEffect(() => {
    setSecondsLeft(totalWaitSeconds);
  }, [totalWaitSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [secondsLeft]);

  const progressPercentage =
    totalWaitSeconds > 0 ? (secondsLeft / totalWaitSeconds) * 100 : 0;

  return (
    <div className="relative isolate overflow-hidden rounded-xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-warning/40 via-warning/15 to-warning/40 blur-xl animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-x-6 -bottom-8 -z-10 h-10 rounded-full bg-base-content/20 blur-xl" />

      <div className="alert alert-warning rounded-xl border border-warning/50 shadow-2xl backdrop-blur-sm">
        <ShieldAlert className="size-5 animate-bounce" />
        <div className="w-full">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm">
            {message}
            {totalWaitSeconds > 0
              ? secondsLeft > 0
                ? ` Retry in ${secondsLeft}s.`
                : " You can try again now."
              : ""}
          </p>

          {totalWaitSeconds > 0 && (
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-warning/30">
              <div
                className="h-full bg-warning transition-[width] duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RateLimiter;
