// Mock database implementation that mimics Drizzle ORM API
import {
	mockUsers,
	mockSessions,
	mockSettings,
	mockChurches,
	mockYouthEvents,
	mockChildrensEvents,
	mockBibleEducationEvents,
	mockGospelEvents,
	mockMusicEvents,
	mockFamilyEvents,
	mockGeneralEvents,
	mockNewsArticles,
	mockYouthNewsArticles,
	mockFormSubmissions,
	mockChildrensFiles,
	mockMedias
} from './mock-data';
import * as schema from './schema';

type MockData = any[];

class MockQueryBuilder {
	private data: MockData;
	private filters: Array<(item: any) => boolean> = [];
	private orderByFn: ((a: any, b: any) => number) | null = null;
	private limitValue: number | null = null;
	private offsetValue: number = 0;
	private selectedFields: string[] | null = null;
	private selectedFieldsMap: any = null;
	private aliasName: string | null = null;

	constructor(data: MockData) {
		this.data = [...data]; // Clone to avoid mutation
	}

	select(fields?: any) {
		if (fields) {
			this.selectedFields = Object.keys(fields);
			this.selectedFieldsMap = fields;
		}
		return this;
	}

	getSelectedFields() {
		return this.selectedFieldsMap || {};
	}

	from(table: any) {
		// Already initialized with correct data
		return this;
	}

	where(condition: any) {
		// Simple equality check for common patterns
		this.filters.push((item) => {
			if (typeof condition === 'function') {
				try {
					return condition(item);
				} catch {
					return true;
				}
			}
			return true;
		});
		return this;
	}

	orderBy(...args: any[]) {
		// Simple ordering implementation
		const field = args[0];
		if (field && typeof field === 'object' && field._ && field._.name) {
			const fieldName = field._.name;
			const isDesc = args[0]?.toString().includes('desc');
			this.orderByFn = (a, b) => {
				const aVal = a[fieldName];
				const bVal = b[fieldName];
				if (aVal < bVal) return isDesc ? 1 : -1;
				if (aVal > bVal) return isDesc ? -1 : 1;
				return 0;
			};
		}
		return this;
	}

	limit(value: number) {
		this.limitValue = value;
		return this;
	}

	offset(value: number) {
		this.offsetValue = value;
		return this;
	}

	as(alias: string) {
		this.aliasName = alias;
		// Return a proxy that behaves like an aliased table
		return new Proxy(this, {
			get(target, prop) {
				if (typeof prop === 'string' && prop !== 'then' && prop !== 'execute') {
					// Return mock column references for the aliased table
					return { _: { name: prop } };
				}
				return (target as any)[prop];
			}
		});
	}

	innerJoin(table: any, condition: any) {
		// Simplified join - just return self for now
		return this;
	}

	async execute() {
		return this.then((x) => x);
	}

	async then(resolve: (value: any) => any) {
		let result = this.data;

		// Apply filters
		for (const filter of this.filters) {
			result = result.filter(filter);
		}

		// Apply ordering
		if (this.orderByFn) {
			result = result.sort(this.orderByFn);
		}

		// Apply offset and limit
		if (this.offsetValue > 0) {
			result = result.slice(this.offsetValue);
		}
		if (this.limitValue !== null) {
			result = result.slice(0, this.limitValue);
		}

		// Apply field selection
		if (this.selectedFields) {
			result = result.map((item) => {
				const selected: any = {};
				for (const field of this.selectedFields!) {
					selected[field] = item[field];
				}
				return selected;
			});
		}

		return resolve(result);
	}
}

class MockInsertBuilder {
	private table: any;
	private data: any;
	private mockDataArray: MockData;

	constructor(table: any, mockDataArray: MockData) {
		this.table = table;
		this.mockDataArray = mockDataArray;
	}

	values(data: any) {
		this.data = data;
		return this;
	}

	returning() {
		// Add to mock data with generated ID
		const newId = Math.max(0, ...this.mockDataArray.map((item) => item.id || 0)) + 1;
		const newItem = { ...this.data, id: newId };
		this.mockDataArray.push(newItem);
		return Promise.resolve([newItem]);
	}

	async execute() {
		if (!this.data) return [];
		const newId = Math.max(0, ...this.mockDataArray.map((item) => item.id || 0)) + 1;
		const newItem = { ...this.data, id: newId };
		this.mockDataArray.push(newItem);
		return [newItem];
	}
}

class MockUpdateBuilder {
	private mockDataArray: MockData;
	private updateData: any;
	private filters: Array<(item: any) => boolean> = [];

	constructor(mockDataArray: MockData) {
		this.mockDataArray = mockDataArray;
	}

	set(data: any) {
		this.updateData = data;
		return this;
	}

