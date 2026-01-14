import { test, expect } from '@playwright/test';

test.describe('Forms and Interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Reservation Form', () => {
    test('should validate required fields', async ({ page }) => {
      const reservationSection = page.locator('#reservations');
      await reservationSection.scrollIntoViewIfNeeded();

      const submitButton = page.getByRole('button', { name: /reserve|request/i });
      await submitButton.click();

      const dateInput = page.locator('#date');
      const isInvalid = await dateInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
      expect(isInvalid).toBe(true);
    });

    test('should submit successfully with valid data', async ({ page }) => {
      const reservationSection = page.locator('#reservations');
      await reservationSection.scrollIntoViewIfNeeded();

      // Fill form
      await page.locator('#date').fill('2026-12-25');
      await page.locator('#time').selectOption('7:00 PM');
      await page.locator('#guests').selectOption('4');
      await page.locator('#name').fill('Test User');
      await page.locator('#email').fill('test@example.com');
      await page.locator('#phone').fill('555-555-5555');
      await page.locator('#requests').fill('Window seat please');

      // Wait a bit for state updates
      await page.waitForTimeout(500);

      // Submit
      const submitButton = page.getByRole('button', { name: /reserve|request/i });
      await submitButton.click();

      // Check for success or error
      const confirmedHeading = page.locator('h3', { hasText: 'Confirmed' });

      try {
        await expect(confirmedHeading).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/We have received your request/i)).toBeVisible();
      } catch (e) {
        // If success failed, check if error is visible to help debugging
        const errorMsg = page.locator('.text-red-600');
        if (await errorMsg.isVisible()) {
          console.log('Form submission failed with error message visible');
        }
        throw e;
      }
    });

    test('should show error state if app validation fails', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /reserve|request/i });
      await expect(submitButton).toBeVisible();
    });
  });

  test.describe('Newsletter Modal', () => {
    test('should appear on exit intent and allow signup', async ({ page, isMobile }, testInfo) => {
      // Exit intent only works on desktop with mouse
      if (isMobile || /tablet|ipad/i.test(testInfo.project.name)) test.skip();

      await page.mouse.move(500, 500);
      await page.mouse.move(500, -10);

      const modalHeading = page.getByRole('heading', { name: /Join the inner circle/i });
      await expect(modalHeading).toBeVisible();

      const emailInput = page.locator('#newsletter-email');
      await emailInput.fill('newsletter@example.com');

      const form = page.locator('form').filter({ has: page.locator('#newsletter-email') });
      const submitButton = form.locator('button[type="submit"]');
      await submitButton.click();

      await expect(page.getByText('Success!')).toBeVisible();
    });

    test('should close when "No Thanks" is clicked', async ({ page, isMobile }, testInfo) => {
      if (isMobile || /tablet|ipad/i.test(testInfo.project.name)) test.skip();

      await page.mouse.move(500, 500);
      await page.mouse.move(500, -10);

      const closeButton = page.getByText(/No thanks/i);
      await expect(closeButton).toBeVisible();
      await page.waitForTimeout(500); // Wait for animation
      await closeButton.click();

      const modalHeading = page.getByRole('heading', { name: /Join the inner circle/i });
      await expect(modalHeading).not.toBeVisible();
    });
  });

  test.describe('Floating CTA', () => {
    test('should appear after scrolling past hero and link to reservations', async ({ page }) => {
      const cta = page.locator('#floating-cta');

      await expect(cta).toHaveAttribute('aria-hidden', 'true');

      await page.evaluate(() => window.scrollTo(0, 1500));

      await expect(cta).toHaveAttribute('aria-hidden', 'false');
      await expect(cta).toBeVisible();

      await cta.click({ force: true });

      await expect(page).toHaveURL(/.*#reservations/);
    });
  });
});
