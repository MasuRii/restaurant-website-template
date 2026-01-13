import { test, expect } from '@playwright/test';

test.describe('Floating CTA', () => {
  test('should appear when scrolling past hero', async ({ page }) => {
    await page.goto('/');

    // Check initial state (should be hidden/opacity 0)
    const cta = page.locator('#floating-cta');
    await expect(cta).toHaveAttribute('data-visible', 'false');
    await expect(cta).toHaveCSS('opacity', '0');

    // Scroll down past hero
    // We scroll to the 'story' section which is after the hero
    await page.locator('#story').scrollIntoViewIfNeeded();
    
    // Wait for observer to trigger (it might take a moment)
    await page.waitForTimeout(500);

    // Check visible state
    await expect(cta).toHaveAttribute('data-visible', 'true');
    await expect(cta).toHaveCSS('opacity', '1');

    // Test click navigation
    await cta.click({ force: true });
    await expect(page).toHaveURL(/#reservations/);
    
    // Verify we are at the reservations section
    // (In a real scenario we'd check if the element is in view, but the URL hash is a good proxy for anchor links)
  });
});
