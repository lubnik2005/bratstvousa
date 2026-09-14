import { sendEmail } from '$lib/email';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { churches, formSubmissions } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { email_template } from './email';
import { admin_paths } from '$lib/admin/path';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';

export const load: PageServerLoad = async ({ locals }) => {
	const allChurches = await locals.db.select().from(churches).orderBy(desc(churches.state));
	return {
		churches: allChurches.sort((a, b) => {
			const stateA = a.city?.split(', ')[1] ?? '';
			const stateB = b.city?.split(', ')[1] ?? '';

			if (stateA < stateB) return -1;
			if (stateA > stateB) return 1;

			const cityA = a.city?.split(', ')[0] ?? '';
			const cityB = b.city?.split(', ')[0] ?? '';
			return cityA.localeCompare(cityB);
		}),
		media_url: env.MEDIA_URL
	};
};

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const db = locals.db;
		const data = await request.formData();

		const ts = await verifyTurnstile(
			data.get('cf-turnstile-response') as string | null,
			platform?.env?.TURNSTILE_SECRET_KEY,
			request.headers.get('cf-connecting-ip'),
			'order_form',
			platform?.env?.TURNSTILE_HOSTNAMES
		);
		if (!ts.ok) {
			return fail(403, { error: TURNSTILE_ERROR_MESSAGE, success: false });
		}

		const address = (data.get('address') as string | null)?.trim() || '';
		const phone = (data.get('phone') as string | null)?.trim() || '';
		const email = (data.get('email') as string | null)?.trim() || '';

		const first_name = (data.get('first_name') as string | null)?.trim() || '';
		const last_name = (data.get('last_name') as string | null)?.trim() || '';

		const qty_rus = Number(data.get('qty_rus') ?? 0) || 0;
		const qty_rus_eng = Number(data.get('qty_rus_eng') ?? 0) || 0;
		const qty_rus_eng_rom = Number(data.get('qty_rus_eng_rom') ?? 0) || 0;

		if (!address || !first_name || !last_name || !phone || !email) {
			return fail(400, { error: 'Проверьте обязательные поля', success: false });
		}

		const churchId = data.get('church') !== 'other' ? Number(data.get('church')) : null;
		let church_name = null;
		if (churchId) {
			const cs = (await db.select().from(churches).where(eq(churches.id, churchId)).limit(1))[0];
			church_name = `<a href="${env.ADMIN_URL}${admin_paths.church.one(cs.id.toString())}"> ID: ${cs.id} | Name: ${cs.name_line_1} ${cs.name_line_2 ?? ''} | State: ${cs.state} | City: ${cs.city} | Region: ${cs.region} | Address: ${cs.address_line_1} ${cs.address_line_2 ?? ''} </a>`;
		}
		const newChurch = data.get('church') === 'other' ? data.get('new_church') : null;
		church_name = church_name ?? `Other church: ${newChurch}`;

		const formData = {
			formName: '2025-brothers-fellowship-meetings-request-form',
			firstName: data.get('first_name') as string | null,
			lastName: data.get('last_name') as string | null,
			middleName: data.get('middle_name') as string | null,
			email: data.get('email') as string | null,
			phone: data.get('phone') as string | null,
			church_name,
			churchId,
			address,
			content: JSON.parse(
				JSON.stringify({
					qty_rus_eng,
					qty_rus,
					qty_rus_eng_rom
				})
			)
		};

		const to = env.MAIL_INFO_USER ?? '';
		const subject = `${formData.firstName} ${formData.lastName} - Заявка на печатные экземпляры`;

		const content = formData.content;
		const html = email_template({
			...formData,
			...content,
			church_name
		});
		await sendEmail(to, subject, html);

		return { success: true };
	}
};
