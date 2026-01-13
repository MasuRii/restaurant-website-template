import { test, expect } from '@playwright/test';

test.describe('Order Online Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens and closes via desktop header button', async ({ page }) => {
    // Check if desktop button is visible (viewport size might need adjustment if default is mobile)
    // Playwright defaults to desktop usually, but let's be safe
    await page.setViewportSize({ width: 1280, height: 720 });

    const orderBtn = page.locator('#order-online-btn');
    await expect(orderBtn).toBeVisible();
    await orderBtn.click();

    const modal = page.locator('div[role="dialog"][aria-labelledby="order-modal-title"]');
    await expect(modal).toBeVisible();
    await expect(page.locator('#order-modal-title')).toContainText('Order Online');

    // Close button
    const closeBtn = modal.getByRole('button', { name: 'Close' });
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('toggles between delivery and pickup tabs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.locator('#order-online-btn').click();
    
    const modal = page.locator('div[role="dialog"]');
    
    // Default tab is Delivery
    await expect(modal.getByText('Delivery Partners')).toBeVisible();
    await expect(modal.getByText('UberEats')).toBeVisible();

    // Switch to Pickup
    await modal.getByRole('button', { name: 'Pickup' }).click();
    await expect(modal.getByText('Select Pickup Time')).toBeVisible();
    await expect(modal.getByText('As soon as possible')).toBeVisible();

    // Switch back to Delivery
    await modal.getByRole('button', { name: 'Delivery' }).click();
    await expect(modal.getByText('Delivery Partners')).toBeVisible();
  });

  test('mobile menu trigger works', async ({ page }) => {
    // Mobile Viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open Mobile Menu
    await page.getByRole('button', { name: /open main menu/i }).click();
    
    const mobileOrderBtn = page.locator('#mobile-order-btn');
    await expect(mobileOrderBtn).toBeVisible();
    await mobileOrderBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
  });
});
