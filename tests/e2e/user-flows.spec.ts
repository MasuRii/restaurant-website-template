import { test, expect } from '@playwright/test';

test.describe('User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Flow 1: Landing -> Browse Menu -> Make Reservation (happy path)', async ({
    page,
    isMobile,
  }) => {
    // 1. Landing
    await expect(page).toHaveTitle(/Risū & Oak/);

    // 2. Browse Menu
    if (isMobile) {
      const openBtn = page.locator('#open-menu-btn');
      await expect(openBtn).toBeVisible();
      await openBtn.click({ force: true });

      const menuLink = page.locator('.mobile-nav-link[href="#menu"]');
      await expect(menuLink).toBeVisible();
      await menuLink.evaluate((node) => (node as HTMLElement).click());
    } else {
      const menuLink = page.locator('nav.hidden.md\\:flex a[href="#menu"]');
      await expect(menuLink).toBeVisible();
      await menuLink.click();
    }

    // Verify we arrived at the menu section
    const menuSection = page.locator('#menu');
    await expect(menuSection).toBeInViewport();

    // 3. Make Reservation from Sticky Header
    if (isMobile) {
      // Open menu again to find reservation link
      const openBtn = page.locator('#open-menu-btn');
      await openBtn.click({ force: true });
      const reserveLink = page.locator('#mobile-menu a[href="#reservations"]');
      await expect(reserveLink).toBeVisible();
      await reserveLink.evaluate((node) => (node as HTMLElement).click());
    } else {
      const reserveBtn = page.locator('header .hidden.md\\:inline-flex[href="#reservations"]');
      await expect(reserveBtn).toBeVisible();
      await reserveBtn.click();
    }

    // 4. Fill Reservation Form
    const reservationsSection = page.locator('#reservations');
    await expect(reservationsSection).toBeInViewport();

    await page.locator('#date').fill('2026-12-25');
    await page.locator('#time').selectOption('7:00 PM');
    await page.locator('#guests').selectOption('2');
    await page.locator('#name').fill('Flow Test User');
    await page.locator('#email').fill('flow@example.com');
    await page.locator('#phone').fill('555-000-0000');

    // 5. Submit
    const submitBtn = page.getByRole('button', { name: 'Request Reservation' });
    // Wait a bit for validation state to settle
    await page.waitForTimeout(500);
    await submitBtn.click({ force: true });

    // 6. Verify Success
    await expect(page.getByRole('heading', { name: 'Confirmed' })).toBeVisible({ timeout: 15000 });
  });

  test('Flow 2: Landing -> View Gallery -> Read About -> Make Reservation', async ({
    page,
    isMobile,
  }) => {
    // 1. Landing -> Gallery
    const gallerySection = page.locator('#gallery');
    await gallerySection.scrollIntoViewIfNeeded();
    await expect(gallerySection).toBeInViewport();

    // 2. Read About (#story)
    if (isMobile) {
      const openBtn = page.locator('#open-menu-btn');
      await openBtn.click({ force: true });
      const storyLink = page.locator('.mobile-nav-link[href="#story"]');
      await storyLink.evaluate((node) => (node as HTMLElement).click());
    } else {
      const storyLink = page.locator('nav.hidden.md\\:flex a[href="#story"]');
      await storyLink.click();
    }
    await expect(page.locator('#story')).toBeInViewport();

    // 3. Make Reservation
    if (isMobile) {
      const openBtn = page.locator('#open-menu-btn');
      await openBtn.click({ force: true });
      const reserveLink = page.locator('#mobile-menu a[href="#reservations"]');
      await reserveLink.evaluate((node) => (node as HTMLElement).click());
    } else {
      const reserveBtn = page.locator('header .hidden.md\\:inline-flex[href="#reservations"]');
      await reserveBtn.click();
    }

    await expect(page.locator('#reservations')).toBeInViewport();
  });

  test('Flow 3: Direct reservation from hero CTA', async ({ page }) => {
    const heroReserveBtn = page.locator('#hero a[href="#reservations"]');
    await expect(heroReserveBtn).toBeVisible();
    await heroReserveBtn.click();
    await expect(page.locator('#reservations')).toBeInViewport();
  });

  test('Flow 4: Mobile user completes reservation via hamburger menu', async ({
    page,
    isMobile,
  }) => {
    if (!isMobile) test.skip();

    // 1. Open Menu
    const openBtn = page.locator('#open-menu-btn');
    await openBtn.click({ force: true });

    // 2. Click Reserve
    const reserveLink = page.locator('#mobile-menu a[href="#reservations"]');
    await expect(reserveLink).toBeVisible();
    await reserveLink.evaluate((node) => (node as HTMLElement).click());

    // 3. Verify section
    await expect(page.locator('#reservations')).toBeInViewport();

    // 4. Fill & Submit
    await page.locator('#date').fill('2026-10-15');
    await page.locator('#time').selectOption('6:30 PM');
    await page.locator('#guests').selectOption('4');
    await page.locator('#name').fill('Mobile User');
    await page.locator('#email').fill('mobile@example.com');
    await page.locator('#phone').fill('555-123-4567');

    await page.getByRole('button', { name: 'Request Reservation' }).click({ force: true });
    await expect(page.getByRole('heading', { name: 'Confirmed' })).toBeVisible({ timeout: 15000 });
  });
});
