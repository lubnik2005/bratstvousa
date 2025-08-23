// +page.server.ts
import { sendEmail } from '$lib/email';
import type { Actions } from './$types';
import { fail /*, redirect*/ } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { churches, formSubmissions, FormSubmission } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { email_template } from './email';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {admin_paths} from '$lib/admin/path';


	let selectedChurch = '';
	let newChurch = '';
	let useNewChurch = false;

export async function load() {
	return {
		churches: (await db.select().from(churches).orderBy(desc(churches.state))).sort((a, b) => {
			const stateA = a.city.split(', ')[1];
			const stateB = b.city.split(', ')[1];

			if (stateA < stateB) return -1;
			if (stateA > stateB) return 1;

			// If states are the same, compare cities
			const cityA = a.city.split(', ')[0];
			const cityB = b.city.split(', ')[0];
			return cityA.localeCompare(cityB);
		}),
		media_url: env.MEDIA_URL
	};
}

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const address = (data.get('address') as string | null)?.trim() || '';
    const phone = (data.get('phone') as string | null)?.trim() || '';
    const email = (data.get('email') as string | null)?.trim() || '';

    const first_name = (data.get('first_name') as string | null)?.trim() || '';
    const last_name = (data.get('last_name') as string | null)?.trim() || '';

    const qty_rus = Number(data.get('qty_rus') ?? 0) || 0;
    const qty_rus_eng = Number(data.get('qty_rus_eng') ?? 0) || 0;
    const qty_rus_eng_rom = Number(data.get('qty_rus_eng_rom') ?? 0) || 0;

    if ( !address || !first_name || !last_name || !phone || !email) {
      return fail(400, { error: 'Проверьте обязательные поля', success: false });
    }

    const totalQty = qty_rus + qty_rus_eng + qty_rus_eng_rom;
    const totalCost = totalQty * 5;

    // TODO: persist or notify (DB, email, Slack, etc.)
    // Example: send an email via SES API (recommended over SMTP in SvelteKit)
    
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
			firstName: data.get('first_name'),
			lastName: data.get('last_name'),
			middleName: data.get('middle_name'),
			email: data.get('email'),
			phone: data.get('phone'),
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

		const to = env.MAIL_INFO_USER;
		const subject = `${formData.firstName} ${formData.lastName} - Заявка на печатные экземпляры`;

		const content = formData.content;
		const html = email_template({
			...formData,
			...content,
			church_name
		});
    const result = await sendEmail(to, subject, html);


    return { success: true };
    // or: throw redirect(303, '/thanks');
  }
};

