import { describe, expect, it } from 'vitest';
import {
	calendarWeeks,
	dateKey,
	eventDateLabel,
	filterEvents,
	localDate,
	monthDays,
	occursOn
} from './calendar';
import type { CalendarEvent } from '../routes/calendar/+page.server';

const event: CalendarEvent = {
	id: 1,
	title: 'Молодёжная встреча',
	start: '2026-11-07',
	end: '2026-11-09',
	url: '/youth-ministry/test',
	region: 'east',
	schemaName: 'youthEvents',
	backgroundColor: '#000',
	borderColor: '#000'
};

describe('mobile agenda', () => {
	it('splits event bars across weeks with correct continuation ends', () => {
		const weeks = calendarWeeks('2026-11', [event]);
		expect(weeks[0].bars[0]).toMatchObject({ first: 6, last: 6, starts: true, ends: false });
		expect(weeks[1].bars[0]).toMatchObject({ first: 0, last: 0, starts: false, ends: true });
	});
	it('places overlapping bars in separate lanes', () => {
		const weeks = calendarWeeks('2026-11', [event, { ...event, id: 2 }]);
		expect(weeks[0].lanes).toBe(2);
		expect(weeks[0].bars.map((bar) => bar.lane)).toEqual([0, 1]);
	});
	it('builds a Sunday-first month with leap days', () => {
		const days = monthDays('2028-02');
		expect(days.slice(0, 2)).toEqual([null, null]);
		expect(days.at(-1)).toBe('2028-02-29');
		expect(days.filter(Boolean)).toHaveLength(29);
	});
	it('marks multi-day events without including their exclusive end', () => {
		expect(occursOn(event, '2026-11-07')).toBe(true);
		expect(occursOn(event, '2026-11-08')).toBe(true);
		expect(occursOn(event, '2026-11-09')).toBe(false);
		expect(occursOn({ ...event, end: event.start }, event.start)).toBe(true);
	});
	it('formats date keys in local time', () => {
		expect(dateKey(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
	});
	it('combines region, ministry, and normalized search', () => {
		expect(filterEvents([event], 'east', 'youthEvents', ' МОЛОДЁЖНАЯ ')).toEqual([event]);
		expect(filterEvents([event], 'central', 'all', '')).toEqual([]);
		expect(filterEvents([event], 'all', 'familyEvents', '')).toEqual([]);
	});
	it('shows the inclusive final day, not the exclusive calendar end', () => {
		expect(eventDateLabel(event)).toBe('7 ноября – 8 ноября');
		expect(eventDateLabel({ ...event, end: '2026-11-08' })).toBe('7 ноября');
	});
	it('keeps date-only values on the intended local day', () => {
		expect(localDate('2026-11-07').getDate()).toBe(7);
	});
});
