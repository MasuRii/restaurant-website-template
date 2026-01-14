import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
  test('should display 404 page for non-existent routes', async ({ page }) => {
    // Navigate to a non-existent page
    const response = await page.goto('/non-existent-page-12345');

    // Note: in some dev environments, the status might be 200 if it serves a fallback,
    // but Astro usually handles 404s correctly.
    // We'll check the content primarily.

    // Verify page content
    const main = page.locator('main');
    await expect(main.locator('h1')).toHaveText(/Off the Map/i);
    await expect(main.getByText(/wandered off the path/i)).toBeVisible();

    // Verify buttons
    const homeBtn = main.getByRole('link', { name: /Return Home/i });
    const reserveBtn = main.getByRole('link', { name: /Reserve a Table/i });

    await expect(homeBtn).toBeVisible();
    await expect(reserveBtn).toBeVisible();

    // Verify navigation back to home
    await homeBtn.click();
    await expect(page).toHaveURL(/\/$/);
  });
});
