import { expect, test, type Page } from '@playwright/test';

/**
 * The 5-minute presenter story, end to end, across all three roles.
 * If this fails, the live demo is broken.
 */

const go = (page: Page, route: string) => page.goto(`/#${route}`);

test('presenter story: sign up → apply → accept → pass → hire → confirm → billing → verification', async ({ page }) => {
  // 1. Paolo signs up (fresh data, Filipino by default)
  await go(page, '/signup?fresh');
  await page.getByRole('button', { name: 'Mag-sign up gamit ang email' }).click();
  await expect(page).toHaveURL(/#\/consent/);
  await page.getByText('Sumasang-ayon ako sa Privacy Notice').click();
  await page.getByRole('button', { name: 'Sige, tuloy' }).click();

  // 2. Upload + AI-filled profile (desktop shows both side by side)
  await page.getByRole('button', { name: /I-drag dito ang resume mo/ }).click();
  await expect(page.getByText('Nabasa na ng AI')).toBeVisible();
  await page.getByRole('button', { name: 'I-save ang profile' }).click();
  await expect(page).toHaveURL(/#\/matches/);

  // 3. Apply to the Back Office track; profile goes to BlueHarbor only
  await page.getByRole('button', { name: 'Mag-apply sa track' }).click();
  const apply = page.getByRole('dialog');
  await expect(apply.getByRole('button', { name: 'I-apply', exact: true })).toBeDisabled();
  await apply.getByText('Pumapayag akong i-share ang profile ko sa BlueHarbor CX lang.').click();
  await apply.getByRole('button', { name: 'I-apply', exact: true }).click();
  await expect(page).toHaveURL(/#\/my-track/);
  await expect(page.getByText('Naghihintay ng sagot ng BlueHarbor CX')).toBeVisible();

  // 4. Carla accepts Paolo from the shortlist
  await go(page, '/employer/candidates');
  await expect(page.getByText('School and name never affect the score')).toBeVisible();
  await page.locator('[data-guide="accept-paolo"]').click();
  await go(page, '/my-track');
  await expect(page.getByText('In track').first()).toBeVisible();

  // 5. Carla posts results until Paolo has passed everything
  await go(page, '/employer/trainees');
  for (const round of ['Module 1', 'Module 2', 'assessment']) {
    await page.getByRole('button', { name: `Post ${round} results` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Post results' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
  await go(page, '/my-track');
  await expect(page.getByText('Pasado ka sa lahat ng module!')).toBeVisible();

  // 6. Carla marks Paolo hired → billing waits for Paolo
  await go(page, '/employer/trainees');
  await page.locator('tr', { hasText: 'Paolo Reyes' }).getByRole('button', { name: 'Mark as hired' }).click();
  const hire = page.getByRole('dialog');
  await expect(hire.getByText('₱2,500')).toBeVisible();
  await hire.getByText('A job contract was offered and signed.').click();
  await hire.getByRole('button', { name: 'Mark as hired' }).click();
  await expect(page).toHaveURL(/#\/employer\/billing/);
  await expect(page.getByText('Waiting for Paolo to confirm')).toBeVisible();

  // 7. Paolo confirms (dual confirmation)
  await go(page, '/hired');
  await page.getByRole('button', { name: 'Oo, pumirma na ako' }).click();
  await expect(page.getByText('Opisyal na, Paolo!')).toBeVisible();

  // 8. Billing now shows the confirmed hire at the pilot rate
  await go(page, '/employer/billing');
  const paoloRow = page.locator('tr', { hasText: 'Paolo Reyes' });
  await expect(paoloRow.getByText('Confirmed')).toBeVisible();
  await expect(paoloRow.getByText('₱2,500')).toBeVisible();
  await expect(page.getByText('₱7,500')).toBeVisible();

  // 9. Admin approves BlueHarbor → Carla can post a track
  await go(page, '/admin/verification');
  await page.getByRole('button', { name: 'Approve and verify' }).click();
  await go(page, '/employer/verify');
  await expect(page.getByRole('heading', { name: 'Your company is verified' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Post a track/ })).toBeVisible();
});

test('presenter guide walks the story and advances on its own', async ({ page }) => {
  await go(page, '/?fresh&guide');
  const guide = page.getByRole('complementary', { name: 'Presenter guide' });
  await expect(guide.getByText('Step 1/8')).toBeVisible();
  await guide.getByRole('button', { name: /Take me there/ }).click();
  await expect(page).toHaveURL(/#\/signup/);
  // the button the presenter should press is highlighted
  await expect(page.locator('[data-guide="onboard"]').first()).toBeVisible();
});

test('?fresh resets saved demo data', async ({ page }) => {
  await go(page, '/demo?fresh');
  await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('hakbang-demo-v1')!);
    raw.state.onboarding.profileSaved = true;
    localStorage.setItem('hakbang-demo-v1', JSON.stringify(raw));
  });
  await go(page, '/demo?fresh');
  await page.reload();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hakbang-demo-v1')!).state.onboarding.profileSaved);
  expect(saved).toBe(false);
});

test('Pilot-only mode hides every Launch entry point', async ({ page }) => {
  await go(page, '/demo?fresh');
  await page.getByRole('switch', { name: 'Show Launch features' }).click();
  await go(page, '/matches');
  await expect(page.getByText('Launch feature')).toHaveCount(0);
  await expect(page.locator('a[href="#/alerts"]')).toHaveCount(0);
});
