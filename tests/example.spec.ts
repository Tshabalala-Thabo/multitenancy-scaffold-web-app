import { test, expect } from '@playwright/test';

test('Login as super admin', async ({ page }) => {
  // Clear cookies before visiting the page
  await page.context().clearCookies()

  await page.goto('http://localhost:3001/login')

  // Fill in login form
  await page.getByTestId('email-input').fill('super@admin.com')
  await page.getByTestId('password-input').fill('password')
  await page.getByTestId('remember-checkbox').check()

  // Submit the form
  await page.getByTestId('login-button').click()

  // Expect redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/)
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
