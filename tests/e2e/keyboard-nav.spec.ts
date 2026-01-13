import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be ready and avoid Astro Dev Toolbar interference
    await expect(page.locator('#main-header')).toBeVisible();
  });

  test('should tab from start to reservation form', async ({ page }) => {
    // 1. Focus body to start
    await page.focus('body');

    // 2. Tab repeatedly until we hit the reservation date input
    // This verifies the path is unbroken (no focus traps preventing reaching the form)
    let focusedReservation = false;

    // We limit iterations to prevent infinite loops, but 50-60 should be enough for a single page app
    // unless there are massive amounts of links.
    for (let i = 0; i < 150; i++) {
      await page.keyboard.press('Tab');
      const activeId = await page.evaluate(() => document.activeElement?.id);
      if (activeId === 'date') {
        focusedReservation = true;
        break;
      }
    }
    expect(
      focusedReservation,
      'Should eventually tab focus to the reservation date input from the top of the page'
    ).toBe(true);
  });

  test('verify logical focus order in reservation form', async ({ page }) => {
    // Scroll to reservations
    await page.locator('#reservations').scrollIntoViewIfNeeded();

    // Focus the first element
    await page.locator('#date').focus();
    await expect(page.locator('#date')).toBeFocused();

    // Helper to tab through potentially complex inputs (like date pickers)
    const tabToNext = async (nextSelector: string) => {
      // Chrome/Firefox date pickers can have up to 3-4 internal tab stops (day, month, year, calendar button)
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        const isFocused = await page
          .locator(nextSelector)
          .evaluate((node) => document.activeElement === node);
        if (isFocused) return;
      }
      await expect(page.locator(nextSelector)).toBeFocused();
    };

    await tabToNext('#time');
    await tabToNext('#guests');
    await tabToNext('#name');
    await tabToNext('#email');
    await tabToNext('#phone');
    await tabToNext('#requests');

    await page.keyboard.press('Tab');
    const submitBtn = page.locator('#reservations button[type="submit"]');
    await expect(submitBtn, 'Tab from requests should go to submit button').toBeFocused();
  });

  test('Enter/Space activates interactive elements', async ({ page }) => {
    // Test the "Reserve a Table" CTA in the header
    const reserveBtn = page
      .locator('header a[href="#reservations"]')
      .filter({ hasText: /reserve/i })
      .first();

    if (await reserveBtn.isVisible()) {
      await reserveBtn.focus();
      await expect(reserveBtn).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/.*#reservations/);
    } else {
      // Mobile menu toggle
      const menuBtn = page.locator('#open-menu-btn');
      if (await menuBtn.isVisible()) {
        await menuBtn.focus();
        await page.keyboard.press('Enter');

        // Wait for menu to slide in
        const mobileMenu = page.locator('#mobile-menu');
        await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');

        // Close it back
        await page.keyboard.press('Escape');

        // Wait for menu to close (slide out)
        await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
      }
    }
  });
});
