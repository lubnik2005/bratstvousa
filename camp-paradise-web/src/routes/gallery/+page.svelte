<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import Lightbox from '$lib/components/ui/Lightbox.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { gallery } from '$lib/content/site';

	let lightboxIndex = $state(-1);
	const open = (i: number) => (lightboxIndex = i);
	const close = () => (lightboxIndex = -1);
</script>

<svelte:head>
	<title>Gallery — Camp Paradise</title>
	<meta name="description" content="A glimpse of life and scenery at Camp Paradise." />
</svelte:head>

<PageHero
	image="gallery-02"
	eyebrow="See for yourself"
	title="Moments from the mountain"
	subtitle="A glimpse of the scenery, the people, and the memories."
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="columns-2 gap-4 md:columns-3 lg:columns-4 [&>button]:mb-4">
			{#each gallery as slug, i (slug)}
				<button
					use:reveal={{ delay: (i % 4) * 0.05 }}
					class="group block w-full overflow-hidden rounded-2xl ring-1 ring-black/5"
					onclick={() => open(i)}
					aria-label="Open photo {i + 1}"
				>
					<Img
						{slug}
						alt="Camp Paradise photo {i + 1}"
						sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
						class="w-full transition duration-500 group-hover:scale-105"
					/>
				</button>
			{/each}
		</div>
	</div>
</section>

{#if lightboxIndex >= 0}
	<Lightbox slugs={gallery} bind:index={lightboxIndex} onClose={close} />
{/if}
