<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=fff" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/DaisyUI-5A0EF8?logo=daisyui&logoColor=fff" alt="DaisyUI"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=fff" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/Redis-FF4438?logo=redis&logoColor=fff" alt="Upstash Redis"/>
  <img src="https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=fff" alt="Render"/>
</p>

# NoteVerse

A full-stack note management app with JWT auth, media attachments, pinning, search, Cloudinary uploads, weather/location display, and rate limiting.

---

## Architecture

```
Frontend (React 19 + Vite 7 + DaisyUI)
    ↕ HTTP (Axios)
Backend (Express 5 + Mongoose)
    ↕
┌──────────┬─────────────┬─────────────┐
│ MongoDB  │ Upstash Redis│ Cloudinary │
│ (notes,  │ (rate limit) │ (media     │
│  users,  │              │  uploads)  │
│  links)  │              │            │
└──────────┴─────────────┴─────────────┘
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register (name, email, password) → JWT |
| POST | `/api/auth/login` | No | Login → JWT |
| GET | `/api/auth/me` | Yes | Get profile |
| PUT | `/api/auth/me` | Yes | Update profile (name, bio, avatar) |
| DELETE | `/api/auth/me` | Yes | Delete account + all notes |

### Notes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notes` | Yes | List notes (`?q=`, `?sort=`, `?includeArchived=`) |
| POST | `/api/notes` | Yes | Create note (title, content, tags, media, pinned) |
| GET | `/api/notes/:id` | Yes | Get single note |
| PUT | `/api/notes/:id` | Yes | Update note |
| DELETE | `/api/notes/:id` | Yes | Delete note |

### Resources

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/resources` | No | List resource hub links |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Node.js, Express 5, ES Modules |
| **Database** | MongoDB via Mongoose 9 |
| **Auth** | JWT (`jsonwebtoken`) + bcryptjs |
| **Rate Limiting** | Upstash Redis + express-rate-limit |
| **Media** | Cloudinary (unsigned upload) |
| **Frontend** | React 19, Vite 7, React Router 7 |
| **State** | React Context (AuthContext) |
| **HTTP** | Axios |
| **Styling** | Tailwind CSS 3 + DaisyUI 4 (9 themes) |
| **Icons** | lucide-react |
| **Notifications** | react-hot-toast |
| **Weather** | Open-Meteo API (free, no key) |
| **Maps** | Google Maps embed |

---

## Database Schema

### User
```
{
  name: String, email: String (unique),
  password: String (bcrypt), profilePicture: String,
  bio: String, timestamps: true
}
```

### Note
```
{
  user: ObjectId (ref: User, indexed),
  title: String, content: String,
  tags: [String], imageUrls: [String],
  videoUrls: [String], pinned: Boolean,
  archived: Boolean, timestamps: true
}
```

### ResourceLink
```
{
  title: String, description: String,
  url: String, category: Enum[book|research|ai|sponsor],
  active: Boolean, order: Number
}
```

---

## Quick Start

```bash
# Backend
cd Back_End
npm install
# Edit .env with MONGO_URI, JWT_SECRET, Upstash creds
npm run dev

# Frontend
cd Front_End
npm install
# Edit .env with VITE_API_BASE_URL + Cloudinary vars
npm run dev
```

---

## Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `UPSTASH_REDIS_REST_URL` | Yes | Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Redis token |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | No | Backend URL (default: proxy) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Yes | Cloudinary unsigned preset |

---

## Project Structure

```
├── Back_End/
│   ├── server.js                       # Entry → src/server.js
│   ├── src/server.js                   # Express app, CORS, routes, SPA fallback
│   ├── config/db.js                    # Mongoose connection
│   ├── middleware/
│   │   ├── auth.js                     # JWT protect middleware
│   │   └── rateLimiter.js              # Upstash rate limiter
│   ├── models/
│   │   ├── User.js                     # User schema
│   │   ├── Note.js                     # Note schema
│   │   └── ResourceLink.js             # Resource link schema
│   ├── controllers/
│   │   ├── auth.js                     # Auth logic
│   │   ├── notes.js                    # Notes CRUD
│   │   └── resources.js                # Resources query
│   └── routes/
│       ├── authRoutes.js               # /api/auth/*
│       ├── notesRoutes.js              # /api/notes/*
│       └── resourcesRoutes.js          # /api/resources/*
└── Front_End/
    ├── src/
    │   ├── components/
    │   │   ├── NavBar.jsx              # Floating bottom nav
    │   │   ├── NoteCard.jsx            # Note card + media modal
    │   │   ├── RainEffect.jsx          # Weather + map display
    │   │   └── RateLimiter.jsx         # Rate limit warning
    │   ├── pages/
    │   │   ├── HomePage.jsx            # Dashboard + search + edit
    │   │   ├── CreatePage.jsx          # New note + media upload
    │   │   ├── ResourcePage.jsx        # Resource hub
    │   │   ├── ProfilePage.jsx         # Profile management
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── features/
    │   │   ├── auth/AuthContext.jsx    # Auth state
    │   │   ├── media/cloudinaryUpload.js
    │   │   └── sky/                    # Weather + location hooks
    │   ├── lib/axios.js                # Axios client
    │   └── App.jsx                     # Router + theme + auth
    ├── vite.config.js                  # Dev proxy to :5000
    └── tailwind.config.js              # DaisyUI themes (9)
```

---

## Features

- **Notes CRUD** — Create, read, update, delete with rich content
- **Media Attachments** — Upload images/video via Cloudinary
- **Pin/Archive** — Prioritize notes with pinning
- **Search** — Full-text search across all notes
- **Resource Hub** — Curated links to books, research, AI tools
- **Weather & Location** — Live weather with animated effects (rain, sun, aurora, meteor) + embedded Google Map
- **9 Themes** — DaisyUI theme switcher (light/dark)
- **Rate Limiting** — Upstash Redis — 429 warning UI with countdown

---

## Deployment

- **Backend + Frontend**: Render via `render.yaml` — single web service serving both API and built frontend
