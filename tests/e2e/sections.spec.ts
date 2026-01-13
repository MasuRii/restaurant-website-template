import { test, expect } from '@playwright/test';

test.describe('Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section loads with title and ctas', async ({ page }) => {
    const section = page.locator('#hero');
    await expect(section).toBeVisible();

    // Check title (approximate text check since it comes from translations)
    await expect(section.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check CTAs
    await expect(section.getByRole('link', { name: /Reserve/i })).toBeVisible();
    await expect(section.getByRole('link', { name: /Menu/i })).toBeVisible();
  });

  test('about section loads with chef info', async ({ page }) => {
    const section = page.locator('#story');
    await expect(section).toBeVisible();

    // Check headings
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible(); // Main title
    await expect(section.getByRole('heading', { level: 3 })).toBeVisible(); // Chef name

    // Check images (should be 2: interior and chef)
    const images = section.locator('img');
    await expect(images).toHaveCount(2);
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

  test('testimonials section loads and has schema', async ({ page }) => {
    const section = page.locator('#testimonials');
    await expect(section).toBeVisible();

    // Check for grid items
    const quotes = section.locator('blockquote');
    await expect(quotes).toHaveCount(3); // We sliced to 3

    // Check schema
    const schemaScript = section.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    
    const schemaContent = await schemaScript.textContent();
    const schema = JSON.parse(schemaContent!);
    expect(schema['@graph']).toBeDefined();
    expect(schema['@graph'][0]['@type']).toBe('Review');
  });

  test('events section loads and has schema', async ({ page }) => {
    const section = page.locator('#events');
    await expect(section).toBeVisible();

    // Check for event cards
    const cards = section.locator('article');
    // We expect at least 3 cards (2 events + 1 weekly + 1 private dining)
    await expect(cards).toHaveCount(4); 

    // Check schema
    const schemaScript = section.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    
    const schemaContent = await schemaScript.textContent();
    const schema = JSON.parse(schemaContent!);
    expect(schema['@graph']).toBeDefined();
    // Only 'event' type items are in schema
    expect(schema['@graph'][0]['@type']).toBe('Event');
    expect(schema['@graph'][0]['location']).toBeDefined();
  });

  test('location section loads with address and schema', async ({ page }) => {
    const section = page.locator('#location');
    await expect(section).toBeVisible();

    // Check content
    await expect(section.getByText('San Francisco')).toBeVisible();
    await expect(section.getByText('Contact')).toBeVisible();
    
    // Check map placeholder or link
    const mapLink = section.locator('a[href*="google.com/maps"]');
    await expect(mapLink.first()).toBeVisible();

    // Check schema
    const schemaScript = section.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    
    const schemaContent = await schemaScript.textContent();
    const schema = JSON.parse(schemaContent!);
    expect(schema['@type']).toBe('Restaurant');
    expect(schema.address).toBeDefined();
    expect(schema.geo).toBeDefined();
    expect(schema.openingHoursSpecification).toBeInstanceOf(Array);
  });
});

