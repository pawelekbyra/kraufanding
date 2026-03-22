import { test, expect } from '@playwright/test';

test('homepage visual verification', async ({ page }) => {
  // Set window size for desktop view
  await page.setViewportSize({ width: 1280, height: 1200 });

  // Go to homepage with no wait
  const response = await page.goto('http://localhost:3000');
  console.log('Status:', response?.status());

  // Wait 5 seconds for hydration and rendering
  await page.waitForTimeout(5000);

  // Get page content
  const content = await page.content();
  console.log('Content length:', content.length);
  if (content.length < 500) {
      console.log('Page content:', content);
  }

  // Take a screenshot of the new UI
  await page.screenshot({ path: 'verification/polutek_homepage.png', fullPage: true });
});
