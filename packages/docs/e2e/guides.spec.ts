import { expect, test } from '@playwright/test';

test.describe('Stranica Vodiči', () => {
  test('se učitava i prikazuje sadržaj', async ({ page }) => {
    await page.goto('/docs/guides/');

    await expect(page.locator('main h1').first()).toContainText('Vodiči');
    await expect(page.getByText('Dobrodošli u sekciju vodiča za pjt')).toBeVisible();
    await expect(page.locator('main h2').first()).toContainText('Dostupni vodiči');
  });

  test('CLI vodič se učitava', async ({ page }) => {
    await page.goto('/docs/guides/cli');

    await expect(page.locator('main h1').first()).toContainText('CLI Interfejs');
    await expect(page.getByText('pjt CLI je dizajniran da bude jednostavan za korišćenje')).toBeVisible();
  });

  test('ESLint vodič se učitava', async ({ page }) => {
    await page.goto('/docs/guides/eslint');

    await expect(page.locator('main h1').first()).toContainText('ESLint Konfiguracija');
    await expect(page.getByText('pjt dolazi sa fleksibilnim ESLint konfiguracijama')).toBeVisible();
  });

  test('Prettier vodič se učitava', async ({ page }) => {
    await page.goto('/docs/guides/prettier');

    await expect(page.locator('main h1').first()).toContainText('Prettier Konfiguracija');
    await expect(page.getByText('pjt pruža Prettier konfiguracije')).toBeVisible();
  });

  test('Core utilities vodič se učitava', async ({ page }) => {
    await page.goto('/docs/guides/core');

    await expect(page.locator('main h1').first()).toContainText('Core Utilities');
    await expect(page.getByText('Core utilities su srce pjt alata')).toBeVisible();
  });

  test('Napredne funkcije vodič se učitava', async ({ page }) => {
    await page.goto('/docs/guides/advanced');

    await expect(page.locator('main h1').first()).toContainText('Napredne funkcije');
    await expect(page.getByText('Otkrijte napredne mogućnosti pjt alata')).toBeVisible();
  });
});