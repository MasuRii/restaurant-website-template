import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page title contains the restaurant name
  // Note: Adjust the expected title based on actual implementation if needed
  await expect(page).toHaveTitle(/Risū & Oak|Restaurant/i);
  
  // Check for main element to ensure content loaded
  await expect(page.locator('main')).toBeVisible();
});
