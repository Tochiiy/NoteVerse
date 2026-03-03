# NoteVerse

A full-stack note management app with authentication, media-ready notes, profile management, and a resource hub.

## Workspace Structure

```text
Book_Keeping_App/
  Back_End/      # Express + MongoDB API
  Front_End/     # React + Vite client
  API_DOCUMENTATION.md
  PROJECT_DOCUMENTATION.md
  requirements.tx
```

## Quick Start

### 1) Backend setup

```bash
cd Back_End
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend setup

```bash
cd Front_End
npm install
cp .env.example .env
npm run dev
```

> Frontend default URL: http://localhost:5173  
> Backend default URL: http://localhost:5000

## Environment Variables

### Backend (`Back_End/.env`)
- `PORT`
- `MONGO_URI`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `JWT_SECRET`

### Frontend (`Front_End/.env`)
- `VITE_API_BASE_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_OPEN_METEO_WEATHER_URL`
- `VITE_OPEN_METEO_GEOCODE_URL`
- `VITE_MAP_EMBED_BASE_URL`

## Developer Docs
- Full API reference: `API_DOCUMENTATION.md`
- Full development explanation + snippets: `PROJECT_DOCUMENTATION.md`
- Dependency requirements list: `requirements.tx`
- Monetization SOP (for future embed code): `MONETIZATION_SOP.md`
- Deployment runbook (GitHub + Render): `DEPLOYMENT.md`
- Render blueprint config: `render.yaml`
- Backend details: `Back_End/README.md`
- Frontend details: `Front_End/README.md`
