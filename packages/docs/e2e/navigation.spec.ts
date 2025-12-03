import { expect, test } from '@playwright/test';

test.describe('Navigacija', () => {
  test('bočna navigacija radi', async ({ page }) => {
    await page.goto('/');

    // Navigiraj do Prvi koraci preko bočne navigacije
    const gettingStartedLink = page.locator('aside a[href="/docs/getting-started/"]');
    void (await gettingStartedLink.click());
    expect(page.url()).toContain('/docs/getting-started');

    // Navigiraj do Vodiči preko bočne navigacije
    const guidesLink = page.locator('aside a[href="/docs/guides/"]');
    void (await guidesLink.click());
    expect(page.url()).toContain('/docs/guides');

    // Vrati se na Početnu
    const homeLink = page.locator('aside a[href="/"]');
    void (await homeLink.click());
    expect(page).toHaveURL('http://localhost:4321/');
  });
});