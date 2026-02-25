import { test, expect } from '@playwright/test';

test.describe('RTL layout — Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Set Arabic locale — matches i18next lookupLocalStorage key in src/i18n/config.ts
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'ar');
    });
    // Disable JS-driven animations (Framer Motion respects prefers-reduced-motion via MotionConfig)
    // This prevents StatCounter and entrance animations from causing unstable screenshots
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('homepage RTL at 390px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForSelector('html[dir="rtl"]', { timeout: 5000 });
    // Ensure hero background image and all assets finish loading before snapshot
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-rtl-390.png');
  });

  test('homepage RTL at 1440px desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('html[dir="rtl"]', { timeout: 5000 });
    // Ensure hero background image and all assets finish loading before snapshot
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-rtl-1440.png');
  });
});
