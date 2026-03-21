import { test, expect } from '@playwright/test';

test('homepage visual verification', async ({ page }) => {
  // Set window size for desktop view
  await page.setViewportSize({ width: 1280, height: 1200 });

  // Go to homepage with no wait
  await page.goto('http://localhost:3001');

  // Wait 10 seconds for hydration and rendering
  await page.waitForTimeout(10000);

  // Take a screenshot of the new UI
  await page.screenshot({ path: '/home/jules/verification/polutek_homepage.png', fullPage: true });
});
