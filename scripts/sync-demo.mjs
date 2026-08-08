/**
 * Copies the P-say-B mock into public/ so the landing page can embed it.
 *
 * The mock lives in a sibling repo, so this is an explicit, manual step —
 * deliberately NOT wired into `prebuild`, because that repo won't exist in CI.
 * The copy at public/demo/index.html is committed.
 *
 *   npm run sync:demo
 *   PSAYB_MOCK=../elsewhere/index.html npm run sync:demo
 */
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, process.env.PSAYB_MOCK ?? "../p-say-b/mock/index.html");
const dest = resolve(root, "public/demo/index.html");

try {
  statSync(src);
} catch {
  console.error(`[sync-demo] source not found: ${src}`);
  console.error(`[sync-demo] set PSAYB_MOCK=<path to mock index.html> to override`);
  process.exit(1);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);

const kb = (statSync(dest).size / 1024).toFixed(0);
console.log(`[sync-demo] ${kb} KB -> public/demo/index.html`);
console.log(`[sync-demo] bump DEMO_SRC's ?v= in src/components/DemoFrame.tsx if this changed`);
