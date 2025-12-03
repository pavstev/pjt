import { expect, test } from '@playwright/test';

 

test.describe('Homepage', () => {
  test('has correct title and content', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/pjt/);
    await expect(page.locator('main h1').first()).toContainText('Welcome to pjt');
    await expect(page.locator('main em').first()).toContainText('Powerful cross-platform CLI tool for maintaining clean Git repositories');
  });
});

test.describe('Getting Started Page', () => {
  test('loads and displays content', async ({ page }) => {
    await page.goto('/docs/getting-started');

    await expect(page.locator('main h1').first()).toContainText('Getting Started');
    await expect(page.getByText('Learn how to install and use pjt')).toBeVisible();
    await expect(page.locator('main h2').first()).toContainText('Prerequisites');
  });
});

test.describe('Guides Page', () => {
  test('loads and displays content', async ({ page }) => {
    await page.goto('/docs/guides/');

    await expect(page.locator('main h1').first()).toContainText('Guides');
    await expect(page.getByText('Welcome to the pjt guides section')).toBeVisible();
    await expect(page.locator('main h2').first()).toContainText('Available Guides');
  });
});

test.describe('Navigation', () => {
  test('sidebar navigation works', async ({ page }) => {
    await page.goto('/');

    // Navigate to Getting Started via sidebar
    const gettingStartedLink = page.locator('aside a[href="/docs/getting-started/"]');
    void (await gettingStartedLink.click());
    await expect(page.url()).toContain('/docs/getting-started');

    // Navigate to Guides via sidebar
    const guidesLink = page.locator('aside a[href="/docs/guides/"]');
    void (await guidesLink.click());
    await expect(page.url()).toContain('/docs/guides');

    // Navigate back to Home
    const homeLink = page.locator('aside a[href="/"]');
    void (await homeLink.click());
    await expect(page).toHaveURL('http://localhost:4321/');
  });
});