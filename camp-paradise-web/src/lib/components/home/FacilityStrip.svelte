<script lang="ts">
	import { onMount } from 'svelte';
	import { facilities } from '$lib/content/site';
	import { media } from '$lib/stores/media.svelte';
	import { loadGsap } from '$lib/motion/gsap';
	import Img from '$lib/components/ui/Img.svelte';

	let section: HTMLElement;
	let track: HTMLElement;

	onMount(() => {
		if (media.isMobile || media.reducedMotion) return;

		let cleanup: (() => void) | undefined;
		let cancelled = false;

		(async () => {
			const { gsap, ScrollTrigger } = await loadGsap();
			if (cancelled || !track || !section) return;

			const distance = () => track.scrollWidth - section.clientWidth;

			const tween = gsap.to(track, {
				x: () => -distance(),
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					start: 'top top',
					end: () => `+=${distance()}`,
					scrub: 0.6,
					pin: true,
					invalidateOnRefresh: true,
					anticipatePin: 1
				}
			});

			cleanup = () => {
				tween.scrollTrigger?.kill();
				tween.kill();
				ScrollTrigger.refresh();
			};
		})();

		return () => {
			cancelled = true;
			cleanup?.();
		};
	});
</script>

<section bind:this={section} class="facility-strip bg-forest relative overflow-hidden text-white">
	<div class="pointer-events-none absolute inset-0 opacity-10">
		<div class="bg-primary absolute top-10 -left-24 h-72 w-72 rounded-full blur-3xl"></div>
		<div class="bg-mint-bright absolute -right-16 bottom-0 h-80 w-80 rounded-full blur-3xl"></div>
	</div>

	<div class="relative z-10 flex h-full flex-col justify-center py-20 lg:min-h-screen">
		<div class="mx-auto mb-10 w-full max-w-6xl px-6 lg:mb-14">
			<p class="text-mint-bright text-sm font-semibold tracking-[0.2em] uppercase">
				Room to gather
			</p>
			<h2 class="mt-3 max-w-2xl text-4xl font-semibold text-balance lg:text-6xl">
				Facilities built for comfort and community
			</h2>
		</div>

		<div
			bind:this={track}
			class="facility-track flex gap-6 px-6 lg:gap-8 lg:px-[max(1.5rem,calc((100vw-72rem)/2))]"
		>
			{#each facilities as facility (facility.slug)}
				<article
					class="group bg-forest-deep relative w-[78vw] shrink-0 overflow-hidden rounded-3xl shadow-2xl sm:w-[60vw] lg:w-[26rem]"
				>
					<div class="aspect-[4/5] overflow-hidden">
						<Img
							slug={facility.image}
							alt={facility.name}
							sizes="(max-width: 1024px) 78vw, 26rem"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
					</div>
					<div
						class="from-forest-deep via-forest-deep/30 absolute inset-0 bg-gradient-to-t to-transparent"
					></div>
					<div class="absolute inset-x-0 bottom-0 p-6 lg:p-7">
						{#if facility.capacity}
							<span
								class="bg-primary/90 mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
							>
								{facility.capacity}
							</span>
						{/if}
						<h3 class="text-2xl font-semibold lg:text-3xl">{facility.name}</h3>
						<p class="mt-2 text-sm text-pretty text-white/80">{facility.blurb}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.facility-track {
		will-change: transform;
	}
</style>
