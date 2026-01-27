// Mock data for development when database is not available
import type { User, Session, FormSubmission } from './schema';

export const mockUsers: User[] = [
	{
		id: 'mock-user-1',
		username: 'testuser',
		passwordHash: '$argon2id$v=19$m=19456,t=2,p=1$hash', // Mock hash
		age: 25
	}
];

export const mockSessions: Session[] = [
	{
		id: 'mock-session-1',
		userId: 'mock-user-1',
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
	}
];

export const mockSettings = [
	{
		id: 1,
		group: 'general',
		name: 'donation_url',
		payload: 'https://example.com/donate',
		locked: false
	},
	{
		id: 2,
		group: 'general',
		name: 'donation_tokenuid',
		payload: 'mock-token-uid',
		locked: false
	}
];

export const mockChurches = [
	{
		id: 1,
		state: 'CA',
		city: 'Sacramento, CA',
		name_line_1: 'First Evangelical Christian Church',
		name_line_2: null,
		region: 'california',
		address_line_1: '123 Main St',
		address_line_2: null,
		contact_first_name: 'John',
		contact_last_name: 'Doe',
		phone: '555-0100',
		youtube: null,
		website: 'https://example.com',
		flickr: null,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
		longitude: '-121.4944',
		latitude: '38.5816'
	},
	{
		id: 2,
		state: 'WA',
		city: 'Seattle, WA',
		name_line_1: 'Seattle Evangelical Church',
		name_line_2: null,
		region: 'north-west',
		address_line_1: '456 Pine St',
		address_line_2: null,
		contact_first_name: 'Jane',
		contact_last_name: 'Smith',
		phone: '555-0200',
		youtube: null,
		website: 'https://example.com',
		flickr: null,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
		longitude: '-122.3321',
		latitude: '47.6062'
	}
];

export const mockYouthEvents = [
	{
		id: 1,
		title: 'Молодежная конференция 2025',
		slug: 'youth-conference-2025',
		authorId: 1,
		description: 'Ежегодная молодежная конференция',
		content: '<p>Приглашаем всех на конференцию!</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'all',
		thumbnail: null,
		featuredImage: '/img/youth-conference.jpg',
		startAt: '2025-06-15',
		endAt: '2025-06-18',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	},
	{
		id: 2,
		title: 'Летний молодежный лагерь',
		slug: 'summer-youth-camp',
		authorId: 1,
		description: 'Летний лагерь для молодежи',
		content: '<p>Три недели служения и отдыха</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'central',
		thumbnail: null,
		featuredImage: '/img/summer-camp.jpg',
		startAt: '2025-07-01',
		endAt: '2025-07-21',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockChildrensEvents = [
	{
		id: 1,
		title: 'Детская библейская школа',
		slug: 'childrens-bible-school',
		authorId: 1,
		description: 'Летняя библейская школа для детей',
		content: '<p>Приглашаем детей 6-12 лет</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'all',
		thumbnail: null,
		featuredImage: '/img/bible-school.jpg',
		startAt: '2025-06-20',
		endAt: '2025-06-25',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockBibleEducationEvents = [
	{
		id: 1,
		title: 'Библейские курсы - Новый поток',
		slug: 'bible-courses-new-stream',
		authorId: 1,
		description: 'Начало нового потока библейских курсов',
		content: '<p>Регистрация открыта</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'all',
		thumbnail: null,
		featuredImage: '/img/bible-courses.jpg',
		category: 'courses',
		startAt: '2025-09-01',
		endAt: null,
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockGospelEvents = [
	{
		id: 1,
		title: 'Евангелизация в парке',
		slug: 'park-evangelism',
		authorId: 1,
		description: 'Открытое служение в городском парке',
		content: '<p>Приглашаем всех принять участие</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'california',
		thumbnail: null,
		featuredImage: '/img/evangelism.jpg',
		startAt: '2025-05-10',
		endAt: '2025-05-10',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockMusicEvents = [
	{
		id: 1,
		title: 'Репетиция объединенного хора',
		slug: 'combined-choir-rehearsal',
		authorId: 1,
		description: 'Подготовка к конференции',
		content: '<p>Все желающие приглашаются</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'all',
		thumbnail: null,
		featuredImage: '/img/choir.jpg',
		startAt: '2025-05-20',
		endAt: '2025-05-20',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockFamilyEvents = [
	{
		id: 1,
		title: 'Семейная конференция',
		slug: 'family-conference',
		authorId: 1,
		description: 'Конференция для всей семьи',
		content: '<p>Приглашаем семьи со всех регионов</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'all',
		thumbnail: null,
		featuredImage: '/img/family-conference.jpg',
		startAt: '2025-08-15',
		endAt: '2025-08-18',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockGeneralEvents = [
	{
		id: 1,
		title: 'Общее собрание братства',
		slug: 'general-assembly',
		authorId: 1,
		description: 'Ежегодное собрание',
		content: '<p>Важные вопросы служения</p>',
		use_editorjs: null,
		editorjs: null,
		region: 'all',
		thumbnail: null,
		featuredImage: '/img/assembly.jpg',
		comment: null,
		startAt: '2025-10-10',
		endAt: '2025-10-12',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockNewsArticles = [
	{
		id: 1,
		title: 'Новости братства - Январь 2025',
		slug: 'news-january-2025',
		authorId: 1,
		description: 'Последние новости',
		content: '<p>В этом месяце произошло много интересного...</p>',
		thumbnail: null,
		featuredImage: '/img/news-jan.jpg',
		date: '2025-01-15',
		use_editorjs: null,
		editorjs: null,
		createdAt: new Date('2025-01-15'),
		updatedAt: new Date('2025-01-15')
	},
	{
		id: 2,
		title: 'Итоги конференции 2024',
		slug: 'conference-2024-summary',
		authorId: 1,
		description: 'Отчет о прошедшей конференции',
		content: '<p>Конференция прошла с большим благословением...</p>',
		thumbnail: null,
		featuredImage: '/img/conf-summary.jpg',
		date: '2024-12-20',
		use_editorjs: null,
		editorjs: null,
		createdAt: new Date('2024-12-20'),
		updatedAt: new Date('2024-12-20')
	}
];

export const mockYouthNewsArticles = [
	{
		id: 1,
		title: 'Новости молодежного отдела',
		slug: 'youth-news-jan-2025',
		authorId: 1,
		description: 'Молодежные новости',
		content: '<p>Планы на новый год...</p>',
		thumbnail: null,
		featuredImage: '/img/youth-news.jpg',
		date: '2025-01-10',
		use_editorjs: null,
		editorjs: null,
		createdAt: new Date('2025-01-10'),
		updatedAt: new Date('2025-01-10')
	}
];

export const mockFormSubmissions: FormSubmission[] = [];

export const mockChildrensFiles = [
	{
		id: 1,
		name: 'Программа детского лагеря',
		path: '/files/childrens-camp-program.pdf',
		category: 'programs',
		size: '1.2 MB',
		createdAt: new Date('2024-12-01'),
		updatedAt: new Date('2024-12-01')
	}
];

export const mockMedias = [];
