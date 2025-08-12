import { test, expect } from '@playwright/test'

test('should register John Nobela', async ({ page }) => {
  await page.goto(`${process.env.NEXT_PUBLIC_URL}/register`)

  await page.getByTestId('input-name').fill('John')
  await page.getByTestId('input-last-name').fill('Nobela')
  await page.getByTestId('input-email').fill('john@gmail.com')
  await page.getByTestId('input-password').fill('password')
  await page.getByTestId('input-password-confirmation').fill('password')

  await page.getByTestId('register-button').click()

  await expect(page).toHaveURL(/.*dashboard/)
})
