import { test, expect } from '@playwright/test';

/**
 * Mobile menu navigation tests.
 *
 * Key selector strategy: target links inside `nav[aria-label="Mobile navigation"]`
 * to avoid ambiguity with the hidden desktop navbar links that share the same href.
 */

const MOBILE = { width: 390, height: 844 };

function mobileLink(page: import('@playwright/test').Page, href: string) {
  return page.locator(`nav[aria-label="Mobile navigation"] a[href="${href}"]`);
}

test.describe('Mobile menu navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('hamburger opens full-screen menu with all nav links', async ({ page }) => {
    await page.click('button[aria-label="Open menu"]');
    const nav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(nav).toBeVisible({ timeout: 3000 });

    // All 5 links present
    const links = nav.locator('a');
    await expect(links).toHaveCount(5);
  });

  test('nav links are visible after animation completes', async ({ page }) => {
    await page.click('button[aria-label="Open menu"]');
    await page.waitForTimeout(700); // let stagger animation finish

    for (const href of ['/', '/services', '/academy', '/about', '/contact']) {
      await expect(mobileLink(page, href)).toBeVisible();
    }
  });

  test('clicking Services navigates correctly', async ({ page }) => {
    await page.click('button[aria-label="Open menu"]');
    await page.waitForTimeout(500);
    await mobileLink(page, '/services').click();
    await expect(page).toHaveURL(`/services`, { timeout: 4000 });
  });

  test('clicking Academy navigates correctly', async ({ page }) => {
    await page.click('button[aria-label="Open menu"]');
    await page.waitForTimeout(500);
    await mobileLink(page, '/academy').click();
    await expect(page).toHaveURL(`/academy`, { timeout: 4000 });
  });

  test('clicking Contact navigates correctly', async ({ page }) => {
    await page.click('button[aria-label="Open menu"]');
    await page.waitForTimeout(500);
    await mobileLink(page, '/contact').click();
    await expect(page).toHaveURL(`/contact`, { timeout: 4000 });
  });

  test('menu closes after navigation', async ({ page }) => {
    await page.click('button[aria-label="Open menu"]');
    await page.waitForTimeout(500);
    await mobileLink(page, '/services').click();
    await expect(page).toHaveURL(`/services`, { timeout: 4000 });

    // Panel should animate out and hamburger become visible again
    await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('nav[aria-label="Mobile navigation"]')).not.toBeVisible({ timeout: 1000 });
  });

  test('RTL Arabic mode: menu covers full screen and links are visible', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'ar'));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('html[dir="rtl"]');

    await page.click('button[aria-label="Open menu"]');
    await page.waitForTimeout(700);

    const nav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(nav).toBeVisible();

    // All 5 links visible in RTL mode
    await expect(nav.locator('a')).toHaveCount(5);

    // Close button must be present
    await expect(page.locator('button[aria-label="Close menu"]')).toBeVisible();
  });
});
