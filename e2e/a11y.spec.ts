import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Automated WCAG 2.1 A/AA scan of the main screens. Fails on serious or critical issues. */
const pages = ['/', '/demo', '/signup', '/consent', '/matches', '/tracks/back-office', '/my-track', '/profile', '/employer/overview', '/employer/candidates', '/employer/billing', '/admin/verification', '/learn', '/learn/excel-basics', '/learn/excel-basics/excel-l6', '/employer/tracks', '/employer/tracks/new', '/contact', '/support', '/legal/credits'];

for (const route of pages) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(`/#${route}${route.includes('?') ? '&' : '?'}fresh`);
    await page.waitForTimeout(2600); // let entrance animations settle
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('[aria-hidden="true"]')
      .analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    const summary = bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(' ')}`);
    expect(summary, summary.join('\n')).toEqual([]);
  });
}
