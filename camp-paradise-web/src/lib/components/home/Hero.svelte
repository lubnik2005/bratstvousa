<script lang="ts">
	import { onMount } from 'svelte';
	import { BOOKING_URL } from '$lib/config';
	import { media } from '$lib/stores/media.svelte';
	import { splitReveal } from '$lib/motion/split';
	import { home, site } from '$lib/content/site';
	import Button from '$lib/components/ui/Button.svelte';

	const bookingUrl = BOOKING_URL;

	// Lazy-load the WebGL scene only on desktop when motion is allowed.
	let SceneComp = $state<typeof import('$lib/three/HeroScene.svelte').default | null>(null);
	let use3d = $state(false);

	onMount(async () => {
		if (!media.isMobile && !media.reducedMotion) {
			try {
				const mod = await import('$lib/three/HeroScene.svelte');
				SceneComp = mod.default;
				use3d = true;
			} catch {
				use3d = false;
			}
		}
	});
</script>

<section
	class="hero-desktop bg-forest-deep relative flex min-h-screen items-center overflow-hidden"
>
	<!-- video backdrop (behind the 3d scene, subtle) -->
	<video
		class="absolute inset-0 h-full w-full object-cover opacity-40"
		autoplay
		muted
		loop
		playsinline
		poster="/video/retreat-poster.jpg"
	>
		<source src="/video/retreat-720.webm" type="video/webm" />
		<source src="/video/retreat-720.mp4" type="video/mp4" />
	</video>

	{#if use3d && SceneComp}
		<SceneComp />
	{/if}

	<!-- gradient wash for legibility -->
	<div
		class="from-forest-deep via-forest-deep/40 pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t to-transparent"
	></div>
	<div
		class="from-forest-deep/70 pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r to-transparent"
	></div>

	<div class="relative z-[2] mx-auto w-full max-w-6xl px-6">
		<p
			class="text-mint-bright mb-5 flex items-center gap-2 text-sm font-semibold tracking-widest uppercase"
		>
			<span class="bg-mint-bright inline-block h-px w-8"></span>
			Strawberry Valley, California
		</p>
		<h1
			class="font-display max-w-3xl text-5xl leading-[1.02] font-semibold text-balance text-white md:text-7xl xl:text-[5.5rem]"
			use:splitReveal={{ stagger: 0.06, delay: 0.15 }}
		>
			{home.heroHeadline}
		</h1>
		<p class="text-mint/90 mt-6 max-w-xl text-lg text-pretty">
			{home.heroSub}
		</p>
		<div class="mt-9 flex flex-wrap items-center gap-4">
			<Button href={bookingUrl} external variant="primary" size="lg">Book Now</Button>
			<Button href="/facilities" variant="outline" size="lg">Explore the Camp</Button>
		</div>
		<p class="mt-8 text-sm text-white/60">{site.distances}</p>
	</div>

	<!-- scroll cue -->
	<div class="absolute bottom-8 left-1/2 z-[2] -translate-x-1/2 text-white/60" aria-hidden="true">
		<span class="scroll-cue block h-10 w-6 rounded-full border-2 border-white/40"></span>
	</div>
</section>

<style>
	.scroll-cue {
		position: relative;
	}
	.scroll-cue::after {
		content: '';
		position: absolute;
		top: 6px;
		left: 50%;
		width: 3px;
		height: 8px;
		border-radius: 3px;
		background: currentColor;
		transform: translateX(-50%);
		animation: cue 1.6s ease-in-out infinite;
	}
	@keyframes cue {
		0% {
			opacity: 0;
			transform: translate(-50%, 0);
		}
		40% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(-50%, 12px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scroll-cue::after {
			animation: none;
		}
	}
</style>
