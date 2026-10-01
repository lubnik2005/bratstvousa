<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

	const parseUtc = (s: string) => new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');

	const longDate = (s: string | null | undefined): string => {
		if (!s) return '—';
		return parseUtc(s).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
	};

	const dateRange = (start: string | null | undefined, end: string | null | undefined): string => {
		if (!start) return '';
		const a = parseUtc(start);
		const b = end ? parseUtc(end) : a;
		const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
		const from = a.toLocaleDateString('en-US', opts);
		const to = b.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
		return `${from} – ${to}`;
	};

	const daysUntil = (s: string | null | undefined): number => {
		if (!s) return -1;
		return Math.ceil((parseUtc(s).getTime() - Date.now()) / 86_400_000);
	};

	const btn =
		'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0';
	const card =
		'flex h-full flex-col rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5';
	const badge = 'rounded-full px-3 py-1 text-xs font-semibold';
</script>

<svelte:head>
	<title>Camp Paradise — Camps</title>
</svelte:head>

<section class="bg-forest-deep relative isolate overflow-hidden px-4 pt-12 pb-12 lg:pt-16 lg:pb-16">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(91,228,155,0.18),transparent_60%)]"
	></div>
	<div class="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Camps</p>
			<h1 class="mt-2 text-3xl text-white lg:text-5xl">Hi, {data.camper?.firstName ?? 'camper'}</h1>
			<p class="mt-2 text-mint/90">Pick a camp below to reserve your bed.</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<span class="{badge} bg-white/85 text-primary-600">
				<i class="bi bi-wallet2"></i> Balance: {dollars(data.balanceCents)}
			</span>
			{#if data.topupUrl}
				<a
					href={data.topupUrl}
					target="_blank"
					rel="noopener"
					class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:shadow-xl active:scale-95"
				>
					<i class="bi bi-plus-circle"></i> Top up
				</a>
			{/if}
			{#if data.balanceCents > 0}
				<a
					href="/account#refund"
					class="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
				>
					<i class="bi bi-arrow-counterclockwise"></i> Request refund
				</a>
			{/if}
		</div>
	</div>
</section>

<div class="mx-auto max-w-7xl px-4 py-10 lg:py-14">
	<h2 class="text-2xl">Open for registration</h2>

	{#if data.open.length === 0}
		<div class="mt-4 rounded-3xl bg-white p-8 text-center shadow-xl shadow-ink/5 ring-1 ring-ink/5">
			<i class="bi bi-calendar-x text-3xl text-ink-soft"></i>
			<p class="mt-3 font-semibold">No camps are open right now.</p>
			<p class="mt-1 text-sm text-ink-soft">
				{data.upcoming.length > 0
					? 'Check the upcoming camps below — registration opens soon.'
					: 'Check back later for the next season.'}
			</p>
		</div>
	{:else}
		<div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.open as event (event.id)}
				{@const days = daysUntil(event.registrationEndAt)}
				<article class={card}>
					<div class="flex items-start justify-between gap-3">
						<h3 class="text-xl">{event.name}</h3>
						{#if event.available > 0}
							<span class="{badge} shrink-0 bg-mint/60 text-primary-600">
								{event.available} of {event.total} beds open
							</span>
						{:else}
							<span class="{badge} shrink-0 bg-ink/10 text-ink-soft">Full</span>
						{/if}
					</div>
					<p class="mt-2 text-sm text-ink-soft">
						<i class="bi bi-calendar3"></i>
						{dateRange(event.startOn, event.endOn)}
					</p>
					{#if days >= 0}
						<p class="mt-1 text-xs text-ink-soft">
							Registration closes in {days} day{days === 1 ? '' : 's'}
						</p>
					{/if}
					{#if event.description}
						<p class="mt-3 text-sm text-ink-soft">{event.description}</p>
					{/if}
					<div class="mt-auto pt-5">
						{#if event.booked}
							<div class="rounded-2xl bg-mint/40 px-4 py-3 text-sm">
								<p class="font-semibold text-primary-600">
									<i class="bi bi-check-circle-fill"></i>
									You're booked{event.booked.roomName ? ` · ${event.booked.roomName}` : ''}
								</p>
								{#if event.booked.confirmationCode}
									<p class="mt-1 font-mono text-xs text-ink-soft">
										{event.booked.confirmationCode}
									</p>
								{/if}
							</div>
							{#if event.booked.confirmationCode}
								<a href="/reservation/{event.booked.confirmationCode}" class="{btn} mt-3 w-full">
									View reservation
								</a>
							{/if}
						{:else if event.available > 0}
							<a href="/{event.id}" class="{btn} w-full">
								Reserve your bed <i class="bi bi-arrow-right"></i>
							</a>
						{:else}
							<button type="button" class="{btn} w-full" disabled>Sold out</button>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}

	{#if data.upcoming.length > 0}
		<h2 class="mt-12 text-2xl">Coming up</h2>
		<p class="mt-1 text-sm text-ink-soft">Announced sessions — registration isn't open yet.</p>
		<div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.upcoming as event (event.id)}
				<article class={card}>
					<div class="flex items-start justify-between gap-3">
						<h3 class="text-xl">{event.name}</h3>
						<span class="{badge} shrink-0 bg-sand-warm text-ink-soft">Soon</span>
					</div>
					<p class="mt-2 text-sm text-ink-soft">
						<i class="bi bi-calendar3"></i>
						{dateRange(event.startOn, event.endOn)}
					</p>
					<p class="mt-1 text-xs text-ink-soft">
						Opens {longDate(event.registrationStartAt)}
					</p>
					{#if event.description}
						<p class="mt-3 text-sm text-ink-soft">{event.description}</p>
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</div>
