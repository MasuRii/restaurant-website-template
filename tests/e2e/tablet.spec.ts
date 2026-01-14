import { test, expect } from '@playwright/test';

test.describe('Tablet Viewport Tests', () => {
  // Reliance on project config for viewport settings

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Navigation displays correctly (Desktop Nav)', async ({ page }) => {
    // iPad Gen 7 is 810px wide, which is > 768px (md breakpoint)
    // So desktop navigation should be visible
    const desktopNav = page.locator('nav.md\\:flex');
    await expect(desktopNav).toBeVisible();

    // Mobile menu button should be hidden
    const mobileMenuBtn = page.locator('#open-menu-btn');
    await expect(mobileMenuBtn).toBeHidden();
  });

  test('Two-column layouts render properly', async ({ page }) => {
    // About section grid should be 2 columns at this width
    const aboutSection = page.locator('#story');
    await aboutSection.scrollIntoViewIfNeeded();

    const grid = aboutSection.locator('.grid').first();

    // Check computed grid columns
    const gridTemplateColumns = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should be 2 columns (e.g., "384px 384px")
    const columns = gridTemplateColumns.split(' ').length;
    expect(columns).toBe(2);
  });

  test('Gallery grid shows appropriate number of columns', async ({ page }) => {
    const gallerySection = page.locator('#gallery');
    await gallerySection.scrollIntoViewIfNeeded();

    const grid = gallerySection.locator('.grid').first();

    // Check computed grid columns
    const gridTemplateColumns = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // At md (768px) and up, it uses md:grid-cols-3
    // iPad Gen 7 is 810px, so it should be 3 columns
    const columns = gridTemplateColumns.split(' ').length;
    expect(columns).toBe(3);
  });

  test('Reservation form layout adaptation', async ({ page }) => {
    const reservationSection = page.locator('#reservations');
    await reservationSection.scrollIntoViewIfNeeded();

    // Check if the form container grids adapt correctly
    // First grid (Date, Time, Guests) should be 3 columns on tablet/desktop
    const firstGrid = reservationSection.locator('.grid').nth(0);

    if (await firstGrid.isVisible()) {
      const gridTemplateColumns = await firstGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      // Should be 3 columns (Date, Time, Guests)
      const columns = gridTemplateColumns.split(' ').length;
      expect(columns).toBe(3);
    }

    // Second grid (Name, Email) should be 2 columns
    const secondGrid = reservationSection.locator('.grid').nth(1);
    if (await secondGrid.isVisible()) {
      const gridTemplateColumns = await secondGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      // Should be 2 columns
      const columns = gridTemplateColumns.split(' ').length;
      expect(columns).toBe(2);
    }
  });
});
