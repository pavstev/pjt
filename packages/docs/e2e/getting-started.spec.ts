import { expect, test } from '@playwright/test';

test.describe('Stranica Prvi koraci', () => {
  test('se učitava i prikazuje sadržaj', async ({ page }) => {
    await page.goto('/docs/getting-started');

    await expect(page.locator('main h1').first()).toContainText('Prvi koraci sa pjt');
    await expect(page.getByText('pjt je moćan cross-platform CLI alat')).toBeVisible();
    await expect(page.locator('main h2').first()).toContainText('Preduslovi');
  });
});