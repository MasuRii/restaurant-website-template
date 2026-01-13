import { test, expect } from '@playwright/test';

test.describe('Social Integrations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Footer social links are secure and correct', async ({ page }) => {
    const footer = page.locator('footer');
    const instagramLink = footer.getByRole('link', { name: 'Instagram' });
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/risuandoak');
    await expect(instagramLink).toHaveAttribute('target', '_blank');
    await expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');

    const tiktokLink = footer.getByRole('link', { name: 'TikTok' });
    await expect(tiktokLink).toBeVisible();
    await expect(tiktokLink).toHaveAttribute('href', 'https://tiktok.com/@risuandoak');
    await expect(tiktokLink).toHaveAttribute('target', '_blank');
    await expect(tiktokLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Instagram feed placeholder is visible', async ({ page }) => {
    const feedSection = page.locator('section').filter({ hasText: 'Follow the Journey' });
    await expect(feedSection).toBeVisible();
    
    // Check for "View on Instagram" link
    const viewLink = feedSection.getByRole('link', { name: 'View on Instagram' });
    await expect(viewLink).toBeVisible();
    await expect(viewLink).toHaveAttribute('target', '_blank');

    // Check for images
    const images = feedSection.locator('img');
    await expect(images).toHaveCount(6);
  });

  test('Menu items have share buttons', async ({ page }) => {
    // Navigate to menu section
    await page.goto('/#menu');
    
    // Wait for the menu section to be present
    const menuSection = page.locator('#menu');
    await expect(menuSection).toBeVisible();

    // The menu items are lazy loaded with client:visible
    // We need to ensure they are in view
    await menuSection.scrollIntoViewIfNeeded();

    // Wait for at least one menu item to render
    const menuItem = page.locator('#menu .group').first();
    // Increase timeout for hydration and animation
    await expect(menuItem).toBeVisible({ timeout: 10000 });

    // Hover to reveal button (if on desktop)
    await menuItem.hover();
    
    // Check first share button
    // Note: The buttons are aria-labeled "Share {Item Name}"
    // We'll just check for any share button within this item
    // Use .locator with specific selector to avoid ambiguity
    const shareButton = menuItem.locator('button[aria-label^="Share"]');
    
    // On mobile, hover might not work, but we can try to force click or just check presence
    // In this specific implementation, opacity is controlled by group-hover
    // On touch devices, tap usually triggers hover state
    
    // Force the opacity to 1 for testing purposes if hover is flaky
    await page.addStyleTag({ content: '.group button { opacity: 1 !important; visibility: visible !important; }' });
    
    await expect(shareButton).toBeVisible();

    // Test share functionality (clipboard fallback)
    // We expect the UI to update to the "check" state
    await shareButton.click();
    
    // The icon should change to a checkmark (polyline)
    const checkmark = shareButton.locator('svg polyline');
    await expect(checkmark).toBeVisible();
  });
});
