import Database from 'better-sqlite3';
import { globSync } from 'node:fs';

// This script only opens the local Wrangler database; it cannot access production.
const path = globSync('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite').find(
	(path) => !path.endsWith('metadata.sqlite')
);
if (!path) throw new Error('Start the local dev server once to initialize D1.');
const db = new Database(path);
const tables = ['youth_events', 'family_events', 'music_events', 'general_events'];
const regions = ['east', 'central', 'california', 'north-west'];
const titles = ['Молодёжное общение', 'Семейная встреча', 'Хоровое служение', 'Общение церквей'];

db.transaction(() => {
	for (const [index, table] of tables.entries()) {
		if (db.prepare(`SELECT count(*) AS count FROM ${table}`).get().count > 0) continue;
		const insert = db.prepare(`INSERT INTO ${table}
			(title, slug, region, start_at, end_at, description, content)
			VALUES (?, ?, ?, ?, ?, ?, ?)`);
		for (let week = 0; week < 8; week++) {
			const start = new Date();
			start.setDate(start.getDate() + 3 + week * 7 + index);
			const end = new Date(start);
			end.setDate(end.getDate() + 1);
			insert.run(
				`[Демо] ${titles[index]}`,
				`mobile-demo-${index}-${week}`,
				regions[index],
				start.toISOString().slice(0, 10),
				end.toISOString().slice(0, 10),
				'Демонстрационные данные для локального просмотра.',
				'<p>Это демонстрационное событие для проверки мобильного интерфейса. Даты и описание вымышлены.</p><p>Вернитесь к событиям кнопкой «Назад», чтобы проверить сохранение позиции.</p>'
			);
		}
	}
	if (db.prepare('SELECT count(*) AS count FROM churches').get().count === 0) {
		const insert = db.prepare(`INSERT INTO churches
			(state, city, name_line_1, region, address_line_1, phone)
			VALUES (?, ?, ?, ?, ?, ?)`);
		for (const [index, [state, city]] of [
			['Pennsylvania', 'Philadelphia'],
			['Minnesota', 'Minneapolis'],
			['California', 'Sacramento'],
			['Washington', 'Vancouver']
		].entries()) {
			insert.run(
				state,
				city,
				'[Демо] Дом молитвы — вымышленные данные',
				regions[index],
				'100 Example Street',
				'+1-202-555-0100'
			);
		}
	}
})();
db.close();
console.log('Local-only demo data is ready. Existing populated tables were left unchanged.');
