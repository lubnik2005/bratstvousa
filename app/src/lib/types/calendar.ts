/**
 * Shared calendar types for FullCalendar integration
 */

/** Event object for FullCalendar display */
export interface CalendarEvent {
	id: number;
	title: string;
	start: string | null;
	end: string | null;
	url: string;
	region: string;
	backgroundColor: string;
	borderColor: string;
	schemaName: string;
}

/** Region filter option */
export interface Region {
	key: string;
	label: string;
}

/** Ministry filter option with color */
export interface Ministry {
	key: string;
	label: string;
	color?: string;
	slug?: string;
}

/** Available regions in the system */
export const REGIONS: Region[] = [
	{ key: 'all', label: 'Все Регионы' },
	{ key: 'central', label: 'Центральный регион' },
	{ key: 'east', label: 'Восточный регион' },
	{ key: 'california', label: 'Калифорнийский регион' },
	{ key: 'north-west', label: 'Северо-Западный регион' }
];

/** Ministry metadata for calendar display and routing */
export const MINISTRY_META: Record<string, { color: string; slug: string; label: string }> = {
	youthEvents: { color: '#2176AE', slug: 'youth-ministry', label: 'Молодежный отдел' },
	childrensEvents: { color: '#8D230F', slug: 'childrens-ministry', label: 'Детский отдел' },
	bibleEducationEvents: {
		color: '#F2C572',
		slug: 'bible-education-ministry',
		label: 'Отдел библейского образования'
	},
	generalEvents: { color: '#397367', slug: 'general-event', label: 'Общие события' },
	gospelEvents: { color: '#6C4A79', slug: 'gospel-ministry', label: 'Отдел Благовестия' },
	musicEvents: {
		color: '#5A4A42',
		slug: 'music-choir-ministry',
		label: 'Музыкально хоровой отдел'
	},
	familyEvents: { color: '#FF8C42', slug: 'family-ministry', label: 'Семейный отдел' }
};

/** Ministry keys in order matching eventSchemas array */
export const SCHEMA_NAMES = [
	'youthEvents',
	'childrensEvents',
	'bibleEducationEvents',
	'generalEvents',
	'gospelEvents',
	'musicEvents',
	'familyEvents'
] as const;

export type SchemaName = (typeof SCHEMA_NAMES)[number];
