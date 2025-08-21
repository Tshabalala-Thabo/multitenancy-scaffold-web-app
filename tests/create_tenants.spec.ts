import { test, expect } from '@playwright/test';
import organisations from './data/organisations.json';

test.describe('Organisation Management Single Flow', () => {
  test('Create multiple organisations using JSON data', async ({ page }) => {
    // Login once
    await page.context().clearCookies();
    await page.goto(`${process.env.NEXT_PUBLIC_URL}/login`);
    await page.getByTestId('email-input').fill('super@admin.com');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('remember-checkbox').check();
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/.*dashboard/);

    await page.goto(`${process.env.NEXT_PUBLIC_URL}/organisations`);

    for (const org of organisations) {
      const slug = org.name.toLowerCase().replace(/\s+/g, '-');

      // Open modal
      await page.click('button:has-text("Create New Organisation")');
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Fill Basic Info
      await modal.locator('button[role="tab"]:has-text("Basic info")').click();
      await modal.locator('input[id="name"]').fill(org.name);
      await expect(modal.locator('input[id="slug"]')).toHaveValue(slug);
      await modal.locator('input[id="domain"]').fill(org.domain);

      // Address Tab
      await modal.locator('button[role="tab"]:has-text("Address")').click();
      await modal.locator('input[id="street_address"]').fill(org.address.street);
      await modal.locator('input[id="suburb"]').fill(org.address.suburb);
      await modal.locator('input[id="city"]').fill(org.address.city);
      await modal.locator('input[id="province"]').fill(org.address.province);
      await modal.locator('input[id="postal_code"]').fill(org.address.postal_code);

      // Admin Tab
      await modal.locator('button[role="tab"]:has-text("Administrators")').click();
      await modal.locator('input[id="name_1"]').fill(org.admin.first_name);
      await modal.locator('input[id="last_name_1"]').fill(org.admin.last_name);
      await modal.locator('input[id="email_1"]').fill(org.admin.email);
      await modal.locator('input[id="password_1"]').fill(org.admin.password);

      // Upload logo
      await modal.locator('button[role="tab"]:has-text("Basic info")').click();
      const fileChooserPromise = page.waitForEvent('filechooser');
      await modal.locator('button:has-text("Upload Logo")').click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(org.logo);
      //await expect(modal.locator('img[alt="Logo preview"]')).toBeVisible();

      // Submit
      await modal.locator('button:has-text("Create Organisation")').click();
      await expect(page.getByText(org.name)).toBeVisible({ timeout: 40000 });
    }
  });
});



// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
