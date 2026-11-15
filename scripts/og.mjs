// Renders the landing hero to a 1200×630 PNG for link previews (og:image).
// usage: node scripts/og.mjs <site url> <out.png>
import { chromium } from '@playwright/test';

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${url}#/?fresh`);
await page.addStyleTag({
  content: '#root > div[role="note"]:first-child, [aria-label="Open demo controls"], body::after { display: none !important; }',
});
await page.waitForTimeout(3500); // let the staircase finish its entrance
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out}`);
