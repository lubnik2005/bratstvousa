export interface MenuLink {
	title: string;
	href?: string;
	link?: string;
	description?: string;
	color?: string;
	subcategory?: MenuLink[];
	children?: MenuLink[];
}

export const menu_items: MenuLink[] = [
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
				color: '#9a6a3a'
			},
			{
				title: 'Молодежный отдел',
				href: '/youth-ministry',
				description: 'Молодежь, исполненная Духа Святого, — надежда церкви.',
				color: '#4a5f76'
			},
			{
				title: 'Семейный отдел',
				href: '/family-ministry',
				description: 'Крепкая семья — основа крепкой церкви.',
				color: '#5c6b4f'
			},
			{
				title: 'Отдел Благовестия',
				href: '/gospel-ministry',
				description: 'Проповедуйте Евангелие всей твари.',
				color: '#7a5540'
			},
			{
				title: 'Музыкально хоровой отдел (МХО)',
				href: '/music-choir-ministry',
				description: 'Пойте Господу новую песнь.',
				color: '#6a5a72'
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
				color: '#3f5a68'
			}
		]
	},

	{ title: 'ПРОПОВЕДИ', link: 'https://www.youtube.com/@bratstvousa' }
];
