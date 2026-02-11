#!/usr/bin/env node
/**
 * Validates each source's RSS and/or scrape selectors.
 * Run: node scripts/validate-sources.js
 * Optional: FETCH_TIMEOUT_MS=15000 node scripts/validate-sources.js
 */
const { sources } = require("../src/sources");
const { loadSource } = require("../src/feedLoader");

const delayMs = 200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("Validating sources (RSS and/or scrape)...\n");

  let ok = 0;
  let failed = 0;

  for (const source of sources) {
    process.stdout.write(`${source.id} ... `);
    try {
      const result = await loadSource(source);
      if (result.error) {
        console.log(`FAIL: ${result.error}`);
        failed++;
      } else {
        const count = (result.items || []).length;
        console.log(`OK (${count} items)`);
        ok++;
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      failed++;
    }
    await sleep(delayMs);
  }

  console.log("\n--- Summary ---");
  console.log(`OK: ${ok}, Failed: ${failed}, Total: ${sources.length}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
