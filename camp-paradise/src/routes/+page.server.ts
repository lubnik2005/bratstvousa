import { listPublishedEvents, eventCapacity } from '$lib/server/paradise/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	let events: Array<{
		id: number;
		name: string;
		startOn: string | null;
		endOn: string | null;
		description: string | null;
		total: number;
		available: number;
	}> = [];

	try {
		const rows = await listPublishedEvents(locals.db);
		for (const e of rows) {
			const cap = await eventCapacity(locals.db, e.id);
			events.push({
				id: e.id,
				name: e.name,
				startOn: e.startOn,
				endOn: e.endOn,
				description: e.description,
				total: cap.total,
				available: cap.available
			});
		}
	} catch (err) {
		console.error('load events failed:', err);
	}

	return { events };
};
