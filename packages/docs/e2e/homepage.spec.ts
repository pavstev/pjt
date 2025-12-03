import { expect, test } from '@playwright/test';

test.describe('Početna stranica', () => {
  test('ima tačan naslov i sadržaj', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/pjt/);
    await expect(page.locator('main h1').first()).toContainText('Dobrodošli u pjt');
    await expect(page.locator('main em').first()).toContainText('Moćan cross-platform CLI alat za održavanje čistih Git repozitorijuma');
  });
});