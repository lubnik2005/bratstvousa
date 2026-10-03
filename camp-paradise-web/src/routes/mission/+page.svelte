<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Img from '$lib/components/ui/Img.svelte';
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

<section class="bg-forest-deep quote relative isolate overflow-hidden px-4 py-28 lg:py-44">
	<Img
		slug="gallery-05"
		alt="Campers singing together at an outdoor daytime worship service"
		sizes="100vw"
		class="quote-img absolute inset-0 -z-10 h-[120%] w-full object-cover opacity-45"
	/>
	<div
		class="from-forest-deep via-forest-deep/50 to-forest-deep/70 absolute inset-0 -z-10 bg-gradient-to-b"
	></div>
	<div class="mx-auto max-w-4xl text-center" use:reveal>
		<p class="text-mint-bright mb-6 text-xs font-semibold tracking-[0.35em] uppercase">
			Why we exist
		</p>
		<p
			class="font-display text-4xl leading-[1.05] font-semibold text-balance text-white sm:text-5xl lg:text-7xl"
		>
			See God.<br />
			<span class="text-mint">Know God.</span><br />
			Experience God.
		</p>
		<div class="bg-primary mx-auto mt-10 h-px w-24"></div>
	</div>
</section>

<!-- window-pane panels: zero gap, unequal widths -->
<section class="bg-forest-deep panes grid grid-cols-1 sm:grid-cols-[2fr_3fr_2fr]">
	{#each [{ slug: 'gallery-16', alt: 'Children gathered for a lesson beside a wooden cross', caption: 'Teaching the next generation', ref: 'Deut. 6:7' }, { slug: 'gallery-08', alt: 'Campers singing around a campfire with a guitar', caption: 'Songs by the fire', ref: 'Psalm 95:1' }, { slug: 'gallery-02', alt: 'A nighttime gathering under glowing string lights', caption: 'Nights under the lights', ref: 'Matt. 18:20' }] as p, i (p.slug)}
		<figure
			use:reveal={{ y: 0, delay: i * 0.12, duration: 1 }}
			class="pane group relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-[520px] lg:h-[600px]"
		>
			<Img
				slug={p.slug}
				alt={p.alt}
				sizes="(min-width: 640px) 45vw, 100vw"
				class="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
			/>
			<div
				class="from-forest-deep/90 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
			></div>
			{#if i < 2}
				<span
					aria-hidden="true"
					class="bg-forest-deep absolute inset-y-0 right-0 hidden w-px sm:block"
				></span>
			{/if}
			<figcaption class="absolute inset-x-0 bottom-0 p-6 lg:p-8">
				<p class="text-mint-bright mb-2 text-[11px] font-semibold tracking-[0.3em] uppercase">
					{p.ref}
				</p>
				<p class="text-xl font-semibold text-white lg:text-2xl">{p.caption}</p>
			</figcaption>
		</figure>
	{/each}
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

<style>
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.quote :global(.quote-img) {
				animation: parallax linear both;
				animation-timeline: view();
			}
		}
	}
	@keyframes parallax {
		from {
			transform: translateY(-12%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
