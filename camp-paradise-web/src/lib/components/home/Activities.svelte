<script lang="ts">
	import { activities, activitiesNote } from '$lib/content/site';
	import { reveal } from '$lib/motion/reveal';
	import { tilt } from '$lib/motion/tilt';
	import Img from '$lib/components/ui/Img.svelte';
</script>

<section class="bg-sand-warm relative py-24 lg:py-32">
	<div class="mx-auto max-w-6xl px-6">
		<div class="max-w-2xl" use:reveal>
			<p class="text-primary-600 text-sm font-semibold tracking-[0.2em] uppercase">Things to do</p>
			<h2 class="text-ink mt-3 text-4xl font-semibold text-balance lg:text-6xl">
				Adventure around every corner
			</h2>
		</div>

		<div class="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-16 lg:grid-cols-4 lg:gap-6">
			{#each activities as activity, i (activity.name)}
				<div use:reveal={{ delay: (i % 4) * 0.06 }}>
					<div
						use:tilt={{ max: 10, scale: 1.03 }}
						class="activity-card border-ink/5 flex h-full flex-col items-start gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
					>
						<span
							class="bg-primary/10 text-primary-600 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
						>
							<i class="bi bi-{activity.icon}"></i>
						</span>
						<h3 class="text-ink text-lg font-semibold">{activity.name}</h3>
					</div>
				</div>
			{/each}
		</div>

		<p class="text-ink-soft mt-10 text-center text-lg font-medium" use:reveal>
			{activitiesNote}
		</p>
	</div>

	<!-- full-bleed photo band -->
	<div class="band relative mt-20 h-[280px] overflow-hidden sm:h-[360px] lg:mt-28 lg:h-[460px]">
		<Img
			slug="gallery-18"
			alt="Campers playing with a giant beach ball"
			sizes="100vw"
			class="band-img absolute inset-0 h-[120%] w-full object-cover object-[center_60%]"
		/>
		<div class="from-sand-warm absolute inset-x-0 top-0 h-16 bg-gradient-to-b to-transparent"></div>
		<div
			class="from-sand-warm absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
		></div>
		<div
			class="pointer-events-none absolute inset-0 flex items-end justify-between px-6 pb-8 lg:px-[max(1.5rem,calc((100vw-72rem)/2))]"
		>
			<p class="text-xs font-semibold tracking-[0.25em] text-white/80 uppercase drop-shadow">
				Summer 2025
			</p>
			<p
				class="hidden text-xs font-semibold tracking-[0.25em] text-white/80 uppercase drop-shadow sm:block"
			>
				Strawberry Valley, CA
			</p>
		</div>
	</div>

	<p class="mt-10 text-center lg:mt-14" use:reveal>
		<a
			href="/gallery"
			class="bg-forest hover:bg-forest-deep inline-flex items-center gap-3 rounded-full py-3 pr-5 pl-6 text-sm font-semibold text-white shadow-lg transition"
		>
			Browse the gallery
			<span class="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs">
				<i class="bi bi-arrow-right"></i>
			</span>
		</a>
	</p>
</section>

<style>
	.activity-card {
		transform-style: preserve-3d;
	}
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.band :global(.band-img) {
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
