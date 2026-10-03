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

<section class="bg-sand-warm px-4 py-16 lg:py-24">
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
		<div class="mb-8 grid grid-cols-3 gap-3 lg:gap-5">
			{#each [{ slug: 'gallery-04', alt: 'The wooden Camp Paradise entrance sign among pine trees', cap: 'Welcome in' }, { slug: 'gallery-06', alt: 'A small blue camp cabin with an ATV parked outside', cap: 'Cabins in the pines' }, { slug: 'gallery-13', alt: 'A fenced children’s playground surrounded by pine trees', cap: 'Room for the kids' }] as p, i (p.slug)}
				<figure
					use:reveal={{ delay: i * 0.08 }}
					class="group relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-black/5"
				>
					<Img
						slug={p.slug}
						alt={p.alt}
						sizes="(min-width: 1024px) 22rem, 33vw"
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
					<figcaption
						class="from-forest-deep/85 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-3 text-xs font-semibold text-white sm:text-sm lg:p-4"
					>
						{p.cap}
					</figcaption>
				</figure>
			{/each}
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