	where(condition: any) {
		this.filters.push((item) => {
			try {
				return condition(item);
			} catch {
				return false;
			}
		});
		return this;
	}

	async execute() {
		let updated = 0;
		for (let i = 0; i < this.mockDataArray.length; i++) {
			const item = this.mockDataArray[i];
			const matches = this.filters.every((filter) => filter(item));
			if (matches) {
				Object.assign(this.mockDataArray[i], this.updateData);
				updated++;
			}
		}
		return { count: updated };
	}
}

class MockDeleteBuilder {
	private mockDataArray: MockData;
	private filters: Array<(item: any) => boolean> = [];

	constructor(mockDataArray: MockData) {
		this.mockDataArray = mockDataArray;
	}

	where(condition: any) {
		this.filters.push((item) => {
			try {
				return condition(item);
			} catch {
				return false;
			}
		});
		return this;
	}

	async execute() {
		const toDelete: number[] = [];
		for (let i = 0; i < this.mockDataArray.length; i++) {
			const item = this.mockDataArray[i];
			const matches = this.filters.every((filter) => filter(item));
			if (matches) {
				toDelete.push(i);
			}
		}
		// Delete in reverse to maintain indices
		for (let i = toDelete.length - 1; i >= 0; i--) {
			this.mockDataArray.splice(toDelete[i], 1);
		}
		return { count: toDelete.length };
	}
}

function getTableData(table: any): MockData {
	// Handle query builder objects - return empty array silently
	if (table && typeof table === 'object' && ('then' in table || 'limit' in table)) {
		return [];
	}

	// Map table to mock data
	if (table === schema.user) return mockUsers;
	if (table === schema.session) return mockSessions;
	if (table === schema.settings) return mockSettings;
	if (table === schema.churches) return mockChurches;
	if (table === schema.youthEvents) return mockYouthEvents;
	if (table === schema.childrensEvents) return mockChildrensEvents;
	if (table === schema.bibleEducationEvents) return mockBibleEducationEvents;
	if (table === schema.gospelEvents) return mockGospelEvents;
	if (table === schema.musicEvents) return mockMusicEvents;
	if (table === schema.familyEvents) return mockFamilyEvents;
	if (table === schema.generalEvents) return mockGeneralEvents;
	if (table === schema.newsArticles) return mockNewsArticles;
	if (table === schema.youthNewsArticles) return mockYouthNewsArticles;
	if (table === schema.formSubmissions) return mockFormSubmissions;
	if (table === schema.childrensFiles) return mockChildrensFiles;
	if (table === schema.medias) return mockMedias;

	// Default empty array for unknown tables (no warning for query objects)
	return [];
}

export class MockDrizzle {
	// Expose mock data for direct access in queries
	_mockData = {
		youthEvents: mockYouthEvents,
		childrensEvents: mockChildrensEvents,
		bibleEducationEvents: mockBibleEducationEvents,
		gospelEvents: mockGospelEvents,
		musicEvents: mockMusicEvents,
		familyEvents: mockFamilyEvents,
		generalEvents: mockGeneralEvents,
		newsArticles: mockNewsArticles,
		youthNewsArticles: mockYouthNewsArticles
	};

	select(fields?: any) {
		const builder = new MockQueryBuilder([]);
		return builder.select(fields);
	}

	insert(table: any) {
		const mockData = getTableData(table);
		return new MockInsertBuilder(table, mockData);
	}

	update(table: any) {
		const mockData = getTableData(table);
		return new MockUpdateBuilder(mockData);
	}

	delete(table: any) {
		const mockData = getTableData(table);
		return new MockDeleteBuilder(mockData);
	}

	// Helper to get query builder with table data
	private getQueryBuilder(table: any) {
		const mockData = getTableData(table);
		return new MockQueryBuilder(mockData);
	}

	// Expose select().from() pattern
	query = {
		select: () => ({
			from: (table: any) => this.getQueryBuilder(table)
		})
	};

	// Special handling for unionAll - combine all event tables
	private getAllEvents() {
		return [
			...mockYouthEvents,
			...mockChildrensEvents,
			...mockBibleEducationEvents,
			...mockGospelEvents,
			...mockMusicEvents,
			...mockFamilyEvents,
			...mockGeneralEvents
		];
	}

	private getAllNewsArticles() {
		return [...mockNewsArticles, ...mockYouthNewsArticles];
	}
}

// Override the select().from() pattern used in queries
(MockQueryBuilder.prototype as any).from = function (this: MockQueryBuilder, table: any) {
	(this as any).data = getTableData(table);
	return this;
};

export function createMockDb(): MockDrizzle {
	return new MockDrizzle();
}

export type MockDb = MockDrizzle;
