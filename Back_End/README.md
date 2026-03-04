# NoteVerse Backend

Backend service for NoteVerse.

## Folder Structure

```text
Back_End/
  config/
  middleware/
  models/
  src/
    controllers/
    routes/
    server.js
  server.js
  |


  MONGO_URI=<your MongoDB connection string>
PORT=5000
JWT_SECRET=<long_random_secret>

# Optional: rate limiting / caching (implementation-specific)
RATE_LIMIT_URL=<provider_url>
RATE_LIMIT_TOKEN=<provider_token>


cd Back_End
npm install
npm run dev
