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
				description: 'Учение в юности — основа жизни.',
				color: '#8B4513'
			},
			{
				title: 'Молодежный отдел',
				href: '/youth-ministry',
				description: 'Молодежь, исполненная Духа Святого, — надежда церкви.',
				color: '#2F5496'
			},
			{
				title: 'Семейный отдел',
				href: '/family-ministry',
				description: 'Крепкая семья — основа крепкой церкви.',
				color: '#4A6741'
			},
			{
				title: 'Отдел Благовестия',
				href: '/gospel-ministry',
				description: 'Проповедуйте Евангелие всей твари.',
				color: '#6B4C3A'
			},
			{
				title: 'Музыкально хоровой отдел (МХО)',
				href: '/music-choir-ministry',
				description: 'Пойте Господу новую песнь.',
				color: '#5D3A6B'
			},
			{
				title: 'Отдел библейского образования',
				href: '/bible-education-ministry',
				subcategory: [
					{ title: 'Библейские курсы', href: '/bible-courses-ministry' },
					{ title: 'Библейская Школа', href: '/bible-school-ministry' },
					{ title: 'Ресурсы', href: '/resources' }
				],
				description: 'Познайте истину, и истина сделает вас свободными.',
				color: '#1E4D6B'
			}
		]
	},

	{ title: 'ПРОПОВЕДИ', link: 'https://www.youtube.com/@bratstvousa' }
];
