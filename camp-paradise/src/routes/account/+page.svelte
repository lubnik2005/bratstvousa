<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const badge: Record<string, string> = {
		held: 'text-bg-warning',
		confirmed: 'text-bg-success',
		cancelled: 'text-bg-secondary',
		refunded: 'text-bg-secondary'
	};

	function longDate(s: string | null): string {
		if (!s) return '';
		const d = new Date(s.replace(' ', 'T') + 'Z');
		if (isNaN(d.getTime())) return '';
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	function dateRange(start: string | null, end: string | null): string {
		const a = longDate(start);
		const b = longDate(end);
		if (a && b) return `${a} – ${b}`;
		return a || b || '';
	}

	function dollars(cents: number): string {
		return `$${(cents / 100).toFixed(2)}`;
	}

	$: openCamps = data.open ?? [];
</script>

<svelte:head>
	<title>My reservations · Camp Paradise</title>
</svelte:head>

<div class="container py-5" style="max-width: 760px">
	<div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
		<div>
			<h1 class="cp-display mb-1">Hi, {data.camper.firstName}</h1>
			<p class="text-muted mb-0">{data.camper.email}</p>
		</div>
		<form method="post" action="?/signout">
			<button type="submit" class="btn btn-sm btn-outline-secondary rounded-pill px-3">
				Sign out
			</button>
		</form>
	</div>

	{#if openCamps.length > 0}
		<h2 class="h5 mb-3">Open camps</h2>
		<div class="row g-3 mb-5">
			{#each openCamps as c (c.id)}
				<div class="col-sm-6">
					<div class="cp-card p-4 h-100 d-flex flex-column">
						<h3 class="h6 mb-1">{c.name}</h3>
						<p class="text-muted small mb-2">{dateRange(c.startOn, c.endOn)}</p>
						{#if c.available > 0}
							<span class="cp-badge-avail mb-3">{c.available} of {c.total} beds open</span>
						{:else}
							<span class="badge text-bg-secondary mb-3">Full</span>
						{/if}
						<a
							href={`/${c.id}`}
							class="btn btn-primary rounded-pill px-4 mt-auto align-self-start"
							class:disabled={c.available === 0}
						>
							{c.available > 0 ? 'Register' : 'Sold out'}
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<h2 class="h5 mb-3">My reservations</h2>

	{#if data.reservations.length === 0}
		<div class="cp-card p-5 text-center">
			<i class="bi bi-calendar-heart fs-1 text-success"></i>
			<p class="mt-3 mb-4 text-muted">You don't have any reservations yet.</p>
			<a href="/camps" class="btn btn-primary rounded-pill px-4">Browse camps</a>
		</div>
	{:else}
		<div class="d-flex flex-column gap-3">
			{#each data.reservations as r (r.id)}
				<div class="cp-card p-4">
					<div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
						<div>
							<h3 class="h6 mb-1">{r.eventName ?? 'Camp'}</h3>
							<p class="text-muted small mb-1">{dateRange(r.startOn, r.endOn)}</p>
							{#if r.roomName}
								<p class="small mb-0"><i class="bi bi-house-door me-1"></i>{r.roomName}</p>
							{/if}
						</div>
						<div class="text-end">
							<span class="badge {badge[r.status] ?? 'text-bg-secondary'} mb-2">{r.status}</span>
							<div class="fw-semibold">{dollars(r.price)}</div>
						</div>
					</div>
					{#if r.confirmationCode}
						<div class="mt-3 pt-3 border-top">
							<a
								href={`/reservation/${r.confirmationCode}`}
								class="text-decoration-none small text-success fw-semibold"
							>
								View reservation <i class="bi bi-arrow-right"></i>
							</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="mt-4">
		<a href="/camps" class="text-decoration-none small text-success fw-semibold">
			<i class="bi bi-arrow-left me-1"></i>Back to camps
		</a>
	</div>
</div>
