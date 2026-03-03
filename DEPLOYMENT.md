# Deployment Guide (GitHub + Render)

## 0) Root Script Mode (Monorepo Style)

This repo now includes a root `package.json` so Render (and local usage) can run commands from repository root.

Useful root commands:

```bash
npm run build
npm run dev
npm run dev:backend
npm run dev:frontend
npm run start
```

## 1) GitHub Setup
From project root:

```bash
git init
git add .
git commit -m "chore: production deployment setup"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

## 2) Render Deployment (Blueprint)
1. Go to Render dashboard.
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will detect `render.yaml` in repo root.
5. Set required secret env vars:
   - Single `noteverse` service:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
6. Deploy.

Render service command values (from `render.yaml`):

- Root Directory: `Back_End`
- Build Command: `npm install && npm install --prefix ../Front_End && npm run build --prefix ../Front_End`
- Start Command: `npm run start`

## 3) Post-Deploy Checks
- Health check: `GET https://<your-domain>/health`
- Frontend app loads on the same domain and can:
  - register/login
  - fetch notes
  - create/edit/delete notes
  - open resource page

## 4) Production Notes
- Backend uses `PORT` injected by Render automatically.
- Frontend is served by backend from `Front_End/dist` in production.
- API and frontend share one URL (`/api/*` + SPA routes on same host).
- `VITE_API_BASE_URL` is optional; leave unset to use same-origin requests.

## 5) Redeploy after changes
Push new commits to `main`:

```bash
git add .
git commit -m "feat: <your change>"
git push
```

Render auto-deploys from the connected branch.
