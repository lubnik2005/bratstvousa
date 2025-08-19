export const menu_items = [
	{
		title: 'О НАС',
		children: [
			{ title: 'Приветственное слово', href: '/greeting' },
			{ title: 'Краткий обзор', href: '/short-introduction' },
			{ title: 'Состав совета', href: '/committee' },
			{ title: 'Вероучение', href: '/beliefs' }
		]
	},
	{ title: 'АДРЕСА ДОМОВ МОЛИТВЫ', href: '/churches' },
	{ title: 'КАЛЕНДАРЬ', href: '/calendar' },
	{ title: 'НОВОСТИ', href: '/news' },

	{
		title: 'ОТДЕЛЫ',
		children: [
			{
				title: 'Детский отдел',
				href: '/childrens-ministry',
				description: 'Учение в юности — основа жизни.'
			},
			{
				title: 'Молодежный отдел',
				href: '/youth-ministry',
				description: 'Молодежь, исполненная Духа Святого, — надежда церкви.'
			},
			{
				title: 'Семейный отдел',
				href: '/family-ministry',
				description: 'Крепкая семья — основа крепкой церкви.'
			},
			{
				title: 'Отдел Благовестия',
				href: '/gospel-ministry',
				description: 'Проповедуйте Евангелие всей твари.'
			},
			{
				title: 'Музыкально хоровой отдел (МХО)',
				href: '/music-choir-ministry',
				description: 'Пойте Господу новую песнь.'
			},
			{
				title: 'Отдел библейского образования',
				href: '/bible-education-ministry',
				subcategory: [
					{ title: 'Библейская Школа', href: '/bible-school-ministry' },
					{ title: 'Библейские Курсы', href: '/bible-courses-ministry' },
					{ title: 'Братские беседы', href: '/brothers-courses-ministry' }
				],
				description: 'Познайте истину, и истина сделает вас свободными.'
			}
		]
	},

	{ title: 'ПРОПОВЕДИ', link: 'https://www.youtube.com/@bratstvousa' }
];
