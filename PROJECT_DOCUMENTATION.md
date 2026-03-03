# NoteVerse — Full Development Documentation

This document explains how NoteVerse is built, how data flows between frontend and backend, and how other developers can extend the app safely.

## 1) Project Architecture

## Workspace
```text
Book_Keeping_App/
  Back_End/
    config/
      db.js
    middleware/
      auth.js
      rateLimiter.js
    models/
      Note.js
      ResourceLink.js
      User.js
    src/
      controllers/
      routes/
      server.js
    server.js
  Front_End/
    components/
    features/
      auth/
      media/
      sky/
    lib/
      axios.js
    pages/
    src/
```

## High-level Flow
1. Frontend authenticates user (`/api/auth/register` or `/api/auth/login`).
2. JWT token is saved to `localStorage`.
3. Frontend sends `Authorization: Bearer <token>` for protected endpoints.
4. Backend `protect` middleware validates token and attaches `req.user`.
5. Notes are scoped per user (`note.user === req.user._id`).

---

## 2) Backend Development Explanation

## Entry and bootstrapping
- Runtime starts in `Back_End/server.js` (bootstrap wrapper).
- Main app setup is in `Back_End/src/server.js`.
- DB connection happens before server starts accepting traffic.

### Core server setup snippet
```js
app.use(cors());
app.use(express.json());
app.use("/api/", apiLimiter);

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourcesRoutes);
```

## Authentication strategy
- JWT signed with `JWT_SECRET`.
- Token payload: `{ id: userId }`.
- Auth middleware validates token and fetches user document.

### Auth middleware pattern
```js
const authHeader = req.headers.authorization || "";
if (!authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ error: "Not authorized" });
}
```

## Notes data model
- Required: `title`, `content`, `user`.
- Optional arrays: `tags`, `imageUrls`, `videoUrls`.
- Flags: `pinned`, `archived`.
- Timestamps enabled.

### Query behavior for notes
- `q` searches title/content/tags.
- `sort=asc|desc` controls created time sorting.
- `includeArchived=true` includes archived notes.

### Search query snippet
```js
if (searchTerm) {
  const searchRegex = new RegExp(searchTerm, "i");
  query.$or = [
    { title: searchRegex },
    { content: searchRegex },
    { tags: searchRegex },
  ];
}
```

## Resource links
- Public GET endpoint only: `/api/resources`.
- Backed by `ResourceLink` model.
- Categories: `book`, `research`, `ai`, `sponsor`.

---

## 3) Frontend Development Explanation

## API client centralization
All HTTP calls use one axios instance in `Front_End/lib/axios.js`.

```js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});
```

## Auth state management (`AuthContext`)
- Stores token in `localStorage` (`auth_token`).
- Bootstraps session using `/api/auth/me`.
- Exposes: `login`, `register`, `logout`, `updateProfile`, `deleteAccount`.

### Auth header generation snippet
```js
const authHeaders = useMemo(
  () => (token ? { Authorization: `Bearer ${token}` } : {}),
  [token],
);
```

## Notes UX
- Home page fetches notes and supports editing/deleting/pinning.
- Create page supports manual media URLs + Cloudinary uploads.
- Notes include image/video preview support on cards.

### Create note save snippet
```js
await axios.post(
  "/api/notes",
  { title, content, tags, imageUrls, videoUrls },
  { headers: authHeaders },
);
```

## Profile UX
- Update user `name`, `bio`, `profilePicture`.
- Danger zone action deletes account and related notes.

---

## 4) Setup and Run (for new developers)

## Backend
```bash
cd Back_End
npm install
cp .env.example .env
npm run dev
```

## Frontend
```bash
cd Front_End
npm install
cp .env.example .env
npm run dev
```

## Build frontend
```bash
cd Front_End
npm run build
```

---

## 5) Environment Configuration

## Backend `.env`
```env
PORT=5000
MONGO_URI=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
JWT_SECRET=change_me
```

## Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_OPEN_METEO_WEATHER_URL=https://api.open-meteo.com/v1/forecast
VITE_OPEN_METEO_GEOCODE_URL=https://geocoding-api.open-meteo.com/v1/reverse
VITE_MAP_EMBED_BASE_URL=https://maps.google.com/maps
```

---

## 6) Code Snippets for Other Developers

## Example: call protected endpoint from frontend
```js
import axios from "../lib/axios";

const response = await axios.get("/api/notes", {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Example: add new protected backend route
```js
import { protect } from "../../middleware/auth.js";

router.get("/stats", protect, async (req, res) => {
  const total = await Note.countDocuments({ user: req.user._id });
  res.json({ total });
});
```

## Example: partial update from client
```js
await axios.put(
  `/api/notes/${noteId}`,
  { pinned: true },
  { headers: authHeaders },
);
```

## Example: cloud media upload result handling
```js
const uploadedUrl = await uploadSingleFileToCloudinaryWithProgress(file, "image", onProgress);
setImageUrls((prev) => [...prev, uploadedUrl]);
```

---

## 7) Extension Guide

If you add a new feature:
1. Add/extend a Mongoose model if needed.
2. Add controller logic under `Back_End/src/controllers`.
3. Add route under `Back_End/src/routes` and mount in `src/server.js`.
4. Consume endpoint from frontend via `Front_End/lib/axios.js`.
5. Reuse `authHeaders` for protected operations.
6. Update `API_DOCUMENTATION.md` and related README files.

---

## 8) Common Troubleshooting

- **401 Unauthorized**: Verify JWT exists and `Authorization` header starts with `Bearer `.
- **500 JWT_SECRET is required**: Set `JWT_SECRET` in `Back_End/.env`.
- **Mongo connection issues**: Verify `MONGO_URI` and network access.
- **Rate limit 429**: Wait and retry; limiter is enabled on `/api/*`.
- **Media upload fails**: Verify `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.

---

## 9) Documentation Index
- API contracts: `API_DOCUMENTATION.md`
- Dependency list: `requirements.tx`
- Root overview: `README.md`
- Backend setup: `Back_End/README.md`
- Frontend setup: `Front_End/README.md`
