import { expect, test } from '@playwright/test';

test('phone: landing has no sideways scroll and the sign-up button fits', async ({ page }) => {
  await page.goto('/#/?fresh');
  await page.waitForTimeout(800);
  const { doc, vw } = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, vw: innerWidth }));
  expect(doc).toBeLessThanOrEqual(vw);
  const box = await page.locator('header').first().getByRole('button', { name: 'Mag-sign up', exact: true }).boundingBox();
  expect(box!.x + box!.width).toBeLessThanOrEqual(vw);
});

test('phone: apply sheet opens from track detail', async ({ page }) => {
  await page.goto('/#/tracks/back-office?fresh');
  await page.getByRole('button', { name: 'Mag-apply sa track' }).click();
  await expect(page.getByRole('dialog').getByText('Makikita ng BlueHarbor CX')).toBeVisible();
});
