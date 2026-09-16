<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const badge: Record<string, string> = {
		held: 'text-bg-warning',
		confirmed: 'text-bg-success',
		cancelled: 'text-bg-secondary',
		refunded: 'text-bg-secondary'
	};

	$: r = data.reservation;
	$: status = form?.refunded ? 'refunded' : r.status;
</script>

<svelte:head>
	<title>Reservation {r.confirmationCode}</title>
</svelte:head>

<div class="container py-5" style="max-width: 560px;">
	<a href="/" class="text-decoration-none small text-success fw-semibold">
		<i class="bi bi-arrow-left me-1"></i>Home
	</a>
	<div class="cp-card mt-3 overflow-hidden">
		{#if status === 'confirmed'}
			<div class="cp-hero text-center py-4">
				<i class="bi bi-check-circle-fill fs-1"></i>
				<p class="mb-0 mt-2 fw-semibold">You're all set — see you at camp!</p>
			</div>
		{/if}
		<div class="p-4">
			<div class="d-flex justify-content-between align-items-start">
				<h1 class="h4 mb-0">{data.eventName}</h1>
				<span class="badge {badge[status] ?? 'text-bg-light'} text-capitalize">{status}</span>
			</div>
			<p class="text-muted mt-1 mb-1">Confirmation code</p>
			<p class="h5 font-monospace">{r.confirmationCode}</p>

			<hr />
			<dl class="row mb-0">
				<dt class="col-5 text-muted fw-normal">Name</dt>
				<dd class="col-7">{r.firstName} {r.lastName}</dd>
				<dt class="col-5 text-muted fw-normal">Email</dt>
				<dd class="col-7">{r.email}</dd>
				<dt class="col-5 text-muted fw-normal">Room</dt>
				<dd class="col-7">{data.roomName}</dd>
				<dt class="col-5 text-muted fw-normal">Amount</dt>
				<dd class="col-7">${(r.price / 100).toFixed(2)}</dd>
			</dl>

			{#if form?.refunded}
				<div class="alert alert-success mt-3 mb-0">
					Your reservation has been cancelled and refunded.
				</div>
			{:else if data.refundable}
				<hr />
				<form method="post" action="?/refund" use:enhance>
					{#if form?.message}<div class="alert alert-danger py-2">{form.message}</div>{/if}
					<button class="btn btn-outline-danger w-100 rounded-pill" type="submit">
						Cancel &amp; request refund
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
