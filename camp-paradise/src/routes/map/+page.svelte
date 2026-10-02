<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { MAP_HOTSPOTS, MAP_IMAGE } from '$lib/map-hotspots';
	import type { MapHotspot } from '$lib/map-hotspots';

	const ZOOM_LEVELS = [1, 1.75, 2.5];

	let selected: MapHotspot | null = null;
	let zoomIndex = 0;
	let viewport: HTMLDivElement;

	$: zoom = ZOOM_LEVELS[zoomIndex];

	const select = (spot: MapHotspot) => {
		selected = selected?.id === spot.id ? null : spot;
	};

	const close = () => (selected = null);

	// Zoom around the current viewport center so the user keeps their place.
	const setZoom = (next: number) => {
		if (next < 0 || next >= ZOOM_LEVELS.length || !viewport) return;
		const ratio = ZOOM_LEVELS[next] / zoom;
		const cx = viewport.scrollLeft + viewport.clientWidth / 2;
		const cy = viewport.scrollTop + viewport.clientHeight / 2;
		zoomIndex = next;
		requestAnimationFrame(() => {
			viewport.scrollLeft = cx * ratio - viewport.clientWidth / 2;
			viewport.scrollTop = cy * ratio - viewport.clientHeight / 2;
		});
	};

	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') close();
	};
</script>

<svelte:head>
	<title>Camp Paradise — Camp map</title>
</svelte:head>

<svelte:window on:keydown={onKey} />

