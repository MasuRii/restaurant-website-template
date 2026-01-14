import { test, expect } from '@playwright/test';

test.describe('Link Validation', () => {
  test('should not have broken internal links', async ({ page, request }) => {
    await page.goto('/');

    const links = await page.locator('a').all();
    const visited = new Set<string>();

    for (const link of links) {
      const href = await link.getAttribute('href');

      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') {
        continue;
      }

      // Check for uniqueness to avoid duplicate checks
      if (visited.has(href)) continue;
      visited.add(href);

      console.log(`Checking link: ${href}`);

      if (href.startsWith('#')) {
        // Internal anchor
        const targetId = href.substring(1);
        if (targetId) {
          const target = page.locator(`#${targetId}`);
          await expect(target, `Anchor target ${href} not found`).toBeAttached();
        }
      } else if (href.startsWith('/')) {
        // Internal route
        const response = await request.head(href);
        expect(response.status(), `Link ${href} returned ${response.status()}`).toBe(200);
      } else if (href.startsWith('http')) {
        // External link - just check if it's a valid URL format for now
        // We avoid fetch checks to prevent external network dependency flakiness
        // and because of the demo interceptor
        expect(href).toMatch(/^https?:\/\//);
      }
    }
  });
});
