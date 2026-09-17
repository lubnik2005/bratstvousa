<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const badge: Record<string, string> = {
		held: 'bg-amber-100 text-amber-800',
		confirmed: 'bg-mint/60 text-primary-600',
		cancelled: 'bg-ink/10 text-ink-soft',
		refunded: 'bg-ink/10 text-ink-soft'
	};

	$: r = data.reservation;
	$: status = form?.refunded ? 'refunded' : r.status;
</script>

<svelte:head>
	<title>Reservation {r.confirmationCode}</title>
</svelte:head>

<div class="mx-auto max-w-xl px-4 py-10 lg:py-14">
	<a href="/camps" class="text-sm font-semibold text-primary-600 hover:text-primary">
		<i class="bi bi-arrow-left mr-1"></i>All camps
	</a>
	<div class="mt-4 overflow-hidden rounded-3xl bg-white shadow-xl shadow-ink/5 ring-1 ring-ink/5">
		{#if status === 'confirmed'}
			<div class="bg-forest-deep px-6 py-8 text-center text-white">
				<i class="bi bi-check-circle-fill text-mint-bright text-4xl"></i>
				<p class="text-mint mt-2 font-semibold">You're all set — see you at camp!</p>
			</div>
		{/if}
		<div class="p-6 sm:p-8">
			<div class="flex items-start justify-between gap-3">
				<h1 class="text-2xl">{data.eventName}</h1>
				<span
					class="rounded-full px-3 py-1 text-xs font-semibold capitalize {badge[status] ??
						'bg-ink/10 text-ink-soft'}">{status}</span
				>
			</div>
			<p class="text-ink-soft mt-3 text-sm">Confirmation code</p>
			<p class="font-display text-xl tracking-wide">{r.confirmationCode}</p>

			<dl class="mt-5 grid gap-x-6 gap-y-3 border-t border-ink/10 pt-5 sm:grid-cols-3">
				<dt class="text-ink-soft text-sm">Name</dt>
				<dd class="font-medium sm:col-span-2">{r.firstName} {r.lastName}</dd>
				<dt class="text-ink-soft text-sm">Email</dt>
				<dd class="font-medium sm:col-span-2">{r.email}</dd>
				<dt class="text-ink-soft text-sm">Room</dt>
				<dd class="font-medium sm:col-span-2">{data.roomName}</dd>
				<dt class="text-ink-soft text-sm">Amount</dt>
				<dd class="font-medium sm:col-span-2">${(r.price / 100).toFixed(2)}</dd>
			</dl>

			{#if form?.refunded}
				<div class="bg-mint/50 text-primary-600 mt-5 rounded-xl px-4 py-3 text-sm font-medium">
					Your reservation has been cancelled and refunded.
				</div>
			{:else if data.refundable}
				<form method="post" action="?/refund" use:enhance class="mt-5 border-t border-ink/10 pt-5">
					{#if form?.message}
						<div class="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
							{form.message}
						</div>
					{/if}
					<button
						class="inline-flex w-full items-center justify-center rounded-full border border-red-200 px-6 py-3 font-semibold text-red-700 transition-colors hover:bg-red-50"
						type="submit"
					>
						Cancel &amp; request refund
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
