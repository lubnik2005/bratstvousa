<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	function dateRange(start: string | null, end: string | null): string {
		if (!start) return '';
		const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		if (!end) return s;
		const e = new Date(end).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
		return `${s} – ${e}`;
	}

	function longDate(s: string | null): string {
		if (!s) return '';
		return new Date(s.replace(' ', 'T') + 'Z').toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function daysUntil(s: string | null): number | null {
		if (!s) return null;
		const ms = new Date(s.replace(' ', 'T') + 'Z').getTime();
		if (Number.isNaN(ms)) return null;
		return Math.ceil((ms - Date.now()) / 86400000);
	}

	$: featured = data.open[0] ?? null;
	$: extras = data.open.slice(1);
	$: nextUpcoming = data.upcoming[0] ?? null;
	$: closesDays = featured ? daysUntil(featured.registrationEndAt) : null;
	$: filledPct =
		featured && featured.total > 0
			? Math.min(100, Math.round(((featured.total - featured.available) / featured.total) * 100))
			: 0;

	const btn =
		'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0';
	const card =
		'flex h-full flex-col rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5';
</script>

<svelte:head>
	<title>Camp Paradise — Register</title>
	<meta name="description" content="Reserve your spot at Camp Paradise." />
</svelte:head>

<section class="bg-forest-deep relative isolate overflow-hidden px-4 pt-16 pb-16 lg:pt-24 lg:pb-24">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(22,170,101,0.35),transparent_60%)]"
	></div>
	<div class="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:px-2">
		{#if featured}
			<div class="flex-1 text-center lg:text-left">
				<p class="eyebrow mb-3"><i class="bi bi-sun mr-1"></i>Registration is open</p>
				<h1 class="text-4xl text-balance text-white lg:text-6xl">{featured.name}</h1>
				{#if featured.startOn}
					<p class="text-mint/90 mt-4 text-lg">
						<i class="bi bi-calendar-event mr-2"></i>{dateRange(featured.startOn, featured.endOn)}
					</p>
				{/if}
				{#if featured.description}
					<p class="mx-auto mt-3 max-w-xl text-white/75 lg:mx-0">{featured.description}</p>
				{/if}

				<div class="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-white/15 lg:mx-0">
					<div
						class="bg-mint-bright h-full rounded-full transition-all"
						style="width: {filledPct}%"
					></div>
				</div>
				<p class="mt-2 text-sm text-white/70">
					{#if featured.available > 0}
						<strong class="text-white">{featured.available}</strong> of {featured.total} beds still open
					{:else}
						This camp is full
					{/if}
					{#if closesDays !== null && closesDays >= 0}
						· closes in {closesDays}
						{closesDays === 1 ? 'day' : 'days'}
					{/if}
				</p>

				{#if featured.tickets > 0}
					<p class="mt-3">
						<span class="rounded-full bg-mint/60 px-3 py-1 text-xs font-semibold text-primary-600">
							<i class="bi bi-ticket-perforated"></i>
							{featured.tickets} ticket{featured.tickets === 1 ? '' : 's'} available
						</span>
					</p>
				{/if}

				<div class="mt-8">
					{#if featured.available > 0}
						<a href="/{featured.id}" class="{btn} px-8 py-4 text-lg">
							{featured.tickets > 0 ? 'Reserve your bed' : 'Register now'}
							<i class="bi bi-arrow-right"></i>
						</a>
					{:else}
						<button class="{btn} px-8 py-4 text-lg" disabled>Sold out</button>
					{/if}
				</div>
			</div>
			<div class="hidden shrink-0 lg:block">
				<img
					src="/logo.png"
					alt="Camp Paradise"
					class="h-56 w-56 drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
				/>
			</div>
		{:else}
			<div class="mx-auto max-w-2xl text-center">
				<img
					src="/logo.png"
					alt="Camp Paradise"
					class="mx-auto mb-6 h-32 w-32 drop-shadow-[0_16px_32px_rgba(0,0,0,0.35)]"
				/>
				{#if nextUpcoming}
					<p class="eyebrow mb-3">
						<i class="bi bi-hourglass-split mr-1"></i>Registration opens soon
					</p>
					<h1 class="text-4xl text-balance text-white lg:text-6xl">{nextUpcoming.name}</h1>
					{#if nextUpcoming.startOn}
						<p class="text-mint/90 mt-4 text-lg">
							<i class="bi bi-calendar-event mr-2"></i>{dateRange(
								nextUpcoming.startOn,
								nextUpcoming.endOn
							)}
						</p>
					{/if}
					{#if nextUpcoming.registrationStartAt}
						<p class="mt-2 text-white/75">
							Registration opens {longDate(nextUpcoming.registrationStartAt)}
						</p>
					{/if}
				{:else}
					<h1 class="text-4xl text-balance text-white lg:text-6xl">See you next season</h1>
					<p class="text-mint/90 mx-auto mt-5 max-w-xl text-lg">
						No camps are open for registration right now. Check back soon — new sessions are
						announced here first.
					</p>
				{/if}
			</div>
		{/if}
	</div>
</section>

<section class="border-b border-ink/10 bg-white">
	<div class="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 py-8 text-center">
		<div>
			<div class="font-display text-3xl text-primary-600">
				{data.stats.campers.toLocaleString()}
			</div>
			<div class="text-xs tracking-wide text-ink-soft uppercase">Campers served</div>
		</div>
		<div>
			<div class="font-display text-3xl text-primary-600">{data.stats.camps}</div>
			<div class="text-xs tracking-wide text-ink-soft uppercase">Camps hosted</div>
		</div>
		<div>
			<div class="font-display text-3xl text-primary-600">2023</div>
			<div class="text-xs tracking-wide text-ink-soft uppercase">Serving since</div>
		</div>
	</div>
</section>

{#if extras.length > 0}
	<div class="mx-auto max-w-7xl px-4 py-12" id="camps">
		<h2 class="font-display mb-6 text-2xl">More open camps</h2>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each extras as event (event.id)}
				<div class={card}>
					<div class="mb-2 flex items-start justify-between gap-3">
						<h3 class="font-display text-xl">{event.name}</h3>
						{#if event.available > 0}
							<span class="rounded-full bg-mint/60 px-3 py-1 text-xs font-semibold text-primary-600"
								>{event.available} left</span
							>
						{:else}
							<span class="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink-soft"
								>Full</span
							>
						{/if}
					</div>
					<p class="text-sm text-ink-soft">{dateRange(event.startOn, event.endOn)}</p>
					{#if event.tickets > 0}
						<p class="mt-2 text-xs font-semibold text-primary-600">
							<i class="bi bi-ticket-perforated"></i>
							{event.tickets} ticket{event.tickets === 1 ? '' : 's'} available
						</p>
					{/if}
					{#if event.description}
						<p class="mt-2 text-sm">{event.description}</p>
					{/if}
					<div class="mt-auto pt-4">
						{#if event.available > 0}
							<a href={`/${event.id}`} class="{btn} w-full">Register</a>
						{:else}
							<button class="{btn} w-full" disabled>Sold out</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<section class="border-t border-ink/10 bg-white">
	<div class="mx-auto max-w-7xl px-4 py-14">
		<h2 class="font-display mb-10 text-center text-2xl">How it works</h2>
		<div class="grid gap-8 text-center md:grid-cols-3">
			<div>
				<div
					class="font-display mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white"
				>
					1
				</div>
				<h3 class="font-display mt-4 text-lg">Pick a camp</h3>
				<p class="mt-1 text-sm text-ink-soft">Choose an open session that fits your season.</p>
			</div>
			<div>
				<div
					class="font-display mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white"
				>
					2
				</div>
				<h3 class="font-display mt-4 text-lg">Choose your bed</h3>
				<p class="mt-1 text-sm text-ink-soft">
					Select a room and an open bed, then add your details.
				</p>
			</div>
			<div>
				<div
					class="font-display mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white"
				>
					3
				</div>
				<h3 class="font-display mt-4 text-lg">Reserve your spot</h3>
				<p class="mt-1 text-sm text-ink-soft">
					Agree to the camp rules and confirm your registration.
				</p>
			</div>
		</div>
	</div>
</section>

{#if data.upcoming.length > 0}
	<div class="mx-auto max-w-7xl px-4 py-12">
		<h2 class="font-display text-2xl">Coming up</h2>
		<p class="mb-6 text-sm text-ink-soft">Announced sessions — registration isn't open yet.</p>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.upcoming as event (event.id)}
				<div class={card}>
					<div class="mb-2 flex items-start justify-between gap-3">
						<h3 class="font-display text-xl">{event.name}</h3>
						<span class="rounded-full bg-sand-warm px-3 py-1 text-xs font-semibold text-ink-soft"
							>Soon</span
						>
					</div>
					<p class="text-sm text-ink-soft">{dateRange(event.startOn, event.endOn)}</p>
					{#if event.registrationStartAt}
						<p class="mt-2 text-sm">Opens {longDate(event.registrationStartAt)}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

{#if data.past.length > 0}
	<section class="border-t border-ink/10 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-12">
			<h2 class="font-display mb-4 text-xl text-ink-soft">Past camps</h2>
			<ul class="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
				{#each data.past as event (event.id)}
					<li class="flex justify-between border-b border-ink/10 py-1 text-sm text-ink-soft">
						<span>{event.name}</span>
						<span>{dateRange(event.startOn, event.endOn)}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}
