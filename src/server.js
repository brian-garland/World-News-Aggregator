const express = require("express");
const path = require("path");
const { sources } = require("./sources");
const { loadAllSources } = require("./feedLoader");

const PORT = process.env.PORT || 3000;
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 1000 * 60 * 60 * 2); // 2 hours

const app = express();

// In-memory failure log (last N entries) and health summary
const FAILURE_LOG_MAX = 100;
const failureLog = [];
let lastRun = { ts: null, ok: 0, failed: 0, sourceIds: [] };

function logFailure(sourceId, sourceName, phase, message) {
  const entry = {
    ts: new Date().toISOString(),
    sourceId,
    sourceName,
    phase,
    message: message || "Unknown error",
  };
  failureLog.push(entry);
  if (failureLog.length > FAILURE_LOG_MAX) failureLog.shift();
  console.error(`[FAIL] ${sourceId} (${phase}): ${entry.message}`);
}

let cache = {
  ts: 0,
  data: null,
};

app.get("/api/stories", async (req, res) => {
  const bypass = req.query.refresh === "1";
  const now = Date.now();

  if (!bypass && cache.data && now - cache.ts < CACHE_TTL_MS) {
    return res.json({
      updatedAt: cache.ts,
      sources: cache.data,
    });
  }

  try {
    const data = await loadAllSources(sources, {
      delayMs: 120,
      onSourceDone(result) {
        if (result.error) {
          logFailure(result.id, result.name, "fetch", result.error);
        }
      },
    });

    const ok = data.filter((s) => !s.error).length;
    const failed = data.filter((s) => s.error).length;
    lastRun = {
      ts: now,
      ok,
      failed,
      sourceIds: data.map((s) => ({ id: s.id, error: s.error || null })),
    };

    cache = { ts: now, data };
    res.json({ updatedAt: cache.ts, sources: data });
  } catch (err) {
    const message = err.message || "Failed to load sources";
    logFailure("_system", "API", "loadAll", message);
    res.status(500).json({ error: message });
  }
});

// Monitoring endpoint: health summary + recent failures
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    lastRun: lastRun.ts
      ? {
          at: new Date(lastRun.ts).toISOString(),
          sourcesOk: lastRun.ok,
          sourcesFailed: lastRun.failed,
          details: lastRun.sourceIds,
        }
      : null,
    recentFailures: failureLog.slice(-20),
  });
});

// Optional: simple readiness for reverse proxies / orchestrators
app.get("/api/ready", (_req, res) => {
  res.send("ok");
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
