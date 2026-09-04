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

type EventLike = {
	description?: string | null;
	content?: string | null;
	editorjs?: unknown;
	use_editorjs?: unknown;
};

// An event is a dead-end (non-clickable) when its detail page would only show a
// title. The `description` field is a short subtitle (usually a location like
// "Chicago, IL"), not real page content — so it does NOT count. Only actual body
// content (`content` or non-empty editorjs blocks) makes the detail page worth a
// visit.
export function hasEventContent(event: EventLike): boolean {
	if (event.content && event.content.trim()) return true;

	const raw = event.editorjs;
	if (raw) {
		try {
			const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
			if (parsed && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
				return true;
			}
		} catch {
			// Not valid JSON — treat as empty.
		}
	}

	return false;
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
