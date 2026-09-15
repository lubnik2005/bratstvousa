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

<section class="bg-primary text-white py-5">
	<div class="container py-4">
		<h1 class="display-5 fw-bold mb-2">Camp Paradise</h1>
		<p class="lead mb-0 opacity-75">Pick a camp, choose your bed, and reserve your spot.</p>
	</div>
</section>

<div class="container py-5">
	{#if data.events.length === 0}
		<div class="text-center text-muted py-5">
			<i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
			<p class="mb-0">No camps are open for registration right now. Please check back soon.</p>
		</div>
	{:else}
		<div class="row g-4">
			{#each data.events as event (event.id)}
				<div class="col-md-6 col-lg-4">
					<div class="card h-100 shadow-sm">
						<div class="card-body d-flex flex-column">
							<h2 class="h5 card-title">{event.name}</h2>
							{#if event.startOn}
								<p class="text-muted small mb-2">
									<i class="bi bi-calendar-event me-1"></i>{dateRange(event.startOn, event.endOn)}
								</p>
							{/if}
							{#if event.description}
								<p class="card-text small text-secondary">{event.description}</p>
							{/if}
							<div class="mt-auto pt-3">
								{#if event.available > 0}
									<span class="badge text-bg-success mb-2">{event.available} beds available</span>
									<a href="/{event.id}" class="btn btn-primary w-100">Register</a>
								{:else}
									<span class="badge text-bg-secondary mb-2">Full</span>
									<button class="btn btn-outline-secondary w-100" disabled>Sold out</button>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
