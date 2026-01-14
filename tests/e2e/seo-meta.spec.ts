import { test, expect } from '@playwright/test';

test.describe('SEO Meta Tags', () => {
  test('homepage has correct meta tags', async ({ page }) => {
    await page.goto('/');

    // 1. Title
    // Should match "Risū & Oak | San Francisco Wood-Fired Dining" or at least contain the brand
    await expect(page).toHaveTitle(/Risū & Oak/);
    await expect(page).toHaveTitle(/San Francisco/);

    // 2. Meta Description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /Reserve your table/);
    await expect(description).toHaveAttribute('content', /Risū & Oak/);
    await expect(description).toHaveAttribute('content', /San Francisco/);
    await expect(description).toHaveAttribute('content', /wood-fired/);
    await expect(description).toHaveAttribute('content', /tasting menu/);

    // 3. Open Graph
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /Risū & Oak/
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      /San Francisco/
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /hero\.jpg/);
    // OG URL should be present
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBeTruthy();

    // 4. Twitter Card
    await expect(page.locator('meta[property="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
    await expect(page.locator('meta[property="twitter:title"]')).toHaveAttribute(
      'content',
      /Risū & Oak/
    );
    await expect(page.locator('meta[property="twitter:description"]')).toHaveAttribute(
      'content',
      /San Francisco/
    );
    await expect(page.locator('meta[property="twitter:image"]')).toHaveAttribute(
      'content',
      /hero\.jpg/
    );

    // 5. Canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /./);

    // 6. Favicon
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      /apple-icon-180\.png/
    );
  });
});
