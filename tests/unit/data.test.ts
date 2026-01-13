import { describe, it, expect } from 'bun:test';
import restaurantData from '../../src/data/restaurant.json';
import menuData from '../../src/data/menu.json';
import teamData from '../../src/data/team.json';

describe('Data Files', () => {
  it('should have valid restaurant data', () => {
    expect(restaurantData).toBeDefined();
    expect(restaurantData.name.default).toBe('Risū & Oak');
    expect(restaurantData.address.city).toBe('San Francisco');
    expect(restaurantData.geo.latitude).toBe(37.7749);
  });

  it('should have valid menu data', () => {
    expect(menuData).toBeDefined();
    expect(menuData.categories).toBeArray();
    expect(menuData.categories.length).toBeGreaterThan(0);
    expect(menuData.categories[0].items).toBeArray();
    expect(menuData.categories[0].items[0].price).toBeGreaterThan(0);
  });

  it('should have valid team data', () => {
    expect(teamData).toBeDefined();
    expect(teamData.members).toBeArray();
    expect(teamData.members.length).toBeGreaterThan(0);
    expect(teamData.members[0].name.default).toContain('Chef');
  });
});
