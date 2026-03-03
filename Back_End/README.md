# NoteVerse Backend

Backend API for NoteVerse (authentication, user-scoped notes, and resource links).

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
```

`server.js` at root is a small bootstrap that imports `src/server.js`.

## Environment

Create `Back_End/.env`:

```env
MONGO_URI=<your MongoDB connection string>
PORT=5000
JWT_SECRET=<long_random_secret>

UPSTASH_REDIS_REST_URL=<your Upstash Redis REST URL>
UPSTASH_REDIS_REST_TOKEN=<your Upstash Redis REST token>
```

## Run

```bash
cd Back_End
npm install
npm run dev
```

## API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `PUT /api/auth/me` (protected)
- `DELETE /api/auth/me` (protected, deletes user and their notes)

### Notes (all protected)
- `GET /api/notes` (supports `q`, `sort`, `includeArchived`)
- `POST /api/notes`
- `GET /api/notes/:id`
- `PUT /api/notes/:id` (supports partial updates)
- `DELETE /api/notes/:id` (permanent delete)

Notes are user-owned (`note.user`) and scoped to the authenticated user.

### Resources
- `GET /api/resources`

Returns active resource links grouped client-side by category (`book`, `research`, `ai`, `sponsor`).

## Developer Snippets

### Protected route pattern

```js
import { protect } from "../middleware/auth.js";

router.get("/me", protect, getMyProfile);
```

### User-scoped note query pattern

```js
const notes = await Note.find({ user: req.user._id, archived: false });
```

### Partial note update pattern

```js
const note = await Note.findOneAndUpdate(
  { _id: id, user: req.user._id },
  updatePayload,
  { new: true, runValidators: true },
);
```

## Additional Docs

- Root overview: `../README.md`
- Full API docs: `../API_DOCUMENTATION.md`
- Full dev guide: `../PROJECT_DOCUMENTATION.md`
- Dependency list: `../requirements.tx`

## Rate Limiting

Upstash Redis rate limiting is applied to `/api/*`.
When exceeded, API returns `429 Too Many Requests`.