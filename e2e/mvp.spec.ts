import { expect, test, type Page } from '@playwright/test';

/**
 * Sir's MVP check: employer posts an opening → job seeker finds it → takes a course →
 * certificate and skills land on the profile → employer sees them on the application.
 */
const go = (page: Page, route: string) => page.goto(`/#${route}`);

test('MVP check: post → find → learn → certificate → employer sees it', async ({ page }) => {
  // Admin verifies BlueHarbor so it can publish
  await go(page, '/admin/verification?fresh');
  await page.getByRole('button', { name: 'Approve and verify' }).click();

  // Carla posts a new opening with a job, pay and a prep course
  await go(page, '/employer/tracks');
  await page.getByRole('link', { name: 'Post a new opening' }).click();
  await expect(page.getByRole('heading', { name: 'Post a new opening' })).toBeVisible();
  await page.getByLabel('Track title').fill('Chat Support Associate Track');
  await page.getByLabel('Position').fill('Chat Support Associate');
  await page.getByRole('button', { name: /^Next:/ }).click();
  await page.getByRole('button', { name: /^Next:/ }).click();
  await page.getByRole('button', { name: 'Publish opening' }).click();
  await expect(page).toHaveURL(/#\/employer\/tracks/);
  await expect(page.locator('tr', { hasText: 'Chat Support Associate Track' }).getByText('Live')).toBeVisible();

  // Paolo finds it with search and applies
  await go(page, '/matches');
  await page.getByPlaceholder('Hanapin ang track, kumpanya, o skill').fill('chat support');
  await page.getByRole('link', { name: /Chat Support Associate/ }).first().click();
  await expect(page.getByText('Trabahong naghihintay')).toBeVisible();
  await page.getByRole('button', { name: 'Mag-apply sa track' }).click();
  await page.getByRole('dialog').getByText(/Pumapayag akong i-share/).click();
  await page.getByRole('dialog').getByRole('button', { name: 'I-apply', exact: true }).click();
  await expect(page).toHaveURL(/#\/my-track/);

  // Paolo takes a course: lessons, then the quiz
  await go(page, '/learn');
  await expect(page.getByRole('heading', { name: /Hakbang/ })).toBeVisible();
  await page.getByRole('link', { name: /Customer service essentials/ }).first().click();
  await page.getByRole('button', { name: 'Simulan ang kurso' }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Tapos na ako, susunod' }).click();
  const answers = [1, 1, 1];
  const sets = page.locator('fieldset');
  for (let i = 0; i < answers.length; i++) await sets.nth(i).locator('label').nth(answers[i]).click();
  await page.getByRole('button', { name: 'I-submit ang sagot' }).click();
  await expect(page.getByText('Certificate na!')).toBeVisible();

  // The certificate and verified skills are on the profile
  await page.getByRole('link', { name: 'Tingnan sa profile' }).click();
  await expect(page.getByTestId('certificates').getByText('Customer service essentials')).toBeVisible();

  // Carla sees Paolo's course on his application
  await go(page, '/employer/candidates');
  await page.locator('[data-guide="candidate-paolo"]').click();
  await expect(page.getByTestId('candidate-certs').getByText('Customer service essentials')).toBeVisible();
});

test('impact calculator updates from the slider', async ({ page }) => {
  await go(page, '/?fresh');
  await page.locator('#impact').scrollIntoViewIfNeeded();
  await page.getByTestId('impact-slider').focus();
  await page.keyboard.press('End'); // max: 50,000 graduates
  await expect(page.getByTestId('impact-0')).toHaveText('35,000');
});

test('contact, legal and support pages respond', async ({ page }) => {
  await go(page, '/contact?topic=school');
  await page.getByLabel('Pangalan').fill('Test');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByRole('button', { name: 'Ipadala' }).click();
  await expect(page.getByRole('status')).toContainText('Natanggap');
  await go(page, '/legal/terms');
  await expect(page.getByRole('heading', { name: 'Terms of Use' })).toBeVisible();
  await go(page, '/support');
  await page.getByRole('button', { name: 'Humingi ng bayad ang employer' }).click();
  await expect(page.getByRole('log')).toContainText('Hindi ka dapat magbayad');
});
