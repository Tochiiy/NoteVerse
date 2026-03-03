# Deployment Guide (GitHub + Render)

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
   - Backend service:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - Frontend service:
     - `VITE_API_BASE_URL` = backend Render URL (example: `https://noteverse-backend.onrender.com`)
6. Deploy.

## 3) Post-Deploy Checks
- Backend health: `GET https://<backend-domain>/health`
- Frontend app loads and can:
  - register/login
  - fetch notes
  - create/edit/delete notes
  - open resource page

## 4) Production Notes
- Backend uses `PORT` from Render automatically.
- Frontend static site needs `VITE_API_BASE_URL` set to backend public URL.
- If CORS issues occur later, set a strict CORS origin list in backend env and middleware.

## 5) Redeploy after changes
Push new commits to `main`:

```bash
git add .
git commit -m "feat: <your change>"
git push
```

Render auto-deploys from the connected branch.
