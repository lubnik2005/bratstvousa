<script lang="ts">
	import { facilities } from '$lib/content/site';
	import Img from '$lib/components/ui/Img.svelte';
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import { reveal } from '$lib/motion/reveal';
</script>

<svelte:head>
	<title>Facilities · Camp Paradise</title>
	<meta
		name="description"
		content="Dorms, cabins, RV parking, dining hall, chapel and sauna — everything your group needs at Camp Paradise."
	/>
</svelte:head>

<PageHero
	eyebrow="The grounds"
	title="Facilities built for comfort and community"
	subtitle="From cozy cabins in the pines to a chapel that seats 300, there's room for every group."
	image="lodging"
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
		{#each facilities as facility, i (facility.slug)}
			<article
				class="group ring-ink/5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1"
				use:reveal={{ delay: (i % 2) * 0.08 }}
			>
				<div class="relative aspect-[16/10] overflow-hidden">
					<Img
						slug={facility.image}
						alt={facility.name}
						sizes="(min-width: 768px) 45vw, 100vw"
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
					{#if facility.capacity}
						<span
							class="bg-primary absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
						>
							{facility.capacity}
						</span>
					{/if}
				</div>
				<div class="p-6 lg:p-8">
					<h2 class="text-ink text-2xl">{facility.name}</h2>
					<p class="text-ink-soft mt-2 text-pretty">{facility.blurb}</p>
				</div>
			</article>
		{/each}
	</div>
</section>
