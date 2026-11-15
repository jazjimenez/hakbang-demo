// Prints Lighthouse category scores from lh.json as a Markdown table (for the job summary).
import { readFileSync } from 'node:fs';
const r = JSON.parse(readFileSync(process.argv[2] ?? 'lh.json', 'utf8'));
const rows = Object.values(r.categories).map((c) => `| ${c.title} | ${Math.round(c.score * 100)} |`);
const m = (id) => r.audits[id]?.displayValue ?? '–';
console.log(['### Lighthouse (landing page, mobile)', '', '| Category | Score |', '|---|---|', ...rows, '', `LCP ${m('largest-contentful-paint')} · TBT ${m('total-blocking-time')} · CLS ${m('cumulative-layout-shift')}`].join('\n'));
