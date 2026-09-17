export type BlockKind = 'service' | 'talk' | 'meal' | 'free' | 'misc';

export type Lesson = {
	/** Lesson number within the camp theme (1–6). Omit for non-numbered talks. */
	n?: number;
	title: string;
	speaker?: string;
};

export type Block = {
	start: string;
	end?: string;
	title: string;
	kind: BlockKind;
	/** Short secondary line, e.g. who leads the fellowship. */
	note?: string;
	lessons?: Lesson[];
	/** Extra bullet shown after lessons, e.g. group discussion. */
	after?: string;
};

export type Day = {
	key: string;
	label: string;
	short: string;
	date: string;
	blocks: Block[];
};

export const theme = {
	title: 'Отче наш',
	subtitle: 'Шесть уроков по молитве Господней'
};

export const schedule: Day[] = [
	{
		key: 'thu',
		label: 'Четверг',
		short: 'Чт',
		date: '15 октября',
		blocks: [
			{ start: '14:00', end: '16:00', title: 'Заезд и регистрация', kind: 'misc' },
			{ start: '18:00', end: '19:00', title: 'Ужин', kind: 'meal' },
			{
				start: '19:30',
				end: '21:30',
				title: 'Общение в доме молитвы',
				kind: 'service',
				lessons: [
					{ title: 'Вступительная часть', speaker: 'Заец Д.' },
					{ n: 1, title: '«Отче наш… да святится Имя Твое»', speaker: 'Бальжик В.' }
				]
			},
			{ start: '22:00', title: 'Чай', kind: 'meal' },
			{ start: '00:00', title: 'Отбой', kind: 'misc' }
		]
	},
	{
		key: 'fri',
		label: 'Пятница',
		short: 'Пт',
		date: '16 октября',
		blocks: [
			{ start: '08:00', end: '08:45', title: 'Утренняя молитва', kind: 'service' },
			{ start: '09:00', end: '10:00', title: 'Завтрак', kind: 'meal' },
			{
				start: '10:30',
				end: '12:30',
				title: 'Утреннее собрание',
				kind: 'service',
				lessons: [
					{ n: 2, title: '«Да приидет Царствие Твоё»', speaker: 'Заец Д.' },
					{ n: 3, title: '«Да будет воля Твоя»', speaker: 'Бальжик В.' }
				],
				after: 'Обсуждение по группам'
			},
			{ start: '13:00', end: '14:00', title: 'Свободное время', kind: 'free' },
			{ start: '14:00', end: '15:00', title: 'Обед', kind: 'meal' },
			{
				start: '15:30',
				end: '16:30',
				title: 'Игра-знакомство',
				kind: 'misc',
				note: 'от молодёжи MBC'
			},
			{ start: '16:30', end: '17:30', title: 'Свободное время', kind: 'free' },
			{
				start: '17:30',
				end: '19:00',
				title: 'Вечерняя беседа',
				kind: 'talk',
				lessons: [{ title: '«Создание семьи»', speaker: 'Нейман К. А.' }]
			},
			{ start: '19:00', end: '20:00', title: 'Ужин', kind: 'meal' },
			{
				start: '20:30',
				end: '21:30',
				title: 'Общение в доме молитвы',
				kind: 'service',
				note: 'молодёжь г. Васила, Аляска'
			},
			{ start: '22:00', title: 'Чай', kind: 'meal' },
			{ start: '00:00', title: 'Отбой', kind: 'misc' }
		]
	},
	{
		key: 'sat',
		label: 'Суббота',
		short: 'Сб',
		date: '17 октября',
		blocks: [
			{ start: '08:00', end: '08:45', title: 'Утренняя молитва', kind: 'service' },
			{ start: '09:00', end: '10:00', title: 'Завтрак', kind: 'meal' },
			{
				start: '10:30',
				end: '12:00',
				title: 'Утреннее собрание',
				kind: 'service',
				lessons: [{ n: 4, title: '«Дай нам хлеб»', speaker: 'Бальжик В.' }],
				after: 'Обсуждение по группам'
			},
			{ start: '12:00', end: '14:00', title: 'Свободное время', kind: 'free' },
			{ start: '14:00', end: '15:00', title: 'Обед', kind: 'meal' },
			{ start: '15:00', end: '17:30', title: 'Свободное время', kind: 'free' },
			{
				start: '17:30',
				end: '19:00',
				title: 'Вечерняя беседа',
				kind: 'talk',
				lessons: [{ n: 5, title: '«Прости нам грехи наши»', speaker: 'Нейман К. А.' }]
			},
			{ start: '19:00', end: '20:00', title: 'Ужин', kind: 'meal' },
			{
				start: '20:30',
				end: '21:30',
				title: 'Общение в доме молитвы',
				kind: 'service',
				note: 'молодёжь г. Спокен'
			},
			{ start: '22:00', title: 'Чай', kind: 'meal' },
			{ start: '01:00', title: 'Отбой', kind: 'misc' }
		]
	},
	{
		key: 'sun',
		label: 'Воскресенье',
		short: 'Вс',
		date: '18 октября',
		blocks: [
			{ start: '08:00', end: '08:45', title: 'Утренняя молитва', kind: 'service' },
			{ start: '09:00', end: '10:00', title: 'Завтрак', kind: 'meal' },
			{
				start: '10:30',
				end: '12:00',
				title: 'Утреннее собрание',
				kind: 'service',
				lessons: [{ n: 6, title: '«Не введи нас в искушение»', speaker: 'Бальжик В.' }]
			},
			{ start: '12:00', end: '13:00', title: 'Уборка комнат и территории', kind: 'misc' },
			{ start: '13:00', end: '14:00', title: 'Обед', kind: 'meal' },
			{ start: '14:00', title: 'Выезд', kind: 'misc' }
		]
	}
];

/** All numbered lessons in order, for the theme overview strip. */
export const lessons: Lesson[] = schedule
	.flatMap((d) => d.blocks.flatMap((b) => b.lessons ?? []))
	.filter((l) => l.n !== undefined)
	.sort((a, b) => (a.n ?? 0) - (b.n ?? 0));
