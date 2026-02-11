# Deployment Guide

This app runs as a single Node.js server (Express). Below is a **free-tier** deployment option.

## Recommended free host: Render

[Render](https://render.com) offers a free tier for web services: 750 hours/month, sleep after 15 min inactivity, and enough for this app.

### 1. Prepare the repo

- Push the project to GitHub (or GitLab / Bitbucket).
- Ensure `package.json` has a `start` script (this project uses `node src/server.js`).

### 2. Create a Render Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in (GitHub is fine).
2. **New** → **Web Service**.
3. Connect your repo and select the World News Aggregator repository.
4. Configure:
   - **Name:** `world-news-aggregator` (or any name).
   - **Region:** Choose closest to you.
   - **Branch:** `main` (or your default branch).
   - **Runtime:** `Node`.
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. **Advanced** (optional):
   - **Environment variables:** Add if you use them, e.g.:
     - `PORT` — leave unset (Render sets it).
     - `CACHE_TTL_MS` — e.g. `7200000` (2 hours).
     - `FETCH_TIMEOUT_MS` — e.g. `10000`.
     - `NODE_ENV=production`
6. Click **Create Web Service**.

Render will build and deploy. The app will be available at `https://<your-service-name>.onrender.com`.

### 3. Free tier behavior

- **Spins down** after ~15 minutes of no traffic. The first request after that may take 30–60 seconds (cold start).
- **750 hours/month** free; fine for personal or low-traffic use.
- Outbound requests (to news sites) count against Render’s fair-use; this app’s moderate fetching is typically acceptable.

### 4. Health and monitoring

After deployment you can use:

- **Readiness:** `GET https://<your-app>.onrender.com/api/ready` → returns `ok`.
- **Health (with last run and failures):** `GET https://<your-app>.onrender.com/api/health` → JSON with `lastRun`, `recentFailures`, etc.

Use these in Render’s health check path or in an external uptime/monitoring tool.

---

## Other free options

- **Railway** — Free tier with a monthly credit; similar “connect repo → build → run” flow.
- **Fly.io** — Free allowance for small VMs; you deploy with `flyctl` and a `Dockerfile` or their buildpacks.
- **Cyclic** (cyclic.sh) — Free tier for Node apps; connect GitHub and deploy.

For all of them, set the start command to `npm start` (or `node src/server.js`) and ensure `PORT` is read from the environment.
