import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop nav links scroll to correct sections', async ({ page, isMobile }) => {
    if (isMobile) test.skip();

    // Verify "Story" link scrolls to #story
    const storyLink = page.locator('.desktop-nav-link[href="#story"]');
    await expect(storyLink).toBeVisible();
    await storyLink.click();
    await expect(page.locator('#story')).toBeInViewport();

    // Verify "Private Dining" link scrolls to #events
    const eventsLink = page.locator('.desktop-nav-link[href="#events"]');
    await expect(eventsLink).toBeVisible();
    await eventsLink.click();
    await expect(page.locator('#events')).toBeInViewport();

    // Verify "Location" link scrolls to #location
    const locationLink = page.locator('.desktop-nav-link[href="#location"]');
    await expect(locationLink).toBeVisible();
    await locationLink.click();
    await expect(page.locator('#location')).toBeInViewport();

    // Check Menu link exists in desktop nav
    // Target the desktop nav specifically to avoid strict mode violations
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    const menuLink = desktopNav.getByRole('link', { name: 'Menu' });
    await expect(menuLink).toHaveAttribute('href', '/menu');
  });

  test('mobile hamburger menu opens and closes', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    const openBtn = page.locator('#open-menu-btn');
    const closeBtn = page.locator('#close-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');

    // Menu should be hidden initially (off-screen)
    // Note: Playwright's toBeVisible() considers transformed elements visible,
    // so we check for the translation class
    await expect(mobileMenu).toHaveClass(/translate-x-full/);

    // Open menu
    await openBtn.click({ force: true });
    // Wait for animation class change
    await expect(mobileMenu).toHaveClass(/translate-x-0/);
    await expect(openBtn).toHaveAttribute('aria-expanded', 'true');

    // Wait for the close button to be stable/visible
    await expect(closeBtn).toBeVisible();

    // Close menu - force click using JS evaluation to bypass viewport checks
    // which can be flaky on mobile emulation with full-screen fixed overlays
    await closeBtn.evaluate((node) => (node as HTMLElement).click());

    await expect(mobileMenu).toHaveClass(/translate-x-full/);
    await expect(openBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile nav links work and close menu', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    const openBtn = page.locator('#open-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');
    // Use the specific class for mobile links
    const storyLink = page.locator('.mobile-nav-link[href="#story"]');

    // Open menu
    await openBtn.click({ force: true });
    await expect(mobileMenu).toHaveClass(/translate-x-0/);

    // Click link
    // Ensure the link is interactable
    await expect(storyLink).toBeVisible();

    // Force click using JS evaluation
    await storyLink.evaluate((node) => (node as HTMLElement).click());

    // Menu should close
    await expect(mobileMenu).toHaveClass(/translate-x-full/);

    // Should scroll to section
    await expect(page.locator('#story')).toBeInViewport();
  });

  test('sticky header remains visible on scroll', async ({ page }) => {
    const header = page.locator('#main-header');

    // Initial state
    await expect(header).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));

    // Header should still be visible (sticky)
    await expect(header).toBeVisible();

    // Check for style changes indicating scroll state (border/bg)
    // The script adds border-primary/10 and bg-background/80
    await expect(header).toHaveClass(/border-primary\/10/);
  });

  test('"Reserve a Table" CTA is accessible', async ({ page, isMobile }) => {
    if (isMobile) {
      const openBtn = page.locator('#open-menu-btn');
      await openBtn.click({ force: true });

      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toHaveClass(/translate-x-0/);

      const mobileCta = mobileMenu.getByRole('link', { name: 'Reserve a Table' });
      await expect(mobileCta).toBeVisible();
      await expect(mobileCta).toHaveAttribute('href', '#reservations');
    } else {
      // Target the desktop button specifically
      const desktopCta = page.locator('a.hidden.md\\:inline-flex', { hasText: 'Reserve a Table' });
      await expect(desktopCta).toBeVisible();
      await expect(desktopCta).toHaveAttribute('href', '#reservations');
    }
  });
});
