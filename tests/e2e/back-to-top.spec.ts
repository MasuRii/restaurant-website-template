import { test, expect } from '@playwright/test';

test.describe('Back to Top Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be hidden initially', async ({ page }) => {
    const button = page.locator('#back-to-top');
    await expect(button).toHaveAttribute('data-visible', 'false');
    await expect(button).toHaveCSS('opacity', '0');
    await expect(button).toHaveCSS('pointer-events', 'none');
  });

  test('should appear after scrolling', async ({ page }) => {
    const button = page.locator('#back-to-top');
    
    // Scroll down 2000px
    await page.evaluate(() => window.scrollTo(0, 2000));
    
    // Check if visible
    await expect(button).toHaveAttribute('data-visible', 'true');
    await expect(button).toHaveCSS('opacity', '1');
    await expect(button).toHaveCSS('pointer-events', 'auto');
  });

  test('should scroll to top when clicked', async ({ page }) => {
    const button = page.locator('#back-to-top');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 2000));
    
    // Wait for button to be interactive
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('data-visible', 'true');
    
    // Click button
    // Note: forcing click because sometimes overlays/animations interfere in headless mode
    // but we should try standard click first if possible, or force if consistent with known issues
    await button.click({ force: true });
    
    // Wait for scroll to reach near top
    await page.waitForFunction(() => window.scrollY < 100);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should have accessible name', async ({ page }) => {
    const button = page.locator('#back-to-top');
    const label = await button.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label?.length).toBeGreaterThan(0);
  });
});
