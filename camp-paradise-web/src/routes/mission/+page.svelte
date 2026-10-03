<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import PhotoStrip from '$lib/components/ui/PhotoStrip.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { mission, leaders } from '$lib/content/site';
</script>

<svelte:head>
	<title>Our Mission — Camp Paradise</title>
	<meta
		name="description"
		content="Camp Paradise exists to help people see, know, and experience God. Read our mission, vision, and statement of faith."
	/>
</svelte:head>

<PageHero
	image="gallery-07"
	eyebrow="Who we are"
	title="Our mission and vision"
	subtitle="A place set apart to grow in faith and in relationship with Jesus Christ."
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto max-w-3xl space-y-14">
		<article use:reveal class="space-y-4">
			<h2 class="text-primary text-sm font-semibold tracking-[0.2em] uppercase">Mission</h2>
			<p class="text-ink-soft text-lg leading-relaxed lg:text-xl">{mission.mission}</p>
		</article>

		<article use:reveal class="space-y-4">
			<h2 class="text-primary text-sm font-semibold tracking-[0.2em] uppercase">Vision</h2>
			<p class="text-ink-soft text-lg leading-relaxed lg:text-xl">{mission.vision}</p>
		</article>

		<article use:reveal class="space-y-4">
			<h2 class="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
				Statement of Faith
			</h2>
			<p class="text-ink-soft text-lg leading-relaxed lg:text-xl">{mission.statementOfFaith}</p>
		</article>
	</div>
</section>

<section class="bg-forest-deep relative isolate overflow-hidden px-4 py-24 lg:py-36">
	<Img
		slug="gallery-05"
		alt="Campers singing together at an outdoor daytime worship service"
		sizes="100vw"
		class="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
	/>
	<div
		class="from-forest-deep via-forest-deep/60 absolute inset-0 -z-10 bg-gradient-to-t to-transparent"
	></div>
	<p
		use:reveal
		class="mx-auto max-w-3xl text-center text-3xl font-semibold text-balance text-white lg:text-5xl"
	>
		See God. Know God. Experience God.
	</p>
</section>

<section class="bg-sand px-4 pt-16 lg:pt-24">
	<div class="mx-auto max-w-6xl">
		<PhotoStrip
			photos={[
				{
					slug: 'gallery-16',
					alt: 'Children gathered for a lesson beside a wooden cross',
					caption: 'Teaching the next generation'
				},
				{
					slug: 'gallery-08',
					alt: 'Campers singing around a campfire with a guitar',
					caption: 'Songs by the fire'
				},
				{
					slug: 'gallery-02',
					alt: 'A nighttime gathering under glowing string lights',
					caption: 'Nights under the lights'
				}
			]}
		/>
	</div>
</section>

<section class="bg-sand-warm px-4 py-16 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div use:reveal class="mb-12 text-center">
			<p class="text-primary text-sm font-semibold tracking-[0.2em] uppercase">The people</p>
			<h2 class="text-ink mt-2 text-3xl lg:text-4xl">Camp leadership</h2>
		</div>
		<div class="mx-auto grid max-w-xl grid-cols-2 gap-6">
			{#each leaders as leader, i (leader.slug)}
				<figure use:reveal={{ delay: (i % 4) * 0.08 }} class="text-center">
					<div class="mx-auto aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
						<Img
							slug={leader.image}
							alt={leader.name}
							sizes="(min-width: 640px) 22vw, 45vw"
							class="h-full w-full object-cover"
						/>
					</div>
					<figcaption class="mt-4">
						<p class="text-ink font-semibold">{leader.name}</p>
						<p class="text-ink-soft text-sm">{leader.title}</p>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>
