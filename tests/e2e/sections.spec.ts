import { test, expect } from '@playwright/test';

test.describe('Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('gallery section loads and lightbox works', async ({ page }) => {
    // Check section exists
    const gallerySection = page.locator('#gallery');
    await expect(gallerySection).toBeVisible();

    // Check images exist
    const images = gallerySection.locator('img');
    // We expect at least 6 images as per our data
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(6);

    // Click first image wrapper to open lightbox
    // Use the wrapper which has the onClick handler and role="button"
    const firstImageWrapper = gallerySection.locator('div[role="button"]').first();
    await expect(firstImageWrapper).toBeVisible();
    
    // Scroll to it to trigger hydration (client:visible)
    await firstImageWrapper.scrollIntoViewIfNeeded();
    // Give a moment for hydration to complete
    await page.waitForTimeout(1000);

    await firstImageWrapper.click();

    // Check lightbox visible
    const lightbox = page.locator('div[role="dialog"][aria-label="Image gallery lightbox"]');
    await expect(lightbox).toBeVisible();

    // Check close button works
    await lightbox.locator('button[aria-label="Close gallery"]').click();
    await expect(lightbox).not.toBeVisible();
  });

  test('menu section has valid schema markup', async ({ page }) => {
    const menuSection = page.locator('#menu');
    await expect(menuSection).toBeVisible();

    // Get the JSON-LD script content
    const schemaScript = menuSection.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    
    const schemaContent = await schemaScript.textContent();
    expect(schemaContent).toBeTruthy();
    
    const schema = JSON.parse(schemaContent!);
    expect(schema['@type']).toBe('Menu');
    expect(schema.hasMenuSection).toBeInstanceOf(Array);
    expect(schema.hasMenuSection.length).toBeGreaterThan(0);
    
    const firstSection = schema.hasMenuSection[0];
    expect(firstSection['@type']).toBe('MenuSection');
    expect(firstSection.hasMenuItem).toBeInstanceOf(Array);
    expect(firstSection.hasMenuItem.length).toBeGreaterThan(0);
    
    const firstItem = firstSection.hasMenuItem[0];
    expect(firstItem['@type']).toBe('MenuItem');
    expect(firstItem.offers).toBeDefined();
  });
});
