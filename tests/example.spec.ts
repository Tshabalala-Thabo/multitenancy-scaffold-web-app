import { test, expect } from '@playwright/test';

test.describe('Organisation Management Single Flow', () => {
  test('Complete organisation creation flow with validations, admins, and logo upload', async ({ page }) => {
    // Clear cookies before starting
    await page.context().clearCookies();

    // 1. Login as super admin
    await page.goto('http://localhost:3001/login');
    await page.getByTestId('email-input').fill('super@admin.com');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('remember-checkbox').check();
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Navigate to organisations page
    await page.goto('http://localhost:3001/organisations');
    await expect(page).toHaveURL(/organisations/);
    await expect(page.getByRole('heading', { name: 'Organisations' })).toBeVisible();
    await expect(page.getByText('Manage all organisations in your multi-tenant application')).toBeVisible();

    // 3. Open create organisation modal
    await page.click('button:has-text("Create Organisation")');
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Create New Organisation')).toBeVisible();

    // 4. Try submitting empty form for validation
    await modal.locator('button:has-text("Create Organisation")').click();

    // Check required field validations on all tabs
    await expect(modal.locator('text="Name is required"')).toBeVisible();
    await expect(modal.locator('text="Slug is required"')).toBeVisible();

    await modal.locator('button[role="tab"]:has-text("Address")').click();
    await expect(modal.locator('text="Street address is required"')).toBeVisible();
    await expect(modal.locator('text="Suburb is required"')).toBeVisible();
    await expect(modal.locator('text="City is required"')).toBeVisible();
    await expect(modal.locator('text="Province is required"')).toBeVisible();
    await expect(modal.locator('text="Postal code is required"')).toBeVisible();

    await modal.locator('button[role="tab"]:has-text("Administrators")').click();
    await expect(modal.locator('text="Administrator name is required"')).toBeVisible();
    await expect(modal.locator('text="Administrator email is required"')).toBeVisible();
    await expect(modal.locator('text="Password is required"')).toBeVisible();

    // 5. Fill organisation basic info
    await modal.locator('button[role="tab"]:has-text("Basic info")').click();
    await modal.locator('input[id="name"]').fill('Dawn Capital');
    await expect(modal.locator('input[id="slug"]')).toHaveValue('dawn-capital');
    await modal.locator('input[id="domain"]').fill('dawncapital.co.za');

    // Fill address info
    await modal.locator('button[role="tab"]:has-text("Address")').click();
    await modal.locator('input[id="street_address"]').fill('12 Olive Road');
    await modal.locator('input[id="suburb"]').fill('Pretoria North');
    await modal.locator('input[id="city"]').fill('Pretoria');
    await modal.locator('input[id="province"]').fill('Gauteng');
    await modal.locator('input[id="postal_code"]').fill('0002');

    // 6. Fill admin info with invalid email and short password to check validation TODO: implement this later
    await modal.locator('button[role="tab"]:has-text("Administrators")').click();
    await modal.locator('input[id="name_1"]').fill('Thando');
    await modal.locator('input[id="last_name_1"]').fill('Mabena');
    // await modal.locator('input[id="email_1"]').fill('invalid-email');
    // await modal.locator('input[id="password_1"]').fill('short');

    // await modal.locator('button:has-text("Create Organisation")').click();
    // await expect(modal.locator('text="invalid-email"')).toBeVisible();
    // await expect(modal.locator('text="Password must be at least 8 characters"')).toBeVisible();

    // Fix admin info
    await modal.locator('input[id="email_1"]').fill('thando@dawncapital.co.za');
    await modal.locator('input[id="password_1"]').fill('password');

    // 7. Add a second administrator
    await modal.locator('button:has-text("Add Another Administrator")').click();
    const adminForms = page.locator('[data-testid="admin-form"]');
    await expect(adminForms).toHaveCount(2);

    await modal.locator('input[id="name_2"]').fill('Second Admin');
    await modal.locator('input[id="last_name_2"]').fill('User');
    await modal.locator('input[id="email_2"]').fill('admin2@test.org');
    await modal.locator('input[id="password_2"]').fill('Password123!');

    // Remove second admin to test removal
    const removeButtons = modal.locator('[data-testid="remove-admin-button"]');
    await removeButtons.last().click();
    await expect(adminForms).toHaveCount(1);

    // 8. Upload a logo and verify preview
    await modal.locator('button[role="tab"]:has-text("Basic info")').click();
    const fileChooserPromise = page.waitForEvent('filechooser');
    await modal.locator('button:has-text("Upload Logo")').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/organisation-logos/dawn.png');
    await expect(modal.locator('img[alt="Logo preview"]')).toBeVisible();

    // Remove logo preview
    // await modal.locator('button:has-text("X")').first().click();
    // await expect(modal.locator('img[alt="Logo preview"]')).not.toBeVisible();

    // 9. Submit the organisation creation form
    await modal.locator('button:has-text("Create Organisation")').click();

    // 10. Verify organisation created and displayed in the list
    await expect(page.getByText('Test Organisation')).toBeVisible();
    await expect(page.getByText('admin@test.org')).toBeVisible();
  });
});


// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
