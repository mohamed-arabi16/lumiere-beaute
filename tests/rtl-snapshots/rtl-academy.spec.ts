import { test, expect } from '@playwright/test';

test.describe('RTL layout — Academy', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'ar');
    });
    // Disable JS-driven animations (Framer Motion respects prefers-reduced-motion via MotionConfig)
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('academy RTL at 390px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/academy');
    await page.waitForSelector('html[dir="rtl"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('academy-rtl-390.png');
  });

  test('academy RTL at 1440px desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/academy');
    await page.waitForSelector('html[dir="rtl"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('academy-rtl-1440.png');
  });
});
