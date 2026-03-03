# NoteVerse Frontend

React + Vite client for NoteVerse.

## Features
- JWT-based auth UI (login/register/profile)
- Protected routing
- Notes list/create/edit/delete
- Pin notes support
- Media attachments (image/video URLs + Cloudinary upload)
- Resource page fed from backend API

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Environment
Create `Front_End/.env` from `.env.example`.

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_OPEN_METEO_WEATHER_URL=https://api.open-meteo.com/v1/forecast
VITE_OPEN_METEO_GEOCODE_URL=https://geocoding-api.open-meteo.com/v1/reverse
VITE_MAP_EMBED_BASE_URL=https://maps.google.com/maps
```

## Axios Base Client
`lib/axios.js`

```js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

export default apiClient;
```

## Auth Header Pattern

```js
const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

await axios.get("/api/auth/me", { headers: authHeaders });
```

## Build

```bash
npm run build
```
Output folder: `Front_End/dist`
