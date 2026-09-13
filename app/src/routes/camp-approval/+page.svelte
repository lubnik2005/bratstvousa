<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let submitting = false;
</script>

<svelte:head>
	<title>Одобрение заявки на лагерь</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container-xxl py-6">
	<div class="container">
		<div class="approval-shell mx-auto">
			<h1 class="approval-title">Заявка на лагерь</h1>

			{#if form?.done === 'approved'}
				<div class="approval-result ok">
					<div class="approval-check">✓</div>
					<h2>Заявка одобрена</h2>
					<p>Участнику отправлено письмо со ссылкой для оплаты.</p>
				</div>
			{:else if form?.done === 'rejected'}
				<div class="approval-result">
					<div class="approval-check reject">✕</div>
					<h2>Заявка отклонена</h2>
					<p>Участник не получит письмо для оплаты.</p>
				</div>
			{:else if data.state === 'invalid'}
				<div class="approval-result">
					<h2>Ссылка недействительна</h2>
					<p>Эта ссылка одобрения недействительна или устарела.</p>
				</div>
			{:else if data.state === 'decided'}
				<div class="approval-result">
					<h2>Решение уже принято</h2>
					<p>
						По этой заявке уже вынесено решение:
						<strong>{data.decision === 'approved' ? 'одобрена' : 'отклонена'}</strong>.
					</p>
				</div>
			{:else if data.state === 'pending'}
				<p class="approval-lead">Проверьте данные участника и примите решение.</p>

				<table class="approval-table">
					<tbody>
						<tr><th>Имя</th><td>{data.registrant.firstName} {data.registrant.lastName}</td></tr>
						<tr><th>Email</th><td>{data.registrant.email ?? '—'}</td></tr>
						<tr><th>Телефон</th><td>{data.registrant.phone ?? '—'}</td></tr>
						<tr><th>Церковь</th><td>{data.registrant.church ?? '—'}</td></tr>
						<tr><th>Код</th><td>{data.registrant.confirmationCode ?? '—'}</td></tr>
					</tbody>
				</table>

				{#if form?.message}
					<div class="approval-error">{form.message}</div>
				{/if}

				<div class="approval-actions">
					<form
						method="post"
						action="?/approve"
						use:enhance={() => {
							submitting = true;
							return async ({ update }) => {
								await update();
								submitting = false;
							};
						}}
					>
						<input type="hidden" name="token" value={data.token} />
						<button class="btn btn-success" type="submit" disabled={submitting}> Одобрить </button>
					</form>
					<form
						method="post"
						action="?/reject"
						use:enhance={() => {
							submitting = true;
							return async ({ update }) => {
								await update();
								submitting = false;
							};
						}}
					>
						<input type="hidden" name="token" value={data.token} />
						<button class="btn btn-outline-danger" type="submit" disabled={submitting}>
							Отклонить
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.approval-shell {
		max-width: 32rem;
		background: var(--bs-paper, #f6f2ea);
		border: 1px solid var(--bs-rule, #ddd5c8);
		padding: 2.25rem;
	}
	.approval-title {
		font-family: var(--bs-font-serif, 'Lora'), serif;
		font-size: 1.75rem;
		margin: 0 0 1rem;
	}
	.approval-lead {
		color: var(--bs-ink-muted, #736a5f);
		margin: 0 0 1.5rem;
	}
	.approval-table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.75rem;
	}
	.approval-table th,
	.approval-table td {
		text-align: left;
		padding: 0.6rem 0.5rem;
		border-bottom: 1px solid var(--bs-rule, #ddd5c8);
		vertical-align: top;
	}
	.approval-table th {
		color: var(--bs-ink-muted, #736a5f);
		font-weight: 600;
		width: 8rem;
	}
	.approval-actions {
		display: flex;
		gap: 1rem;
	}
	.approval-actions .btn {
		padding: 0.6rem 1.5rem;
	}
	.approval-error {
		color: #b3261e;
		margin-bottom: 1rem;
	}
	.approval-result {
		text-align: center;
		padding: 1.5rem 0;
	}
	.approval-result h2 {
		font-family: var(--bs-font-serif, 'Lora'), serif;
	}
	.approval-check {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		background: #16a34a;
		color: #fff;
		font-size: 1.75rem;
		line-height: 3.5rem;
		margin: 0 auto 1rem;
	}
	.approval-check.reject {
		background: #b3261e;
	}
</style>
