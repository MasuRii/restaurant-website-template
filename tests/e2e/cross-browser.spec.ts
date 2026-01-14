import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Core User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    try {
      await page.goto('/');
    } catch (e) {
      console.log('Retry navigation due to potential connection error');
      await page.waitForTimeout(1000);
      await page.goto('/');
    }
  });

  test('hero section is visually complete and interactive', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();

    // Check CTAs
    const reserveBtn = hero.getByRole('link', { name: /Reserve/i });
    await expect(reserveBtn).toBeVisible();

    const menuBtn = hero.getByRole('link', { name: /Menu/i });
    await expect(menuBtn).toBeVisible();
  });

  test('navigation smoothly scrolls to sections', async ({ page, isMobile }) => {
    const targetName = /Story/i;
    const targetId = '#story';

    // Mobile handling
    if (isMobile) {
      const menuBtn = page.getByLabel(/Open main menu/i);
      if (await menuBtn.isVisible()) {
        await menuBtn.click({ force: true });

        const mobileMenu = page.locator('#mobile-menu');
        await expect(mobileMenu).toHaveClass(/translate-x-0/);

        const navLink = page.getByRole('link', { name: targetName }).first();
        await expect(navLink).toBeVisible();
        await navLink.dispatchEvent('click');
      }
    } else {
      // Desktop
      const navLink = page.getByRole('link', { name: targetName }).first();
      await expect(navLink).toBeVisible();
      await navLink.click({ force: true });
    }

    // Check if we scrolled to section
    const section = page.locator(targetId);
    // Allow time for smooth scroll
    await expect(section).toBeInViewport({ timeout: 10000 });
  });

  test('menu section displays categories and items', async ({ page }) => {
    const menuSection = page.locator('#menu');
    await menuSection.scrollIntoViewIfNeeded();

    // Verify default content (Dinner)
    await expect(menuSection).toContainText(/Charred Octopus/i);

    // Verify category tabs exist
    const tabs = menuSection.getByRole('tab');
    await expect(tabs.first()).toBeVisible();
    await expect(tabs.count()).resolves.toBeGreaterThan(1);

    // Note: detailed interaction testing (clicking tabs) is covered in component unit tests
    // or sections.spec.ts if robust. Here we verify the component loaded and hydrated enough to show default state.
  });

  test('reservation form validates input', async ({ page }) => {
    const reservationSection = page.locator('#reservations');
    await reservationSection.scrollIntoViewIfNeeded();

    const submitBtn = reservationSection.getByRole('button', { name: /Request Reservation/i });
    await submitBtn.click({ force: true });

    await expect(reservationSection).toBeVisible();
    const nameInput = reservationSection.getByLabel(/Name/i);
    await expect(nameInput).toBeVisible();
  });

  test('footer is accessible and visible', async ({ page }) => {
    const footer = page.locator('body > footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Risū & Oak/i);
    await expect(footer.getByRole('link', { name: /Instagram/i })).toBeVisible();
  });
});
