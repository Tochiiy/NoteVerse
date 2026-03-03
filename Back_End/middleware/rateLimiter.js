import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// General API rate limiter: 50 requests per 15 minutes per IP
const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 s"),
  analytics: true,
  prefix: "ratelimit:api",
});

// Middleware for API rate limiting
export const apiLimiter = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  try {
    const { success, limit, remaining, reset } = await apiRateLimiter.limit(ip);
    res.set("X-RateLimit-Limit", limit.toString());
    res.set("X-RateLimit-Remaining", remaining.toString());
    res.set("X-RateLimit-Reset", reset.toString());
    if (!success) {
      return res.status(429).json({
        error: "Too many requests, please try again later.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      });
    }
    next();
  } catch (err) {
    console.error("Rate limit check failed:", err.message);
    next();
  }
};
