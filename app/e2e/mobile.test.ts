import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test('Back restores month view after an event, then list view independently', async ({ page }) => {
	await page.goto('/calendar');
	const first = page.locator('[data-event-key]').first();
	test.skip((await first.count()) === 0, 'Requires events');
	await first.click();
	await page.goBack();
	await expect(page.getByRole('button', { name: 'Список', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.getByRole('button', { name: 'Месяц', exact: true }).click();
	const bar = page.locator('.event-span').first();
	test.skip((await bar.count()) === 0, 'Requires events in the current month');
	await bar.click();
	const monthUrl = page.url();
	await page.locator('[data-event-key]').first().click();
	await page.goBack();
	await expect(page).toHaveURL(monthUrl);
	await expect(page.getByRole('button', { name: 'Месяц', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.getByRole('button', { name: 'Список', exact: true }).click();
	await page.locator('[data-event-key]').first().click();
	await page.goBack();
	await expect(page.getByRole('button', { name: 'Список', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});

test('adjacent calendar dates remain clickable after selection', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/calendar?view=month&day=2026-10-01');
	for (const day of ['10', '09', '10', '08', '09']) {
		const date = `2026-10-${day}`;
		await page.locator(`[data-date="${date}"]`).click();
		await expect(page.locator(`[data-date="${date}"]`)).toHaveAttribute('aria-pressed', 'true');
		await expect(page).toHaveURL(new RegExp(`day=${date}`));
	}
	expect(errors).toEqual([]);
});

test('event list has no past-events control', async ({ page }) => {
	await page.goto('/calendar');
	await expect(page.getByRole('checkbox')).toHaveCount(0);
});

test('Today is only available in month view and returns to the current day', async ({ page }) => {
	await page.goto('/calendar?region=east');
	await expect(page.getByRole('button', { name: 'Ближайшие', exact: true })).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Сегодня', exact: true })).toHaveCount(0);
	await expect(page).toHaveURL(/region=east/);
	await page.getByRole('button', { name: 'Месяц', exact: true }).click();
	await page.getByRole('button', { name: 'Следующий месяц' }).click();
	await page.getByRole('button', { name: 'Сегодня', exact: true }).click();
	await expect(page.locator('.calendar-day.today')).toHaveAttribute('aria-pressed', 'true');
});

test('month view selects dates and survives a reload', async ({ page }) => {
	await page.goto('/calendar?view=month&day=2026-11-07');
	await expect(page.getByRole('button', { name: 'Месяц', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.locator('.calendar-day').filter({ hasText: /^8$/ }).click();
	await expect(page).toHaveURL(/day=2026-11-08/);
	await page.reload();
	await expect(page.locator('.calendar-day.selected')).toHaveText('8');
	await page.getByRole('button', { name: 'Следующий месяц' }).click();
	await expect(page).toHaveURL(/day=2026-12-01/);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
});

test('mobile home uses one menu and keeps footer links in More', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.mobile-masthead')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Открыть меню', exact: true })).not.toBeVisible();
	await expect(page.locator('footer')).not.toBeVisible();
	const homeLink = page.locator('.mobile-header').getByRole('link');
	await expect(homeLink).toHaveAttribute('href', '/');
	await expect(homeLink).toContainText('Американское Объединение');
	await page
		.getByRole('navigation', { name: 'Основная навигация' })
		.getByRole('link', { name: 'Ещё' })
		.click();
	const menu = page.getByRole('navigation', { name: 'Все разделы' });
	await expect(menu.getByRole('link', { name: 'Политика конфиденциальности' })).toBeVisible();
	await expect(menu.getByRole('link', { name: 'info@bratstvousa.com' })).toBeVisible();
	await menu.getByRole('button', { name: 'Закрыть меню' }).click();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
});

test('agenda restores the selected event position after Back', async ({ page }) => {
	await page.goto('/calendar');
	const events = page.locator('[data-event-key]');
	test.skip((await events.count()) < 8, 'Requires local demo data or an event-populated database');
	const event = events.nth(7);
	await event.scrollIntoViewIfNeeded();
	const before = await event.evaluate((element) => element.getBoundingClientRect().top);
	const key = await event.getAttribute('data-event-key');
	await event.click();
	await page.goBack();
	await expect(page.locator(`[data-event-key="${key}"]`)).toBeVisible();
	await expect
		.poll(async () => {
			const after = await page
				.locator(`[data-event-key="${key}"]`)
				.evaluate((element) => element.getBoundingClientRect().top);
			return Math.abs(after - before);
		})
		.toBeLessThan(5);
});

test('church lookup is usable without loading a map', async ({ page }) => {
	const mapRequests: string[] = [];
	page.on('request', (request) => {
		if (/leaflet|tile\.openstreetmap/.test(request.url())) mapRequests.push(request.url());
	});
	await page.goto('/churches');
	await expect(page.getByRole('heading', { name: 'Найти церковь' })).toBeVisible();
	await page.getByLabel('Город, штат или название').fill('NoMatchingCity123');
	await expect(page.getByRole('heading', { name: 'Церковь не найдена' })).toBeVisible();
	expect(mapRequests).toEqual([]);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
});
