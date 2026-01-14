import { test, expect, type Page } from '@playwright/test';

type SchemaItem = {
  '@type': string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

async function getAllSchemas(page: Page) {
  const scripts = await page.locator('script[type="application/ld+json"]').all();
  const schemas: SchemaItem[] = [];

  for (const script of scripts) {
    const content = await script.textContent();
    if (content) {
      try {
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
          schemas.push(...json);
        } else if (json['@graph']) {
          schemas.push(...json['@graph']);
        } else {
          schemas.push(json);
        }
      } catch (e) {
        console.error('Failed to parse JSON-LD', e);
      }
    }
  }
  return schemas;
}

test.describe('Schema.org Structured Data', () => {
  test('should include valid Restaurant, Menu, and Event schemas', async ({ page }) => {
    await page.goto('/');
    const schemas = await getAllSchemas(page);

    // 1. Restaurant / LocalBusiness
    const restaurant = schemas.find(
      (item: SchemaItem) => item['@type'] === 'Restaurant' || item['@type'] === 'LocalBusiness'
    );
    expect(restaurant, 'Restaurant schema missing').toBeDefined();
    expect(restaurant!.name).toBe('Risū & Oak');
    expect(restaurant!.description).toBe('Seasonal wood-fired dining in San Francisco');
    expect(restaurant!.image).toBeDefined();
    expect(restaurant!.address).toBeDefined();
    expect(restaurant!.telephone).toBe('(415) 555-0123');
    expect(restaurant!.priceRange).toBe('$$$');
    expect(restaurant!.servesCuisine).toBe('Contemporary American');
    expect(restaurant!.openingHoursSpecification).toBeDefined();

    // 2. AggregateRating (nested or linked)
    if (restaurant!.aggregateRating) {
      expect(Number(restaurant!.aggregateRating.ratingValue)).toBe(4.8);
      expect(Number(restaurant!.aggregateRating.reviewCount)).toBeGreaterThan(0);
    } else {
      const rating = schemas.find((item) => item['@type'] === 'AggregateRating');
      if (rating) {
        expect(Number(rating.ratingValue)).toBe(4.8);
      }
    }

    // 3. Menu
    const menu = schemas.find((item: SchemaItem) => item['@type'] === 'Menu');
    expect(menu, 'Menu schema missing').toBeDefined();
    expect(menu!.name).toBe('Risū & Oak Menu');
    expect(menu!.hasMenuSection).toBeDefined();
    expect(menu!.hasMenuSection.length).toBeGreaterThan(0);

    // Check menu items
    const section = menu!.hasMenuSection[0];
    expect(section.hasMenuItem).toBeDefined();
    expect(section.hasMenuItem.length).toBeGreaterThan(0);
    const item = section.hasMenuItem[0];
    expect(item.name).toBeDefined();
    expect(item.offers).toBeDefined();

    // 4. Events
    const events = schemas.filter((item: SchemaItem) => item['@type'] === 'Event');
    if (events.length > 0) {
      const event = events[0];
      expect(event.name).toBeDefined();
      expect(event.startDate).toBeDefined();
      expect(event.location).toBeDefined();
    }
  });
});
