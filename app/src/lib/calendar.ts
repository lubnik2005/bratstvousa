import type { CalendarEvent } from '../routes/calendar/+page.server';

export const regions = [
	{ key: 'all', label: 'Все регионы' },
	{ key: 'central', label: 'Центральный' },
	{ key: 'east', label: 'Восточный' },
	{ key: 'california', label: 'Калифорния' },
	{ key: 'north-west', label: 'Северо-Западный' }
];

export const ministries = [
	{ key: 'all', label: 'Все отделы' },
	{ key: 'generalEvents', label: 'Общие события' },
	{ key: 'youthEvents', label: 'Молодёжный' },
	{ key: 'childrensEvents', label: 'Детский' },
	{ key: 'familyEvents', label: 'Семейный' },
	{ key: 'gospelEvents', label: 'Благовестие' },
	{ key: 'musicEvents', label: 'Музыкально-хоровой' },
	{ key: 'bibleEducationEvents', label: 'Библейское образование' }
];

export function localDate(value: string): Date {
	return new Date(`${value.slice(0, 10)}T12:00:00`);
}

export function dateKey(date: Date): string {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function monthDays(month: string): Array<string | null> {
	const first = localDate(`${month}-01`);
	const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
	return [
		...Array<null>(first.getDay()).fill(null),
		...Array.from({ length: count }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`)
	];
}

export function occursOn(event: CalendarEvent, day: string): boolean {
	const start = event.start.slice(0, 10);
	const end = (event.end || event.start).slice(0, 10);
	return day === start || (day >= start && day < end);
}

export function calendarWeeks(month: string, events: CalendarEvent[]) {
	const days = monthDays(month);
	while (days.length % 7) days.push(null);
	return Array.from({ length: days.length / 7 }, (_, index) => {
		const dates = days.slice(index * 7, index * 7 + 7);
		const occupied: number[] = [];
		const bars = events.flatMap((event) => {
			const columns = dates.flatMap((day, column) => (day && occursOn(event, day) ? [column] : []));
			if (!columns.length) return [];
			const first = columns[0];
			const last = columns[columns.length - 1];
			const mask = columns.reduce((mask, column) => mask | (1 << column), 0);
			let lane = occupied.findIndex((used) => !(used & mask));
			if (lane === -1) lane = occupied.length;
			occupied[lane] = (occupied[lane] || 0) | mask;
			const nextDay = localDate(dates[last]!);
			nextDay.setDate(nextDay.getDate() + 1);
			return [
				{
					event,
					first,
					last,
					lane,
					starts: event.start.slice(0, 10) === dates[first],
					ends: !occursOn(event, dateKey(nextDay))
				}
			];
		});
		return {
			dates: dates.map((day) => ({
				day,
				count: day ? events.filter((event) => occursOn(event, day)).length : 0
			})),
			bars,
			lanes: occupied.length
		};
	});
}

export function filterEvents(
	events: CalendarEvent[],
	region: string,
	ministry: string,
	query: string
): CalendarEvent[] {
	const normalized = query.trim().toLocaleLowerCase('ru');
	return events.filter(
		(event) =>
			(region === 'all' || event.region === region) &&
			(ministry === 'all' || event.schemaName === ministry) &&
			event.title.toLocaleLowerCase('ru').includes(normalized)
	);
}

export function eventDateLabel(event: CalendarEvent): string {
	const format = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long' });
	const first = localDate(event.start);
	const last = localDate(event.end || event.start);
	// Calendar payloads use an exclusive end date for multi-day events.
	if (last > first) last.setDate(last.getDate() - 1);
	return last > first ? `${format.format(first)} – ${format.format(last)}` : format.format(first);
}
