import { test, expect } from '@playwright/test';

test.describe('RTL layout — Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'ar');
    });
    // Disable JS-driven animations (Framer Motion respects prefers-reduced-motion via MotionConfig)
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('navbar RTL at 1440px desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('html[dir="rtl"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    // Capture just the navbar for a focused layout check
    const navbar = page.locator('header').first();
    await expect(navbar).toHaveScreenshot('navbar-rtl-1440.png');
  });

  test('mobile menu RTL at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForSelector('html[dir="rtl"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    // Open the mobile menu before capturing
    const hamburger = page.locator('button[aria-label]').first();
    await hamburger.click();
    await page.waitForTimeout(400); // Allow AnimatePresence animation to complete
    await expect(page).toHaveScreenshot('mobile-menu-rtl-390.png');
  });
});
