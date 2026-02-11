# World News Aggregator

A small web app that collects homepage headlines from a curated list of world news sites using RSS where available and scraping as a fallback.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Validate sources

To check that each source’s RSS and/or scrapers work:

```bash
npm run validate
```

## Monitoring and health

- **`GET /api/ready`** — Returns `ok` (for load balancers / readiness probes).
- **`GET /api/health`** — JSON with uptime, last feed run summary (OK/failed per source), and recent failure log entries.

Failures are logged to the console and kept in memory (last 100); use `/api/health` to inspect recent errors.

## Configuration

Edit the source list in:
- `src/sources.js`

Each source supports:
- `rssUrl` (preferred when available)
- `scrapeUrl` + `selectors` (fallback or primary)

You can also tune via env:
- `CACHE_TTL_MS`
- `FETCH_TIMEOUT_MS`
- `MAX_PER_SOURCE`

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for a step-by-step guide to deploy on Render’s free tier (or other free hosts).

## Notes

Some sites may block scraping or require selector tweaks over time. If a source shows no headlines, run `npm run validate` and adjust its `selectors` in `src/sources.js`.