<section class="bg-forest-deep relative isolate overflow-hidden px-4 pt-10 pb-10 lg:pt-14 lg:pb-12">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(91,228,155,0.18),transparent_60%)]"
	></div>
	<div class="mx-auto max-w-7xl">
		<p class="eyebrow">Camp map</p>
		<h1 class="mt-2 text-3xl text-white lg:text-5xl">Find your way around</h1>
		<p class="mt-2 text-mint/90">Tap a lodge to see its floor plan and room numbers.</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-10">
	<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
		<!-- Map -->
		<div
			class="relative min-w-0 flex-1 overflow-hidden rounded-3xl bg-white shadow-xl shadow-ink/5 ring-1 ring-ink/5"
		>
			<div bind:this={viewport} class="map-viewport overflow-auto overscroll-contain">
				<div
					class="relative transition-[width] duration-300 ease-out"
					style="width: {zoom * 100}%; aspect-ratio: {MAP_IMAGE.width} / {MAP_IMAGE.height};"
				>
					<img
						src={MAP_IMAGE.src}
						width={MAP_IMAGE.width}
						height={MAP_IMAGE.height}
						alt="Illustrated map of Camp Paradise"
						class="absolute inset-0 h-full w-full select-none"
						draggable="false"
					/>
					{#each MAP_HOTSPOTS as spot (spot.id)}
						<button
							type="button"
							class="hotspot"
							class:active={selected?.id === spot.id}
							style="left: {spot.box.left}%; top: {spot.box.top}%; width: {spot.box
								.width}%; height: {spot.box.height}%;"
							aria-label="Show {spot.name} floor plan"
							aria-pressed={selected?.id === spot.id}
							on:click={() => select(spot)}
						>
							<span class="hotspot-ping"></span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Zoom controls -->
			<div class="absolute right-3 bottom-3 flex flex-col overflow-hidden rounded-2xl glass-dark">
				<button
					type="button"
					class="grid h-10 w-10 place-items-center text-white transition hover:bg-white/10 disabled:opacity-40"
					aria-label="Zoom in"
					disabled={zoomIndex === ZOOM_LEVELS.length - 1}
					on:click={() => setZoom(zoomIndex + 1)}
				>
					<i class="bi bi-plus-lg"></i>
				</button>
				<span class="h-px bg-white/15"></span>
				<button
					type="button"
					class="grid h-10 w-10 place-items-center text-white transition hover:bg-white/10 disabled:opacity-40"
					aria-label="Zoom out"
					disabled={zoomIndex === 0}
					on:click={() => setZoom(zoomIndex - 1)}
				>
					<i class="bi bi-dash-lg"></i>
				</button>
			</div>
		</div>

		<!-- Desktop side panel -->
		<aside class="hidden w-[26rem] shrink-0 lg:block lg:sticky lg:top-28">
			{#if selected}
				{#key selected.id}
					<div
						class="rounded-3xl bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/5"
						in:fly={{ x: 24, duration: 250, easing: cubicOut }}
					>
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="eyebrow text-primary-600!">Floor plan</p>
								<h2 class="font-display mt-1 text-2xl text-ink">{selected.name}</h2>
								<p class="mt-1 text-sm text-ink-soft">{selected.description}</p>
							</div>
							<button
								type="button"
								class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/5 text-ink transition hover:bg-ink/10"
								aria-label="Close floor plan"
								on:click={close}
							>
								<i class="bi bi-x-lg"></i>
							</button>
						</div>
						<a
							href={selected.floorPlan.pdf}
							target="_blank"
							rel="noopener"
							class="mt-5 block overflow-hidden rounded-2xl ring-1 ring-ink/10 transition hover:ring-primary/50"
							title="Open full-size floor plan"
						>
							<img
								src={selected.floorPlan.src}
								width={selected.floorPlan.width}
								height={selected.floorPlan.height}
								alt="{selected.name} floor plan"
								class="h-auto w-full bg-white"
							/>
						</a>
						<a
							href={selected.floorPlan.pdf}
							target="_blank"
							rel="noopener"
							class="bg-primary shadow-primary/25 hover:bg-primary-600 mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-lg transition"
						>
							<i class="bi bi-arrows-fullscreen"></i> Open full floor plan
						</a>
					</div>
				{/key}
			{:else}
				<div class="rounded-3xl border-2 border-dashed border-ink/10 p-8 text-center text-ink-soft">
					<i class="bi bi-hand-index-thumb text-primary text-3xl"></i>
					<p class="font-display mt-3 text-lg text-ink">Pick a lodge</p>
					<p class="mt-1 text-sm">
						Click Lodge 1, 2 or 3 on the map to see its rooms and how many each one sleeps.
					</p>
					<div class="mt-5 flex flex-wrap justify-center gap-2">
						{#each MAP_HOTSPOTS as spot (spot.id)}
							<button
								type="button"
								class="rounded-full bg-mint/40 px-4 py-1.5 text-sm font-semibold text-forest transition hover:bg-mint"
								on:click={() => select(spot)}
							>
								{spot.name}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</aside>
	</div>
	<!-- Mobile quick picks -->
	<div class="mt-4 flex flex-wrap gap-2 lg:hidden">
		{#each MAP_HOTSPOTS as spot (spot.id)}
			<button
				type="button"
				class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-forest shadow-md shadow-ink/5 ring-1 ring-ink/10 transition active:scale-95"
				on:click={() => select(spot)}
			>
				<i class="bi bi-building text-primary"></i>
				{spot.name}
			</button>
		{/each}
	</div>
</section>

<!-- Mobile bottom sheet -->
{#if selected}
	<div class="lg:hidden">
		<button
			type="button"
			class="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-[2px]"
			aria-label="Close floor plan"
			on:click={close}
			transition:fade={{ duration: 200 }}
		></button>
		<div
			class="sheet fixed inset-x-0 bottom-0 z-[61] flex flex-col rounded-t-3xl bg-white shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-label="{selected.name} floor plan"
			transition:fly={{ y: 400, duration: 300, easing: cubicOut }}
		>
			<div class="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-ink/15"></div>
			<div class="flex items-start justify-between gap-4 px-5 pt-3">
				<div>
					<p class="eyebrow text-primary-600!">Floor plan</p>
					<h2 class="font-display mt-0.5 text-2xl text-ink">{selected.name}</h2>
					<p class="mt-0.5 text-sm text-ink-soft">{selected.description}</p>
				</div>
				<button
					type="button"
					class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/5 text-ink"
					aria-label="Close floor plan"
					on:click={close}
				>
					<i class="bi bi-x-lg"></i>
				</button>
			</div>

			<!-- The plans are very wide, so on phones they fill the sheet height and pan sideways. -->
			<div class="plan-scroll mt-4 min-h-0 flex-1 overflow-x-auto overscroll-contain px-5">
				{#key selected.id}
					<img
						src={selected.floorPlan.src}
						width={selected.floorPlan.width}
						height={selected.floorPlan.height}
						alt="{selected.name} floor plan"
						class="h-full w-auto max-w-none rounded-2xl bg-white ring-1 ring-ink/10"
						in:fade={{ duration: 200 }}
					/>
				{/key}
			</div>
			<p class="mt-2 px-5 text-center text-xs text-ink-soft">
				<i class="bi bi-arrow-left-right"></i> Swipe to see the whole lodge
			</p>

			<div class="sheet-footer flex gap-2 px-5 pt-3">
				{#each MAP_HOTSPOTS as spot (spot.id)}
					<button
						type="button"
						class="flex-1 rounded-full px-3 py-2 text-sm font-semibold transition {selected.id ===
						spot.id
							? 'bg-forest text-white'
							: 'bg-ink/5 text-ink'}"
						on:click={() => (selected = spot)}
					>
						{spot.name}
					</button>
				{/each}
				<a
					href={selected.floorPlan.pdf}
					target="_blank"
					rel="noopener"
					class="bg-primary grid h-9 w-11 shrink-0 place-items-center rounded-full text-white"
					aria-label="Open full floor plan"
				>
					<i class="bi bi-arrows-fullscreen"></i>
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.map-viewport {
		max-height: calc(100vh - 7rem);
		-webkit-overflow-scrolling: touch;
	}
	.hotspot {
		position: absolute;
		border-radius: 0.4rem;
		cursor: pointer;
		outline: 2px solid transparent;
		outline-offset: 2px;
		transition:
			outline-color 0.2s,
			background-color 0.2s,
			box-shadow 0.2s;
	}
	.hotspot:hover,
	.hotspot:focus-visible {
		outline-color: var(--color-mint-bright, #5be49b);
		background: rgba(91, 228, 155, 0.18);
	}
	.hotspot.active {
		outline: 3px solid var(--color-mint-bright, #5be49b);
		background: rgba(91, 228, 155, 0.25);
		box-shadow: 0 0 0 6px rgba(91, 228, 155, 0.25);
	}
	.hotspot-ping {
		position: absolute;
		top: -0.25rem;
		right: -0.25rem;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--color-mint-bright, #5be49b);
		box-shadow: 0 0 0 2px white;
	}
	.hotspot-ping::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: inherit;
		animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
	@media (min-width: 64rem) {
		.hotspot-ping {
			width: 0.75rem;
			height: 0.75rem;
			top: -0.35rem;
			right: -0.35rem;
		}
	}
	.hotspot.active .hotspot-ping {
		display: none;
	}
	@keyframes ping {
		75%,
		100% {
			transform: scale(2.4);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hotspot-ping::after {
			animation: none;
		}
	}
	.sheet {
		height: 75vh;
		height: 75dvh;
	}
	.sheet-footer {
		padding-bottom: calc(1rem + var(--safe-bottom, 0px));
	}
	.plan-scroll {
		scrollbar-width: none;
	}
</style>
