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

// Parse a 'YYYY-MM-DD' string into a local Date without timezone drift.
function parseYmd(value: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
	if (!match) {
		const fallback = new Date(value);
		return isNaN(fallback.getTime()) ? null : fallback;
	}
	const [, y, m, d] = match;
	return new Date(Number(y), Number(m) - 1, Number(d));
}

// Human-readable Russian date range that collapses shared parts:
//  - single day        -> "15 октября 2026"
//  - same month & year -> "15–18 октября 2026"
//  - same year         -> "28 октября – 3 ноября 2026"
//  - different years    -> "30 декабря 2026 – 2 января 2027"
export function formatDateRange(
	startAt: string | null,
	endAt: string | null
): string | null {
	if (!startAt) return null;
	const start = parseYmd(startAt);
	if (!start) return null;

	const full = new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
	const dayOnly = new Intl.DateTimeFormat('ru-RU', { day: 'numeric' });
	const dayMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });

	const end = endAt ? parseYmd(endAt) : null;
	if (!end || end.getTime() === start.getTime()) {
		return full.format(start);
	}

	if (start.getFullYear() === end.getFullYear()) {
		if (start.getMonth() === end.getMonth()) {
			// "15–18 октября 2026"
			return `${dayOnly.format(start)}–${full.format(end)}`;
		}
		// "28 октября – 3 ноября 2026"
		return `${dayMonth.format(start)} – ${full.format(end)}`;
	}

	// "30 декабря 2026 – 2 января 2027"
	return `${full.format(start)} – ${full.format(end)}`;
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
