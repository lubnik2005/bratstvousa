import { describe, expect, it } from 'vitest';
import { deLocalizeUrl, getLocale, localizeUrl } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

describe('localized routing and SSR isolation', () => {
	it('preserves the existing unprefixed Russian and prefixed English/Ukrainian routes', () => {
		const original = new URL('https://example.test/news?page=2#story');
		expect(localizeUrl(original, { locale: 'ru' }).pathname).toBe('/news');
		expect(localizeUrl(original, { locale: 'en' }).pathname).toBe('/en/news');
		expect(localizeUrl(original, { locale: 'uk' }).pathname).toBe('/uk/news');
		const canonical = deLocalizeUrl('https://example.test/en/news?page=2#story');
		expect(canonical.pathname).toBe('/news');
		expect(canonical.search).toBe('?page=2');
		expect(canonical.hash).toBe('#story');
	});

	it('does not leak the locale between overlapping server requests', async () => {
		const render = (locale: string, delay: number) =>
			paraglideMiddleware(new Request(`https://example.test/${locale}/news`), async () => {
				await new Promise((resolve) => setTimeout(resolve, delay));
				return new Response(getLocale());
			});
		const responses = await Promise.all([render('en', 20), render('uk', 1)]);
		expect(await Promise.all(responses.map((response) => response.text()))).toEqual(['en', 'uk']);
	});
});
