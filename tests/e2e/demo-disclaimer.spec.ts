import { test, expect } from '@playwright/test';

const strings = {
  demoDisclaimer: {
    title: "This is a Demo Website",
    description: "You are viewing a sample restaurant website template. The link you clicked is a placeholder and does not lead to a real destination. This restaurant (Risū & Oak) is fictional and created for demonstration purposes only.",
    iUnderstand: "I Understand",
    dontShowAgain: "Don't show this again"
  }
};

test.describe('Demo Disclaimer Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle'); // Ensure hydration
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
  });

  test('should appear when clicking an external social link', async ({ page }) => {
    // Scroll to footer to make links visible/clickable
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();

    // Find the Instagram link (or any social link)
    const instagramLink = page.getByRole('contentinfo').locator('a[href*="instagram.com"]');
    await expect(instagramLink).toBeVisible();
    
    // Allow a small pause for any final hydration/event binding
    await page.waitForTimeout(500);

    // Click the link
    await instagramLink.click();

    // Verify modal appears
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(strings.demoDisclaimer.title);

    // Verify content
    await expect(page.getByText(strings.demoDisclaimer.description)).toBeVisible();
  });

  test('should close when clicking "I Understand"', async ({ page }) => {
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.getByRole('contentinfo').locator('a[href*="instagram.com"]').click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Click "I Understand"
    await page.getByRole('button', { name: strings.demoDisclaimer.iUnderstand }).click();

    // Verify modal is gone
    await expect(modal).not.toBeVisible();
  });

  test('should persist "Don\'t show again" preference', async ({ page }) => {
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // First click - show modal
    await page.getByRole('contentinfo').locator('a[href*="instagram.com"]').click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Check "Don't show again"
    await page.getByLabel(strings.demoDisclaimer.dontShowAgain).check();

    // Close modal
    await page.getByRole('button', { name: strings.demoDisclaimer.iUnderstand }).click();
    await expect(modal).not.toBeVisible();

    // Verify localStorage was updated
    const isDismissed = await page.evaluate(() => localStorage.getItem('demo_disclaimer_dismissed'));
    expect(isDismissed).toBe('true');

    // Reload page to simulate new session/ensure persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();

    // Click again - should NOT show modal
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('contentinfo').locator('a[href*="instagram.com"]').click()
    ]);
    
    expect(newPage).toBeDefined();
    await newPage.close();
    
    // Verify modal is NOT visible on original page
    await expect(modal).not.toBeVisible();
  });
});
