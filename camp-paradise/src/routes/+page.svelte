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
</script>

<svelte:head>
	<title>Camp Paradise — Register</title>
	<meta name="description" content="Reserve your spot at Camp Paradise." />
</svelte:head>

{#if featured}
	<section class="cp-hero py-5">
		<div class="container py-4 py-lg-5">
			<div class="row align-items-center g-4">
				<div class="col-lg-7">
					<span class="badge cp-badge-avail rounded-pill mb-3 px-3 py-2">
						<i class="bi bi-sun me-1"></i>Registration is open
					</span>
					<h1 class="display-3 fw-bold mb-3">{featured.name}</h1>
					{#if featured.startOn}
						<p class="lead mb-2 opacity-90">
							<i class="bi bi-calendar-event me-2"></i>{dateRange(featured.startOn, featured.endOn)}
						</p>
					{/if}
					{#if featured.description}
						<p class="mb-4 opacity-90" style="max-width: 34rem">{featured.description}</p>
					{/if}

					<div class="cp-progress mb-2" style="max-width: 26rem">
						<div class="cp-progress-bar" style="width: {filledPct}%"></div>
					</div>
					<p class="small opacity-90 mb-4">
						{#if featured.available > 0}
							<strong>{featured.available}</strong> of {featured.total} beds still open
						{:else}
							This camp is full
						{/if}
						{#if closesDays !== null && closesDays >= 0}
							· closes in {closesDays}
							{closesDays === 1 ? 'day' : 'days'}
						{/if}
					</p>

					{#if featured.available > 0}
						<a
							href="/{featured.id}"
							class="btn btn-light btn-lg rounded-pill px-4 fw-semibold text-success"
						>
							Register now <i class="bi bi-arrow-right ms-1"></i>
						</a>
					{:else}
						<button class="btn btn-light btn-lg rounded-pill px-4 fw-semibold" disabled>
							Sold out
						</button>
					{/if}
				</div>
				<div class="col-lg-5 text-center d-none d-lg-block">
					<img
						src="/logo-single.svg"
						alt="Camp Paradise"
						class="img-fluid"
						style="max-height: 220px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.25))"
					/>
				</div>
			</div>
		</div>
	</section>
{:else}
	<section class="cp-hero py-5">
		<div class="container py-5 text-center">
			<img
				src="/logo-single.svg"
				alt="Camp Paradise"
				class="img-fluid mb-4"
				style="max-height: 140px; filter: drop-shadow(0 16px 32px rgba(0,0,0,0.25))"
			/>
			{#if nextUpcoming}
				<span class="badge cp-badge-avail rounded-pill mb-3 px-3 py-2">
					<i class="bi bi-hourglass-split me-1"></i>Registration opens soon
				</span>
				<h1 class="display-4 fw-bold mb-3">{nextUpcoming.name}</h1>
				{#if nextUpcoming.startOn}
					<p class="lead opacity-90 mb-1">
						<i class="bi bi-calendar-event me-2"></i>{dateRange(
							nextUpcoming.startOn,
							nextUpcoming.endOn
						)}
					</p>
				{/if}
				{#if nextUpcoming.registrationStartAt}
					<p class="opacity-90">Registration opens {longDate(nextUpcoming.registrationStartAt)}</p>
				{/if}
			{:else}
				<h1 class="display-4 fw-bold mb-3">See you next season</h1>
				<p class="lead opacity-90 mb-0" style="max-width: 34rem; margin-inline: auto">
					No camps are open for registration right now. Check back soon — new sessions are announced
					here first.
				</p>
			{/if}
		</div>
	</section>
{/if}

<section class="border-bottom bg-white">
	<div class="container py-4">
		<div class="row text-center g-3">
			<div class="col-4">
				<div class="cp-stat">{data.stats.campers.toLocaleString()}</div>
				<div class="text-muted small text-uppercase">Campers served</div>
			</div>
			<div class="col-4">
				<div class="cp-stat">{data.stats.camps}</div>
				<div class="text-muted small text-uppercase">Camps hosted</div>
			</div>
			<div class="col-4">
				<div class="cp-stat">2023</div>
				<div class="text-muted small text-uppercase">Serving since</div>
			</div>
		</div>
	</div>
</section>

{#if extras.length > 0}
	<div class="container py-5" id="camps">
		<h2 class="h3 mb-4">More open camps</h2>
		<div class="row g-4">
			{#each extras as event (event.id)}
				<div class="col-md-6 col-lg-4">
					<div class="cp-card h-100 p-4 d-flex flex-column">
						<div class="d-flex justify-content-between align-items-start mb-2">
							<h3 class="h5 mb-0">{event.name}</h3>
							{#if event.available > 0}
								<span class="badge cp-badge-avail rounded-pill">{event.available} left</span>
							{:else}
								<span class="badge text-bg-secondary rounded-pill">Full</span>
							{/if}
						</div>
						{#if event.startOn}
							<p class="text-muted small mb-2">
								<i class="bi bi-calendar-event me-1"></i>{dateRange(event.startOn, event.endOn)}
							</p>
						{/if}
						{#if event.description}
							<p class="small text-secondary">{event.description}</p>
						{/if}
						<div class="mt-auto pt-3">
							{#if event.available > 0}
								<a href="/{event.id}" class="btn btn-primary w-100 rounded-pill">
									Register <i class="bi bi-arrow-right ms-1"></i>
								</a>
							{:else}
								<button class="btn btn-outline-secondary w-100 rounded-pill" disabled>
									Sold out
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<section class="bg-white border-top">
	<div class="container py-5">
		<h2 class="h3 text-center mb-5">How it works</h2>
		<div class="row g-4 text-center">
			<div class="col-md-4">
				<div class="cp-timeline-step">
					<div class="cp-timeline-num">1</div>
					<h3 class="h6 mt-3 mb-1">Pick a camp</h3>
					<p class="text-muted small mb-0">Choose an open session that fits your season.</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="cp-timeline-step">
					<div class="cp-timeline-num">2</div>
					<h3 class="h6 mt-3 mb-1">Choose your bed</h3>
					<p class="text-muted small mb-0">Select a room and an open bed, then add your details.</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="cp-timeline-step">
					<div class="cp-timeline-num">3</div>
					<h3 class="h6 mt-3 mb-1">Reserve your spot</h3>
					<p class="text-muted small mb-0">
						Agree to the camp rules and confirm your registration.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

{#if data.upcoming.length > 0}
	<div class="container py-5">
		<h2 class="h3 mb-1">Coming up</h2>
		<p class="text-muted mb-4">Announced sessions — registration isn't open yet.</p>
		<div class="row g-4">
			{#each data.upcoming as event (event.id)}
				<div class="col-md-6 col-lg-4">
					<div class="cp-card h-100 p-4 d-flex flex-column">
						<div class="d-flex justify-content-between align-items-start mb-2">
							<h3 class="h5 mb-0">{event.name}</h3>
							<span class="badge text-bg-light rounded-pill">Soon</span>
						</div>
						{#if event.startOn}
							<p class="text-muted small mb-2">
								<i class="bi bi-calendar-event me-1"></i>{dateRange(event.startOn, event.endOn)}
							</p>
						{/if}
						{#if event.registrationStartAt}
							<p class="small text-secondary mb-0">
								Opens {longDate(event.registrationStartAt)}
							</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

{#if data.past.length > 0}
	<section class="bg-white border-top">
		<div class="container py-5">
			<h2 class="h5 text-muted mb-4">Past camps</h2>
			<ul class="list-unstyled row g-2 mb-0">
				{#each data.past as event (event.id)}
					<li class="col-md-6 col-lg-4">
						<div class="d-flex justify-content-between text-muted small py-1 border-bottom">
							<span>{event.name}</span>
							<span>{dateRange(event.startOn, event.endOn)}</span>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}
