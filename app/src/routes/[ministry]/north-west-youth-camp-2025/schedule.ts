type DaySchedule = { key: string; label: string; rows: TimeBlock[]; dateNote?: string };

export const schedule: DaySchedule[] = [
	{
		key: 'thu',
		label: 'Четверг',
		rows: [
			{ start: '12:00pm', end: '04:00pm', title: 'Заезд / Регистрация' },
			{ start: '06:00pm', end: '07:00pm', title: 'Ужин' },
			{ start: '07:30pm', end: '10:00pm', title: 'Общение в доме молитвы' },
			{ title: 'Правила лагеря', speaker: 'Заец Д.', inline: true },
			{
				title: '“Всеобщее милосердие Бога” — Иона 1 глава',
				speaker: 'Антонюк А. С.',
				inline: true
			},
			{ title: 'Знакомство со служителем', speaker: 'Salem', inline: true },
			{ start: '10:00pm', end: '12:00am', title: 'Чай' },
			{ start: '12:00am', title: 'Отбой' }
		]
	},
	{
		key: 'fri',
		label: 'Пятница',
		rows: [
			{ start: '08:00am', end: '08:45am', title: 'Утренняя молитва' },
			{ title: '“Истинные свидетельства” — Ин. 5:31–35', inline: true },
			{ start: '09:00am', end: '10:00am', title: 'Завтрак' },
			{ start: '10:30am', end: '12:00pm', title: 'Утреннее служение' },
			{ title: '“Путь духовного восстановления” — 2 глава', speaker: 'Заец Д.', inline: true },
			{ start: '12:00pm', end: '12:30pm', title: 'Обсуждение темы по группам' },
			{ start: '12:30pm', end: '12:45pm', title: 'Общая фотография' },
			{ start: '12:45pm', end: '02:00pm', title: 'Свободное время: go karts, swing, activities' },
			{ start: '02:00pm', end: '03:00pm', title: 'Обед' },
			{ start: '03:00pm', end: '04:00pm', title: 'Беседа для братьев', speaker: 'Нейман К. А.' },
			{ start: '03:00pm', end: '05:00pm', title: 'Свободное время: go karts, swing, activities' },
			{
				start: '05:30pm',
				end: '07:00pm',
				title: 'Общая тематическая беседа',
				speaker: 'Нейман К. А.'
			},
			{ title: '“Не передвигай межи давней, которую провели отцы твои”', inline: true },
			{ start: '07:00pm', end: '08:00pm', title: 'Ужин' },
			{
				start: '08:30pm',
				end: '10:30pm',
				title: 'Общение в доме молитвы (Молодёжь церкви “Слово Истины”)'
			},
			{
				title: '“Исповедание — путь духовного обновления”',
				speaker: 'Антонюк А. С.',
				inline: true
			},
			{ start: '10:30pm', end: '12:00am', title: 'Чай' },
			{ start: '12:00am', title: 'Отбой' }
		]
	},
	{
		key: 'sat',
		label: 'Суббота',
		rows: [
			{ start: '08:00am', end: '08:45am', title: 'Утренняя молитва' },
			{ title: '“Истинные свидетельства” — Ин. 5:36–38', inline: true },
			{ start: '09:00am', end: '10:00am', title: 'Завтрак' },
			{ start: '10:30am', end: '12:00pm', title: 'Утреннее служение' },
			{ title: '“Истинное покаяние” — Иона, 3 глава', speaker: 'Антонюк А. С.', inline: true },
			{ start: '12:00pm', end: '12:30pm', title: 'Обсуждение темы по группам' },
			{ start: '12:30pm', end: '02:00pm', title: 'Свободное время: go karts, swing, activities' },
			{ start: '02:00pm', end: '03:00pm', title: 'Обед' },
			{ start: '03:00pm', end: '04:00pm', title: 'Беседа для сестёр', speaker: 'Антонюк А. С.' },
			{ start: '03:00pm', end: '05:00pm', title: 'Свободное время: go karts, swing, activities' },
			{
				start: '05:30pm',
				end: '07:00pm',
				title: 'Общая тематическая беседа',
				speaker: 'Диакону Д.'
			},
			{ title: '“То, что вы не сможете делать на небесах”', inline: true },
			{ start: '07:00pm', end: '08:00pm', title: 'Ужин' },
			{
				start: '08:30pm',
				end: '10:00pm',
				title: 'Общение в доме молитвы (Молодёжь церкви Spokane)'
			},
			{ title: '“Надежда для усталого сердца”', speaker: 'Кузнецов С. Г.', inline: true },
			{ start: '10:00pm', end: '12:00am', title: 'Чай' },
			{ start: '12:00am', title: 'Отбой' }
		]
	},
	{
		key: 'sun',
		label: 'Воскресенье',
		rows: [
			{ start: '08:00am', end: '08:45am', title: 'Утренняя молитва' },
			{ title: '“Истинные свидетельства” — Ин. 5:39–47', inline: true },
			{ start: '09:00am', end: '10:00am', title: 'Завтрак' },
			{
				start: '10:30am',
				end: '12:00pm',
				title: 'Утреннее служение (и призыв)',
				speaker: 'Антонюк А. С.'
			},
			{ title: '“Индивидуальная работа Бога с человеком” — 4 глава', inline: true },
			{ start: '12:00pm', end: '01:00pm', title: 'Уборка комнат и территории' },
			{ start: '01:00pm', end: '02:00pm', title: 'Обед' },
			{ start: '02:00pm', title: 'Выезд' }
		]
	}
];
