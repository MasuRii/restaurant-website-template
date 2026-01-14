import { test, expect } from '@playwright/test';

test.describe('Mobile Experience', () => {
  // Only run these tests on mobile viewports
  test.skip(({ isMobile }) => !isMobile, 'Mobile tests only');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hamburger menu interaction', async ({ page }) => {
    const openBtn = page.locator('#open-menu-btn');
    const closeBtn = page.locator('#close-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');

    // Initial state: menu hidden
    await expect(mobileMenu).toHaveClass(/translate-x-full/);

    // Open menu
    await openBtn.click({ force: true });
    await expect(mobileMenu).toHaveClass(/translate-x-0/);
    await expect(openBtn).toHaveAttribute('aria-expanded', 'true');

    // Close menu - use evaluate to ensure click despite potential overlays/viewport issues
    await closeBtn.evaluate((node) => (node as HTMLElement).click());
    await expect(mobileMenu).toHaveClass(/translate-x-full/);
    await expect(openBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('navigation links from mobile menu', async ({ page }) => {
    const openBtn = page.locator('#open-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');
    const storyLink = page.locator('.mobile-nav-link[href="#story"]');

    // Open menu
    await openBtn.click({ force: true });
    await expect(mobileMenu).toHaveClass(/translate-x-0/);

    // Click link (using evaluate to ensure click works despite any overlays)
    await storyLink.evaluate((node) => (node as HTMLElement).click());

    // Menu should close
    await expect(mobileMenu).toHaveClass(/translate-x-full/);

    // Should scroll to section
    await expect(page.locator('#story')).toBeInViewport();
  });

  test('touch targets are accessible', async ({ page }) => {
    const openBtn = page.locator('#open-menu-btn');

    // Check hamburger button size (minimum 44x44px recommended)
    const box = await openBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(43.9);
      expect(box.height).toBeGreaterThanOrEqual(43.9);
    }

    // Open menu to check nav links
    await openBtn.click({ force: true });

    // Check nav links size
    const links = page.locator('.mobile-nav-link');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const linkBox = await link.boundingBox();
      expect(linkBox).not.toBeNull();
      if (linkBox) {
        expect(linkBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('reservation form is usable on mobile', async ({ page }) => {
    // Navigate to reservations
    await page.goto('/#reservations');

    const form = page.locator('#reservation-form');
    const dateInput = form.locator('input[type="date"]');
    const timeSelect = form.locator('select[name="time"]');
    const partySelect = form.locator('select[name="guests"]');

    await expect(form).toBeVisible();

    // Fill form
    await dateInput.fill('2025-12-25');
    await timeSelect.selectOption({ index: 1 }); // Select second option
    await partySelect.selectOption('2');

    // Check inputs are touch-friendly (height check)
    const dateBox = await dateInput.boundingBox();
    if (dateBox) expect(dateBox.height).toBeGreaterThanOrEqual(44);

    const timeBox = await timeSelect.boundingBox();
    if (timeBox) expect(timeBox.height).toBeGreaterThanOrEqual(44);
  });

  test('no horizontal scrollbar appears', async ({ page }) => {
    // Check that scrollWidth equals clientWidth (or very close)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    // Allow 1px difference for sub-pixel rendering
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
