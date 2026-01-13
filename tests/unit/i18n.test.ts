import { describe, it, expect } from 'bun:test';
import { useTranslations } from '../../src/lib/i18n';

describe('i18n', () => {
  it('translates keys in default locale', () => {
    const t = useTranslations('en');
    expect(t('site.title')).toBe('Risū & Oak');
    expect(t('nav.home')).toBe('Home');
  });

  it('handles missing keys gracefully', () => {
    const t = useTranslations('en');
    expect(t('missing.key')).toBe('missing.key');
  });
});
