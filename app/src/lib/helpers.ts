// Please, never have a helpers file
//
export function formatDate(dateString: string | null): string | null {
	if (!dateString) return null;
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

export function regionToLabel(key: string): string | undefined {
	return [
		{ key: 'all', label: 'Американское Объединение' },
		{ key: 'central', label: 'Центральный регион' },
		{ key: 'east', label: 'Восточный регион' },
		{ key: 'california', label: 'Калифорнийский регион' },
		{ key: 'north-west', label: 'Северо-Западный регион' }
	].find((r) => r.key === key)?.label;
}
