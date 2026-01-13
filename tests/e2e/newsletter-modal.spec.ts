import { test, expect } from '@playwright/test';

test.describe('Newsletter Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to ensure modal can show
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('appears on exit intent', async ({ page }) => {
    // Wait for hydration (client:idle)
    await page.waitForTimeout(2000);

    // Simulate mouse leaving the window upwards via event dispatch
    // Note: page.mouse.move usually works but dispatchEvent is more reliable for "intent" logic tests
    await page.evaluate(() => {
      document.dispatchEvent(new MouseEvent('mouseleave', { clientY: -10 }));
    });

    const modal = page.getByRole('heading', { name: 'A Gift from the Kitchen' });
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('closes when clicking close button', async ({ page }) => {
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      document.dispatchEvent(new MouseEvent('mouseleave', { clientY: -10 }));
    });

    const modalHeading = page.getByRole('heading', { name: 'A Gift from the Kitchen' });
    await expect(modalHeading).toBeVisible();

    await page.getByLabel('Close modal').click();
    await expect(modalHeading).not.toBeVisible();
  });

  test('saves preference to localStorage', async ({ page }) => {
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      document.dispatchEvent(new MouseEvent('mouseleave', { clientY: -10 }));
    });

    // Check "Don't show again"
    await page.getByLabel("Don't show this again").check();
    
    // Close
    await page.getByLabel('Close modal').click();

    // Verify localStorage
    const dismissed = await page.evaluate(() => localStorage.getItem('newsletter_dismissed'));
    expect(dismissed).toBe('true');

    // Reload and try to trigger again
    await page.reload();
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      document.dispatchEvent(new MouseEvent('mouseleave', { clientY: -10 }));
    });

    const modalHeading = page.getByRole('heading', { name: 'A Gift from the Kitchen' });
    await expect(modalHeading).not.toBeVisible();
  });
});
