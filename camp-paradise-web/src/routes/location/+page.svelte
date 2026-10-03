<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { site } from '$lib/content/site';

	const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`;
</script>

<svelte:head>
	<title>Location & Directions — Camp Paradise</title>
	<meta
		name="description"
		content="Camp Paradise is located at {site.address
			.full}. Just 1.5 hours from Sacramento and 1.25 hours from Chico."
	/>
</svelte:head>

<PageHero
	image="gallery-14"
	eyebrow="Find us"
	title="Nestled in Strawberry Valley"
	subtitle={site.distances}
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
		<div use:reveal class="space-y-6">
			<div>
				<p class="text-primary text-sm font-semibold tracking-[0.2em] uppercase">Address</p>
				<p class="text-ink mt-2 text-2xl">{site.address.line1}</p>
				<p class="text-ink-soft text-lg">
					{site.address.city}, {site.address.state}
					{site.address.zip}
				</p>
			</div>
			<p class="text-ink-soft text-lg leading-relaxed">{site.distances}</p>
			<div class="flex flex-wrap gap-3">
				<Button href={site.mapsLink} external variant="primary" size="md">Get directions</Button>
				<Button href="/contact" variant="outline-dark" size="md">Plan a visit</Button>
			</div>
		</div>

		<div use:reveal class="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5">
			<iframe
				title="Map to Camp Paradise"
				src={mapSrc}
				width="100%"
				height="440"
				style="border:0;"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				allowfullscreen
			></iframe>
		</div>
	</div>
</section>

<!-- entrance band with floating polaroids -->
<section class="bg-sand-warm relative">
	<div class="relative h-[240px] overflow-hidden sm:h-[300px] lg:h-[380px]">
		<Img
			slug="gallery-04"
			alt="The wooden Camp Paradise entrance sign among pine trees"
			sizes="100vw"
			class="band-img absolute inset-0 h-[120%] w-full object-cover"
		/>
		<div class="from-sand absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent"></div>
		<div
			class="from-sand-warm absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent"
		></div>
		<div
			class="from-sand-warm/80 absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r to-transparent"
		></div>

		<div class="absolute inset-0 mx-auto max-w-6xl px-4">
			<div class="absolute bottom-6 left-4 max-w-xs sm:bottom-10" use:reveal>
				<p class="text-primary text-xs font-semibold tracking-[0.3em] uppercase">You've arrived</p>
				<p class="font-display text-ink mt-2 text-2xl font-semibold lg:text-4xl">
					Where the pavement ends and the pines begin.
				</p>
			</div>
		</div>
	</div>

	<div class="pointer-events-none relative mx-auto max-w-6xl px-4">
		<div class="absolute right-6 -bottom-2 flex items-end sm:right-10 lg:right-16">
			<figure
				use:reveal={{ y: 30, delay: 0.1 }}
				class="polaroid relative z-10 w-28 -rotate-6 bg-white p-1.5 shadow-2xl sm:w-40 lg:w-48"
			>
				<div class="aspect-square overflow-hidden">
					<Img
						slug="gallery-06"
						alt="A small blue camp cabin with an ATV parked outside"
						sizes="12rem"
						class="h-full w-full object-cover"
					/>
				</div>
				<figcaption class="text-ink-soft pt-2 pb-1 text-center text-[10px] font-medium sm:text-xs">
					the cabins
				</figcaption>
			</figure>
			<figure
				use:reveal={{ y: 30, delay: 0.25 }}
				class="polaroid relative -ml-8 w-28 rotate-3 bg-white p-1.5 shadow-2xl sm:-ml-10 sm:w-40 lg:w-48"
			>
				<div class="aspect-square overflow-hidden">
					<Img
						slug="gallery-13"
						alt="A fenced children's playground surrounded by pine trees"
						sizes="12rem"
						class="h-full w-full object-cover"
					/>
				</div>
				<figcaption class="text-ink-soft pt-2 pb-1 text-center text-[10px] font-medium sm:text-xs">
					the playground
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<section class="bg-sand-warm px-4 pt-32 pb-16 sm:pt-40 lg:pt-48 lg:pb-24">
	<div class="mx-auto max-w-6xl" use:reveal>
		<div class="mb-8 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="text-primary text-sm font-semibold tracking-[0.2em] uppercase">Property Map</p>
				<h2 class="text-ink mt-2 text-3xl font-semibold">Camp Paradise Map</h2>
			</div>
			<a
				href="/map.svg"
				download="Camp Paradise Map 2026.svg"
				class="text-primary hover:text-primary-600 flex items-center gap-2 text-sm font-semibold transition"
			>
				<i class="bi bi-download"></i>
				Download map
			</a>
		</div>
		<div class="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5">
			<img
				src="/map.svg"
				alt="Camp Paradise property map showing buildings, facilities, and grounds"
				class="w-full"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<style>
	.polaroid {
		pointer-events: auto;
		transform-origin: bottom center;
	}
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			section :global(.band-img) {
				animation: parallax linear both;
				animation-timeline: view();
			}
		}
	}
	@keyframes parallax {
		from {
			transform: translateY(-14%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
