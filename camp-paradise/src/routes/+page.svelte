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
</script>

<svelte:head>
	<title>Camp Paradise — Register</title>
	<meta name="description" content="Reserve your spot at Camp Paradise." />
</svelte:head>

<section class="cp-hero py-5">
	<div class="container py-5">
		<div class="row align-items-center g-4">
			<div class="col-lg-7">
				<span class="badge cp-badge-avail rounded-pill mb-3 px-3 py-2">
					<i class="bi bi-sun me-1"></i>Registration is open
				</span>
				<h1 class="display-3 fw-bold mb-3">Find your place at Camp&nbsp;Paradise</h1>
				<p class="lead mb-4 opacity-90" style="max-width: 34rem">
					Pick a camp, choose your bed, and reserve your spot in minutes. A place to rest, grow, and
					belong.
				</p>
				<a href="#camps" class="btn btn-light btn-lg rounded-pill px-4 fw-semibold text-success">
					Browse camps <i class="bi bi-arrow-down ms-1"></i>
				</a>
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

<div class="container py-5" id="camps">
	<div class="d-flex align-items-end justify-content-between mb-4">
		<div>
			<h2 class="h3 mb-1">Upcoming camps</h2>
			<p class="text-muted mb-0">Choose a session to begin your registration.</p>
		</div>
	</div>

	{#if data.events.length === 0}
		<div class="text-center text-muted py-5">
			<i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
			<p class="mb-0">No camps are open for registration right now. Please check back soon.</p>
		</div>
	{:else}
		<div class="row g-4">
			{#each data.events as event (event.id)}
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
	{/if}
</div>
