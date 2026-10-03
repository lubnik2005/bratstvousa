<script lang="ts">
	import PageHero from '$lib/components/ui/PageHero.svelte';
	import Img from '$lib/components/ui/Img.svelte';
	import { reveal } from '$lib/motion/reveal';
	import { donate } from '$lib/content/site';

	const photos = [
		{
			slug: 'gallery-08',
			alt: 'Campers singing around a campfire with a guitar',
			caption: 'Campfire worship',
			sub: 'Firewood, guitars, and late nights'
		},
		{
			slug: 'gallery-16',
			alt: 'Children gathered for a lesson beside a wooden cross',
			caption: 'Kids learning about Jesus',
			sub: 'Curriculum, crafts, and leaders'
		},
		{
			slug: 'gallery-14',
			alt: 'A large evening outdoor camp meeting',
			caption: 'Gatherings for hundreds',
			sub: 'Sound, seating, and shelter'
		},
		{
			slug: 'gallery-12',
			alt: 'A group balancing together on a bridge over the pond',
			caption: 'Grounds kept beautiful',
			sub: 'Trails, bridges, and the pond'
		}
	];
</script>

<svelte:head>
	<title>Support Our Mission — Camp Paradise</title>
	<meta
		name="description"
		content="Even the smallest donations go a long way. Support the mission of Camp Paradise."
	/>
	<!-- Zeffy donation embed -->
	<script src="https://www.zeffy.com/embed/v2/zeffy-embed.js"></script>
</svelte:head>

<PageHero
	image="gallery-09"
	eyebrow="Give"
	title="Support our mission"
	subtitle="Even the smallest donations go a long way."
/>

<section class="bg-sand px-4 py-16 lg:py-24">
	<div class="mx-auto max-w-3xl">
		<p use:reveal class="text-ink-soft text-center text-lg leading-relaxed lg:text-xl">
			{donate.intro}
		</p>

		<div
			use:reveal
			class="mt-12 overflow-hidden rounded-3xl bg-white p-2 shadow-lg ring-1 ring-black/5"
		>
			<div data-zeffy-embed data-form-url="/embed/donation-form/camp-paradise"></div>
			<div data-zeffy-embed-fallback style="display:none;">
				<div style="position:relative;overflow:hidden;height:450px;width:100%;">
					<iframe
						title="Donation form powered by Zeffy"
						style="position:absolute;border:0;top:0;left:0;bottom:0;right:0;width:100%;height:100%"
						data-zeffy-embed-src="https://www.zeffy.com/embed/donation-form/camp-paradise"
						allow="payment"
					></iframe>
				</div>
			</div>
		</div>

		<p use:reveal class="text-ink mt-14 text-center text-lg font-medium">
			God bless you for your generosity!
		</p>
	</div>
</section>

<!-- what your gift makes possible: slow photo marquee -->
<section class="bg-forest-deep overflow-hidden py-20 lg:py-28">
	<div class="mx-auto max-w-6xl px-4 text-center" use:reveal>
		<p class="text-mint-bright text-xs font-semibold tracking-[0.3em] uppercase">Your impact</p>
		<h2 class="font-display mt-3 text-3xl font-semibold text-balance text-white lg:text-5xl">
			What your gift makes possible
		</h2>
	</div>

	<div class="marquee-mask mt-12 lg:mt-16">
		<div class="marquee-track flex gap-5 lg:gap-8">
			{#each [0, 1] as copy (copy)}
				{#each photos as p, i (`${copy}-${p.slug}`)}
					<figure
						aria-hidden={copy === 1}
						class="ring-primary/50 relative w-[300px] shrink-0 overflow-hidden rounded-3xl ring-2 sm:w-[380px] lg:w-[460px]"
						class:translate-y-6={i % 2 === 1}
					>
						<div class="aspect-[4/3]">
							<Img
								slug={p.slug}
								alt={copy === 0 ? p.alt : ''}
								sizes="460px"
								class="h-full w-full object-cover"
							/>
						</div>
						<div
							class="from-forest-deep/90 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
						></div>
						<figcaption class="absolute right-5 bottom-5 left-5">
							<p class="text-lg font-semibold text-white lg:text-xl">{p.caption}</p>
							<p class="text-mint text-xs lg:text-sm">{p.sub}</p>
						</figcaption>
					</figure>
				{/each}
			{/each}
		</div>
	</div>

	<p class="mt-14 text-center text-base text-white/60 italic lg:mt-16" use:reveal>
		Your donation keeps these moments alive.
	</p>
</section>

<style>
	.marquee-mask {
		-webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
		mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
	}
	.marquee-track {
		width: max-content;
		padding-bottom: 1.5rem;
		animation: marquee 55s linear infinite;
	}
	.marquee-track:hover {
		animation-play-state: paused;
	}
	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
			width: auto;
			flex-wrap: wrap;
			justify-content: center;
			padding: 0 1rem;
		}
		.marquee-track figure[aria-hidden='true'] {
			display: none;
		}
	}
</style>
