/**
 * Shared feed loading: RSS + scrape. Used by server and validation script.
 */
const Parser = require("rss-parser");
const cheerio = require("cheerio");

const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS || 8000);
const MAX_PER_SOURCE = Number(process.env.MAX_PER_SOURCE || 8);

const parser = new Parser();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

function cleanText(text) {
  return (text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.:;!?])/g, "$1")
    .trim();
}

function normalizeUrl(href, base) {
  if (!href) return null;
  if (href.startsWith("javascript:") || href.startsWith("mailto:"))
    return null;
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function isLikelyHeadline(text) {
  if (!text) return false;
  const len = text.length;
  return len >= 10 && len <= 140;
}

function filterToHost(url, host) {
  try {
    const u = new URL(url);
    return u.hostname.endsWith(host);
  } catch {
    return false;
  }
}

async function getRssItems(source) {
  const xml = await fetchText(source.rssUrl, source.timeoutMs);
  const feed = await parser.parseString(xml);
  const items = (feed.items || [])
    .map((item) => {
      const title = cleanText(item.title);
      const link = item.link ? item.link.trim() : null;
      if (!isLikelyHeadline(title) || !link) return null;
      return { title, url: link };
    })
    .filter(Boolean);

  return items.slice(0, MAX_PER_SOURCE);
}

async function getScrapedItems(source) {
  const html = await fetchText(source.scrapeUrl, source.timeoutMs);
  const $ = cheerio.load(html);
  const host = new URL(source.homepage).hostname;
  const seen = new Set();
  const items = [];

  for (const selector of source.selectors || []) {
    $(selector).each((_, el) => {
      const title = cleanText($(el).text());
      const href = $(el).attr("href");
      const url = normalizeUrl(href, source.homepage);

      if (!url || !isLikelyHeadline(title)) return;
      if (!filterToHost(url, host)) return;

      const key = `${title}::${url}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ title, url });
    });

    if (items.length >= MAX_PER_SOURCE) break;
  }

  return items.slice(0, MAX_PER_SOURCE);
}

async function loadSource(source) {
  let items = [];
  let error = null;

  try {
    if (source.rssUrl) {
      items = await getRssItems(source);
      if (items.length === 0 && source.scrapeUrl) {
        items = await getScrapedItems(source);
      }
    } else if (source.scrapeUrl) {
      items = await getScrapedItems(source);
    }
  } catch (err) {
    error = err.message || "Failed to load";
    try {
      if (source.scrapeUrl) {
        items = await getScrapedItems(source);
        error = null;
      }
    } catch (scrapeErr) {
      error = scrapeErr.message || error;
    }
  }

  return {
    id: source.id,
    name: source.name,
    homepage: source.homepage,
    items,
    error,
  };
}

async function loadAllSources(sources, options = {}) {
  const { delayMs = 120, onSourceDone } = options;
  const results = [];
  for (const source of sources) {
    const result = await loadSource(source);
    results.push(result);
    if (onSourceDone) onSourceDone(result);
    await sleep(delayMs);
  }
  return results;
}

module.exports = {
  fetchText,
  getRssItems,
  getScrapedItems,
  loadSource,
  loadAllSources,
  cleanText,
  normalizeUrl,
  isLikelyHeadline,
  filterToHost,
};
