import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { campRegistrations, youthLeaders } from '$lib/server/db/schema';
import { sendRegistrantApproved } from '$lib/server/email/camp';
import type { Actions, PageServerLoad } from './$types';

async function findByToken(db: App.Locals['db'], token: string) {
	const rows = await db
		.select()
		.from(campRegistrations)
		.where(eq(campRegistrations.approvalToken, token))
		.limit(1);
	return rows[0];
}

export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token') ?? '';
	if (!token) {
		return { state: 'invalid' as const };
	}

	let reg;
	try {
		reg = await findByToken(locals.db, token);
	} catch (err) {
		console.error('camp-approval load failed:', err);
		return { state: 'invalid' as const };
	}

	if (!reg) {
		return { state: 'invalid' as const };
	}

	// Already decided — show the outcome, no further action.
	if (reg.status === 'approved' || reg.status === 'rejected') {
		return {
			state: 'decided' as const,
			decision: reg.status,
			registrant: {
				firstName: reg.firstName,
				lastName: reg.lastName,
				email: reg.email,
				phone: reg.phone,
				church: reg.church,
				confirmationCode: reg.confirmationCode
			}
		};
	}

	return {
		state: 'pending' as const,
		token,
		registrant: {
			firstName: reg.firstName,
			lastName: reg.lastName,
			email: reg.email,
			phone: reg.phone,
			church: reg.church,
			confirmationCode: reg.confirmationCode
		}
	};
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		const fd = await request.formData();
		const token = (fd.get('token') as string) ?? '';
		if (!token) return fail(400, { message: 'Недействительная ссылка.' });

		const db = locals.db;
		const reg = await findByToken(db, token);
		if (!reg) return fail(404, { message: 'Заявка не найдена.' });
		if (reg.status === 'approved' || reg.status === 'rejected') {
			return fail(409, { message: 'Решение по этой заявке уже принято.' });
		}

		const now = new Date().toISOString();
		let leaderName = 'youth leader';
		if (reg.leaderId != null) {
			try {
				const rows = await db
					.select({ name: youthLeaders.name })
					.from(youthLeaders)
					.where(eq(youthLeaders.id, reg.leaderId))
					.limit(1);
				if (rows[0]) leaderName = rows[0].name;
			} catch {
				// non-fatal; approvedBy just falls back to a generic label
			}
		}

		await db
			.update(campRegistrations)
			.set({ status: 'approved', approvedBy: leaderName, approvedAt: now, updatedAt: now })
			.where(eq(campRegistrations.id, reg.id));

		// Send the Zeffy payment email to the registrant (best-effort).
		if (reg.email && reg.confirmationCode) {
			const zeffyUrl = env.ZEFFY_URL ?? '#';
			try {
				await sendRegistrantApproved({
					registrant: {
						firstName: reg.firstName,
						lastName: reg.lastName,
						email: reg.email,
						phone: reg.phone,
						church: reg.church,
						confirmationCode: reg.confirmationCode
					},
					zeffyUrl
				});
			} catch (err) {
				console.error('approved email failed:', err);
			}
		}

		return { done: 'approved' as const };
	},

	reject: async ({ request, locals }) => {
		const fd = await request.formData();
		const token = (fd.get('token') as string) ?? '';
		if (!token) return fail(400, { message: 'Недействительная ссылка.' });

		const db = locals.db;
		const reg = await findByToken(db, token);
		if (!reg) return fail(404, { message: 'Заявка не найдена.' });
		if (reg.status === 'approved' || reg.status === 'rejected') {
			return fail(409, { message: 'Решение по этой заявке уже принято.' });
		}

		const now = new Date().toISOString();
		await db
			.update(campRegistrations)
			.set({ status: 'rejected', approvedAt: now, updatedAt: now })
			.where(eq(campRegistrations.id, reg.id));

		// No email is sent on rejection (per spec).
		return { done: 'rejected' as const };
	}
};
